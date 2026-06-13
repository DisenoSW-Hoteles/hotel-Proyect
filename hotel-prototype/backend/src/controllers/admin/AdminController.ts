import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors/AppError';
import { AppDataSource } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

const AMENITIES_POR_TIPO: Record<string, string[]> = {
  ESTANDAR: ['WiFi', 'TV', 'Baño privado', 'Aire acondicionado'],
  PLUS: ['WiFi', 'TV', 'Baño privado', 'Aire acondicionado', 'Frigobar', 'Bañera'],
  SUITE_EJECUTIVA: [
    'WiFi',
    'TV 4K',
    'Baño privado',
    'Aire acondicionado',
    'Frigobar',
    'Jacuzzi',
    'Sala de estar',
    'Cocina equipada',
  ],
};

function mapEstadoToStatus(estado: string): string {
  const map: Record<string, string> = {
    DISPONIBLE: 'AVAILABLE',
    OCUPADA: 'OCCUPIED',
    SUCIA: 'CLEANING',
    EN_REPARACION: 'MAINTENANCE',
    BLOQUEADA: 'MAINTENANCE',
  };
  return map[estado] ?? 'AVAILABLE';
}

// ─── TIPOS INTERNOS ───────────────────────────────────────────────────────────

interface MockCompanion {
  id: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: 'RUT' | 'PASSPORT';
  registered_at?: string;
}

interface MockReservation {
  id: string;
  confirmation_code: string;
  guest: {
    id: string;
    first_name: string;
    last_name: string;
    document_number: string;
    document_type: string;
    nationality: string;
    email: string;
    phone: string;
  };
  room: { id: string; number: string; type: string };
  check_in_date: string;
  check_out_date: string;
  declared_companions: number;
  registered_companions: MockCompanion[];
  status: string;
  special_requests: string;
  branch: string;
  base_rate: number;
  nights: number;
}

interface MockCharge {
  id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
  date: string;
  added_by: string;
}

interface MockFolio {
  id: string;
  reservation_id: string;
  guest: { id: string; first_name: string; last_name: string; document_number: string };
  room: { id: string; number: string; type: string };
  check_in_date: string;
  check_out_date?: string;
  charges: MockCharge[];
  status: string;
}

// ─── DATOS MOCK EN MEMORIA (respaldo para la demo offline) ────────────────────

const MOCK_RESERVATIONS: Map<string, MockReservation> = new Map([
  [
    'HTL-2026-00101',
    {
      id: 'res-001',
      confirmation_code: 'HTL-2026-00101',
      guest: {
        id: 'guest-001',
        first_name: 'María',
        last_name: 'González',
        document_number: '15.234.567-8',
        document_type: 'RUT',
        nationality: 'Chilena',
        email: 'mgonzalez@gmail.com',
        phone: '+56 9 8765 4321',
      },
      room: { id: '1', number: '101', type: 'ESTANDAR' },
      check_in_date: new Date().toISOString().split('T')[0],
      check_out_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      declared_companions: 1,
      registered_companions: [],
      status: 'CONFIRMED',
      special_requests: 'Solicita cama doble adicional.',
      branch: 'TEMUCO',
      base_rate: 50000,
      nights: 3,
    },
  ],
  [
    'HTL-2026-00102',
    {
      id: 'res-002',
      confirmation_code: 'HTL-2026-00102',
      guest: {
        id: 'guest-002',
        first_name: 'Carlos',
        last_name: 'Ramírez',
        document_number: '12.345.678-9',
        document_type: 'RUT',
        nationality: 'Chilena',
        email: 'cramirez@empresa.cl',
        phone: '+56 9 1234 5678',
      },
      room: { id: '3', number: '201', type: 'PLUS' },
      check_in_date: new Date().toISOString().split('T')[0],
      check_out_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      declared_companions: 0,
      registered_companions: [],
      status: 'CONFIRMED',
      special_requests: '',
      branch: 'SANTIAGO',
      base_rate: 100000,
      nights: 2,
    },
  ],
  [
    'HTL-2026-00103',
    {
      id: 'res-003',
      confirmation_code: 'HTL-2026-00103',
      guest: {
        id: 'guest-003',
        first_name: 'Ana',
        last_name: 'Muñoz',
        document_number: '16.789.012-3',
        document_type: 'RUT',
        nationality: 'Chilena',
        email: 'anamunoz@hotmail.com',
        phone: '+56 9 2345 6789',
      },
      room: { id: '5', number: '301', type: 'SUITE_EJECUTIVA' },
      check_in_date: new Date().toISOString().split('T')[0],
      check_out_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      declared_companions: 2,
      registered_companions: [],
      status: 'CONFIRMED',
      special_requests: 'Celebración de aniversario.',
      branch: 'VINA_DEL_MAR',
      base_rate: 190000,
      nights: 5,
    },
  ],
]);

