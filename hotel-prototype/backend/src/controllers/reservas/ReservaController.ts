import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../config/database';
import { AppError } from '../../utils/errors/AppError';

interface CrearReservaBody {
  habitacionId: number;
  sucursalId: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: string[];
}

const TIPO_HABITACION_LABEL: Record<string, string> = {
  ESTANDAR: 'Estandar',
  PLUS: 'Plus',
  SUITE_EJECUTIVA: 'SuiteEjecutiva',
};

/** Genera un código de confirmación legible tipo HTL-2026-04821. */
function generarCodigo(): string {
  const year = new Date().getFullYear();
  const aleatorio = Math.floor(Math.random() * 90000) + 10000;
  return `HTL-${year}-${aleatorio}`;
}

/** Divide el nombre completo en nombres + apellidos (la tabla exige ambos). */
function partirNombre(nombreCompleto: string): { nombres: string; apellidos: string } {
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length === 1) return { nombres: partes[0], apellidos: '.' };
  return { nombres: partes[0], apellidos: partes.slice(1).join(' ') };
}

export class ReservaController {
  /**
   * POST /api/reservas
   * Crea una reserva REAL en PostgreSQL: registra (o reutiliza) al cliente e inserta
   * la reserva. El trigger fn_verificar_disponibilidad de la BD valida el overbooking
   * de forma atómica (regla de negocio en la capa correcta).
   */
  async crearReserva(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: CrearReservaBody = req.body;

      if (!body.habitacionId || !body.fechaCheckIn || !body.fechaCheckOut || !body.huespedEmail) {
        return next(new AppError('Faltan campos obligatorios para crear la reserva.', 400));
      }
      if (!body.huespedEmail.includes('@')) {
        return next(new AppError('El email proporcionado no es válido.', 400));
      }

      const checkIn = new Date(body.fechaCheckIn);
      const checkOut = new Date(body.fechaCheckOut);
      if (checkOut <= checkIn) {
        return next(new AppError('La fecha de check-out debe ser posterior al check-in.', 400));
      }

      const noches = Math.max(
        1,
        Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
      );

      const resultado = await AppDataSource.transaction(async (manager) => {
        // 1. Habitación + su sucursal y tipo
        const habRows = (await manager.query(
          'SELECT id, sucursal_id, tipo, capacidad_maxima FROM habitacion WHERE id = $1 LIMIT 1',
          [body.habitacionId],
        )) as { id: number; sucursal_id: number; tipo: string; capacidad_maxima: number }[];

        const habitacion = habRows[0];
        if (!habitacion) {
          throw new AppError(`La habitación ${body.habitacionId} no existe.`, 404);
        }
        if (body.cantidadHuespedes > habitacion.capacidad_maxima) {
          throw new AppError(
            `La habitación admite hasta ${habitacion.capacidad_maxima} huésped(es).`,
            400,
          );
        }

        // 2. Tarifa vigente para esa sucursal + tipo
        const tarifaRows = (await manager.query(
          `SELECT id, precio_noche_base FROM regla_tarifa
           WHERE sucursal_id = $1 AND tipo_habitacion = $2 AND activo = true
           ORDER BY vigencia_desde DESC LIMIT 1`,
          [habitacion.sucursal_id, habitacion.tipo],
        )) as { id: number; precio_noche_base: string }[];

        const tarifa = tarifaRows[0];
        if (!tarifa) {
          throw new AppError('No hay una tarifa vigente para esta habitación.', 400);
        }

        const precioNoche = parseFloat(tarifa.precio_noche_base);
        const subtotal = precioNoche * noches;

        // 3. Cliente: reutilizar si el email ya existe, si no, crearlo
        const existente = (await manager.query('SELECT id FROM cliente WHERE email = $1 LIMIT 1', [
          body.huespedEmail.toLowerCase(),
        ])) as { id: string }[];

        let clienteId: string;
        if (existente[0]) {
          clienteId = existente[0].id;
        } else {
          const { nombres, apellidos } = partirNombre(body.huespedNombre || 'Huésped Web');
          // Documento ficticio único: el portal web no solicita RUT en este prototipo.
          const documento = `WEB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const nuevoCliente = (await manager.query(
            `INSERT INTO cliente (nombres, apellidos, email, telefono, tipo_documento, documento_num, fecha_nacimiento, nacionalidad)
             VALUES ($1, $2, $3, $4, 'RUT', $5, '1990-01-01', 'Chilena')
             RETURNING id`,
            [
              nombres,
              apellidos,
              body.huespedEmail.toLowerCase(),
              body.huespedTelefono ?? null,
              documento,
            ],
          )) as { id: string }[];
          clienteId = nuevoCliente[0].id;
        }

        // 4. Insertar la reserva (el trigger valida overbooking → RN-14)
        const codigo = generarCodigo();
        const reservaRows = (await manager.query(
          `INSERT INTO reserva
             (cliente_id, habitacion_id, sucursal_id, regla_tarifa_id, fecha_entrada, fecha_salida,
              num_huespedes, estado, acepta_terminos_legales, terminos_aceptados_en,
              subtotal_habitacion, precio_total, token_garantia, codigo_confirmacion)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'CONFIRMADA', true, NOW(), $8, $9, $10, $11)
           RETURNING id, creado_en`,
          [
            clienteId,
            habitacion.id,
            habitacion.sucursal_id,
            tarifa.id,
            body.fechaCheckIn,
            body.fechaCheckOut,
            body.cantidadHuespedes,
            subtotal,
            subtotal,
            `TOK-${Math.random().toString(36).slice(2, 12)}`,
            codigo,
          ],
        )) as { id: string; creado_en: string }[];

        return {
          id: reservaRows[0].id,
          codigo,
          tipo: habitacion.tipo,
          subtotal,
          creado_en: reservaRows[0].creado_en,
        };
      });

      res.status(201).json({
        id: resultado.codigo,
        reservaId: resultado.id,
        confirmation_code: resultado.codigo,
        habitacionId: body.habitacionId,
        tipoHabitacion: TIPO_HABITACION_LABEL[resultado.tipo] ?? 'Estandar',
        sucursalId: body.sucursalId,
        fechaCheckIn: body.fechaCheckIn,
        fechaCheckOut: body.fechaCheckOut,
        cantidadHuespedes: body.cantidadHuespedes,
        huespedNombre: body.huespedNombre,
        huespedEmail: body.huespedEmail,
        huespedTelefono: body.huespedTelefono,
        servicios: body.servicios ?? [],
        totalEstimado: resultado.subtotal,
        fechaCreacion: resultado.creado_en,
      });
    } catch (error) {
      if (error instanceof AppError) return next(error);
      // Errores de reglas de negocio lanzados por los triggers de PostgreSQL
      const msg = (error as { message?: string })?.message ?? '';
      if (msg.includes('RN-14')) {
        return next(
          new AppError('La habitación ya está reservada para esas fechas (overbooking).', 409),
        );
      }
      if (msg.includes('RN-02') || msg.includes('RN-03') || msg.includes('RN-04')) {
        return next(new AppError('La cantidad de huéspedes supera la capacidad.', 400));
      }
      return next(error);
    }
  }
}