const RESERVATIONS_BY_ID: Map<string, MockReservation> = new Map();
for (const r of MOCK_RESERVATIONS.values()) {
  RESERVATIONS_BY_ID.set(r.id, r);
}

const FOLIOS: Map<string, MockFolio> = new Map();

// ─── HELPERS MOCK ─────────────────────────────────────────────────────────────

function buildBaseCharge(reservation: MockReservation): MockCharge {
  return {
    id: uuidv4(),
    category: 'BASE_RATE',
    description: `Cargo por habitación ${reservation.room.number} (${reservation.nights} noche(s))`,
    amount: reservation.base_rate,
    quantity: reservation.nights,
    date: new Date().toISOString(),
    added_by: 'SISTEMA',
  };
}

function getOrCreateMockFolio(reservation: MockReservation): MockFolio {
  for (const folio of FOLIOS.values()) {
    if (folio.reservation_id === reservation.id) return folio;
  }
  const newFolio: MockFolio = {
    id: uuidv4(),
    reservation_id: reservation.id,
    guest: {
      id: reservation.guest.id,
      first_name: reservation.guest.first_name,
      last_name: reservation.guest.last_name,
      document_number: reservation.guest.document_number,
    },
    room: reservation.room,
    check_in_date: reservation.check_in_date,
    charges: [buildBaseCharge(reservation)],
    status: 'OPEN',
  };
  FOLIOS.set(newFolio.id, newFolio);
  return newFolio;
}

// ─── HELPERS BASE DE DATOS ────────────────────────────────────────────────────

/**
 * Ejecuta una consulta y devuelve null si la BD no está disponible (sin conexión o
 * sin esquema), de modo que los endpoints puedan recurrir a los datos mock de demo.
 */
async function safeQuery<T>(sql: string, params: unknown[]): Promise<T[] | null> {
  try {
    return (await AppDataSource.manager.query(sql, params)) as T[];
  } catch {
    return null;
  }
}

const RESERVA_SELECT = `
  SELECT r.id::text AS id, r.codigo_confirmacion, r.fecha_entrada::text AS fecha_entrada,
         r.fecha_salida::text AS fecha_salida, r.num_huespedes, r.estado, r.precio_total,
         c.id::text AS cliente_id, c.nombres, c.apellidos, c.documento_num, c.tipo_documento,
         c.nacionalidad, c.email, c.telefono,
         h.id::text AS hab_id, h.numero AS hab_numero, h.tipo AS hab_tipo, s.nombre AS sucursal
  FROM reserva r
  JOIN cliente c   ON c.id = r.cliente_id
  JOIN habitacion h ON h.id = r.habitacion_id
  JOIN sucursal s   ON s.id = r.sucursal_id
`;

interface ReservaRow {
  id: string;
  codigo_confirmacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  num_huespedes: number;
  estado: string;
  precio_total: string;
  cliente_id: string;
  nombres: string;
  apellidos: string;
  documento_num: string;
  tipo_documento: string;
  nacionalidad: string;
  email: string;
  telefono: string;
  hab_id: string;
  hab_numero: string;
  hab_tipo: string;
  sucursal: string;
}

function nightsBetween(inDate: string, outDate: string): number {
  const diff = new Date(outDate).getTime() - new Date(inDate).getTime();
  return Math.max(1, Math.round(diff / 86400000));
}

/** Convierte una fila de la BD al formato que consume el panel-admin. */
async function mapDbReserva(row: ReservaRow): Promise<MockReservation> {
  const nights = nightsBetween(row.fecha_entrada, row.fecha_salida);

  const comps = (await AppDataSource.manager.query(
    `SELECT id::text, nombres, apellidos, documento_num, tipo_documento, creado_en::text
     FROM acompanante WHERE reserva_id = $1 ORDER BY id`,
    [row.id],
  )) as Array<{
    id: string;
    nombres: string;
    apellidos: string;
    documento_num: string;
    tipo_documento: string;
    creado_en: string;
  }>;

  const folio = (await AppDataSource.manager.query(
    'SELECT estado FROM folio WHERE reserva_id = $1 LIMIT 1',
    [row.id],
  )) as Array<{ estado: string }>;

  let status = row.estado === 'COMPLETADA' ? 'CHECKED_OUT' : 'CONFIRMED';
  if (folio[0]) status = folio[0].estado === 'PAGADO' ? 'CHECKED_OUT' : 'CHECKED_IN';

  return {
    id: row.id,
    confirmation_code: row.codigo_confirmacion ?? row.id,
    guest: {
      id: row.cliente_id,
      first_name: row.nombres,
      last_name: row.apellidos,
      document_number: row.documento_num,
      document_type: row.tipo_documento,
      nationality: row.nacionalidad,
      email: row.email,
      phone: row.telefono ?? '',
    },
    room: { id: row.hab_id, number: row.hab_numero, type: row.hab_tipo },
    check_in_date: row.fecha_entrada,
    check_out_date: row.fecha_salida,
    declared_companions: Math.max(0, row.num_huespedes - 1),
    registered_companions: comps.map((c) => ({
      id: c.id,
      first_name: c.nombres,
      last_name: c.apellidos,
      document_number: c.documento_num,
      document_type: (c.tipo_documento === 'PASAPORTE' ? 'PASSPORT' : 'RUT') as 'RUT' | 'PASSPORT',
      registered_at: c.creado_en,
    })),
    status,
    special_requests: '',
    branch: row.sucursal,
    base_rate: Math.round(parseFloat(row.precio_total) / nights),
    nights,
  };
}

const CARGOS_VALIDOS = [
  'HABITACION',
  'CAFETERIA',
  'ROOM_SERVICE',
  'DANO',
  'LATE_CHECKOUT',
  'EVENTO',
  'DESAYUNO',
];

/** Construye el folio (formato panel-admin) a partir de las tablas folio + cargo_folio. */
async function buildDbFolioResponse(row: ReservaRow): Promise<MockFolio> {
  // find-or-create folio
  let folioRows = (await AppDataSource.manager.query(
    'SELECT id::text, estado FROM folio WHERE reserva_id = $1 LIMIT 1',
    [row.id],
  )) as Array<{ id: string; estado: string }>;

  if (!folioRows[0]) {
    folioRows = (await AppDataSource.manager.query(
      `INSERT INTO folio (reserva_id, estado) VALUES ($1, 'ACTIVO') RETURNING id::text, estado`,
      [row.id],
    )) as Array<{ id: string; estado: string }>;
    await AppDataSource.manager.query(
      `INSERT INTO cargo_folio (folio_id, tipo_cargo, descripcion, monto, modulo_origen)
       VALUES ($1, 'HABITACION', $2, $3, 'RESERVA')`,
      [
        folioRows[0].id,
        `Estadía habitación ${row.hab_numero} (${nightsBetween(row.fecha_entrada, row.fecha_salida)} noche(s))`,
        parseFloat(row.precio_total),
      ],
    );
  }

  const folio = folioRows[0];
  const cargos = (await AppDataSource.manager.query(
    `SELECT id::text, tipo_cargo, descripcion, monto, modulo_origen, generado_en::text
     FROM cargo_folio WHERE folio_id = $1 ORDER BY generado_en`,
    [folio.id],
  )) as Array<{
    id: string;
    tipo_cargo: string;
    descripcion: string;
    monto: string;
    modulo_origen: string;
    generado_en: string;
  }>;

  return {
    id: folio.id,
    reservation_id: row.id,
    guest: {
      id: row.cliente_id,
      first_name: row.nombres,
      last_name: row.apellidos,
      document_number: row.documento_num,
    },
    room: { id: row.hab_id, number: row.hab_numero, type: row.hab_tipo },
    check_in_date: row.fecha_entrada,
    charges: cargos.map((c) => ({
      id: c.id,
      category: c.tipo_cargo,
      description: c.descripcion,
      amount: parseFloat(c.monto),
      quantity: 1,
      date: c.generado_en,
      added_by: c.modulo_origen,
    })),
    status: folio.estado === 'ACTIVO' ? 'OPEN' : 'PENDING_REVIEW',
  };
}

// ─── CONTROLADOR ─────────────────────────────────────────────────────────────

export class AdminController {
  // GET /api/admin/reservations/by-code/:code
  async getReservationByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = req.params['code']?.toUpperCase();

      const rows =
        (await safeQuery<ReservaRow>(
          `${RESERVA_SELECT} WHERE UPPER(r.codigo_confirmacion) = $1 LIMIT 1`,
          [code],
        )) ?? [];

      if (rows[0]) {
        res.json(await mapDbReserva(rows[0]));
        return;
      }

      const mock = MOCK_RESERVATIONS.get(code);
      if (!mock) {
        return next(new AppError(`No se encontró la reserva con código ${code}.`, 404));
      }
      res.json(mock);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/admin/reservations/by-guest/:document
  async getReservationsByGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = req.params['document']?.replace(/\./g, '').replace(/-/g, '').toUpperCase();

      const rows =
        (await safeQuery<ReservaRow>(
          `${RESERVA_SELECT}
           WHERE UPPER(regexp_replace(c.documento_num, '[.\\-]', '', 'g')) LIKE '%' || $1 || '%'
           ORDER BY r.creado_en DESC`,
          [doc],
        )) ?? [];

      const results = await Promise.all(rows.map((r) => mapDbReserva(r)));

      // Respaldo: reservas mock que coincidan con el documento
      for (const r of MOCK_RESERVATIONS.values()) {
        const rDoc = r.guest.document_number.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        if (rDoc.includes(doc) || doc.includes(rDoc)) results.push(r);
      }

      if (results.length === 0) {
        return next(new AppError(`No se encontraron reservas para el documento ${doc}.`, 404));
      }
      res.json(results);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/admin/reservations/:id/check-in
  async executeCheckIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      const { companions } = req.body as { companions: MockCompanion[] };

      const rows =
        (await safeQuery<ReservaRow>(`${RESERVA_SELECT} WHERE r.id::text = $1 LIMIT 1`, [id])) ??
        [];

      if (rows[0]) {
        const row = rows[0];
        for (const c of companions ?? []) {
          await AppDataSource.manager.query(
            `INSERT INTO acompanante (reserva_id, nombres, apellidos, tipo_documento, documento_num)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              row.id,
              c.first_name,
              c.last_name,
              c.document_type === 'PASSPORT' ? 'PASAPORTE' : 'RUT',
              c.document_number,
            ],
          );
        }
        await buildDbFolioResponse(row); // crea el folio si no existe
        res.json(await mapDbReserva(row));
        return;
      }

      // Respaldo mock
      const reservation = RESERVATIONS_BY_ID.get(id);
      if (!reservation) {
        return next(new AppError(`Reserva ${id} no encontrada.`, 404));
      }
      reservation.registered_companions = (companions ?? []).map((c) => ({
        ...c,
        id: uuidv4(),
        registered_at: new Date().toISOString(),
      }));
      reservation.status = 'CHECKED_IN';
      getOrCreateMockFolio(reservation);
      res.json(reservation);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/admin/folios/reservation/:reservationId
  async getFolioByReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reservationId = req.params['reservationId'];

      const rows =
        (await safeQuery<ReservaRow>(`${RESERVA_SELECT} WHERE r.id::text = $1 LIMIT 1`, [
          reservationId,
        ])) ?? [];

      if (rows[0]) {
        res.json(await buildDbFolioResponse(rows[0]));
        return;
      }

      const reservation = RESERVATIONS_BY_ID.get(reservationId);
      if (!reservation) {
        return next(new AppError(`Reserva ${reservationId} no encontrada.`, 404));
      }
      res.json(getOrCreateMockFolio(reservation));
    } catch (err) {
      next(err);
    }
  }

  // POST /api/admin/folios/charges
  async addCharge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { folio_id, category, description, amount, quantity } = req.body as {
        folio_id: string;
        category: string;
        description: string;
        amount: number;
        quantity: number;
      };

      const dbFolio =
        (await safeQuery<{ id: string; estado: string }>(
          'SELECT id::text, estado FROM folio WHERE id::text = $1 LIMIT 1',
          [folio_id],
        )) ?? [];

      if (dbFolio[0]) {
        if (dbFolio[0].estado !== 'ACTIVO') {
          return next(new AppError('El folio ya está cerrado.', 400));
        }
        const tipo = CARGOS_VALIDOS.includes(category) ? category : 'ROOM_SERVICE';
        const cantidad = quantity && quantity > 0 ? quantity : 1;
        const nuevo = (await AppDataSource.manager.query(
          `INSERT INTO cargo_folio (folio_id, tipo_cargo, descripcion, monto, modulo_origen)
           VALUES ($1, $2, $3, $4, 'RECEPCION') RETURNING id::text`,
          [folio_id, tipo, description ?? tipo, (amount ?? 0) * cantidad],
        )) as Array<{ id: string }>;
        res.status(201).json({ charge: { id: nuevo[0].id } });
        return;
      }

      // Respaldo mock
      const folio = FOLIOS.get(folio_id);
      if (!folio) {
        return next(new AppError(`Folio ${folio_id} no encontrado.`, 404));
      }
      if (folio.status !== 'OPEN') {
        return next(new AppError('El folio ya está cerrado.', 400));
      }
      const nuevo: MockCharge = {
        id: uuidv4(),
        category,
        description,
        amount,
        quantity,
        date: new Date().toISOString(),
        added_by: 'RECEPCIONISTA',
      };
      folio.charges.push(nuevo);
      res.status(201).json({ charge: { id: nuevo.id } });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/admin/folios/:id/close
  async closeFolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];

      const dbFolio =
        (await safeQuery<{ id: string; reserva_id: string }>(
          'SELECT id::text, reserva_id::text FROM folio WHERE id::text = $1 LIMIT 1',
          [id],
        )) ?? [];

      if (dbFolio[0]) {
        await AppDataSource.manager.query(
          `UPDATE folio SET estado = 'PAGADO', cerrado_en = NOW() WHERE id::text = $1`,
          [id],
        );
        await AppDataSource.manager.query(
          `UPDATE reserva SET estado = 'COMPLETADA' WHERE id::text = $1`,
          [dbFolio[0].reserva_id],
        );
        res.status(200).json({ message: 'Folio cerrado exitosamente.' });
        return;
      }

      const folio = FOLIOS.get(id);
      if (!folio) {
        return next(new AppError(`Folio ${id} no encontrado.`, 404));
      }
      folio.status = 'PENDING_REVIEW';
      folio.check_out_date = new Date().toISOString();
      res.status(200).json({ message: 'Folio cerrado exitosamente.' });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/admin/rooms/:id/rate
  async updateRoomRate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      const { base_rate } = req.body as { base_rate: number };

      if (!base_rate || base_rate <= 0) {
        return next(new AppError('La tarifa debe ser mayor a 0.', 400));
      }

      const rows = (await AppDataSource.manager.query(
        `
        SELECT h.id::text, h.numero AS number, h.piso AS floor, h.tipo AS type,
               h.capacidad_maxima AS capacity, h.estado AS status, s.nombre AS branch
        FROM habitacion h
        JOIN sucursal s ON s.id = h.sucursal_id
        WHERE h.id = $1
        LIMIT 1
      `,
        [id],
      )) as Array<{
        id: string;
        number: string;
        floor: string;
        type: string;
        capacity: string;
        status: string;
        branch: string;
      }>;

      if (rows.length === 0) {
        return next(new AppError(`Habitación ${id} no encontrada.`, 404));
      }

      const row = rows[0];
      res.json({
        id: row.id,
        number: row.number,
        floor: parseInt(row.floor, 10),
        type: row.type,
        capacity: parseInt(row.capacity, 10),
        base_rate,
        status: mapEstadoToStatus(row.status),
        amenities: AMENITIES_POR_TIPO[row.type] ?? [],
        branch: row.branch,
      });
    } catch (error) {
      next(error);
    }
  }
}
