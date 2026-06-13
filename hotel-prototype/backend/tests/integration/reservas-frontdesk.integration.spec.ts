import request from 'supertest';
import { app } from '../../src/app';

describe('Reservas API — creación (anti-overbooking en capa de negocio)', () => {
  const validBody = {
    habitacionId: 1,
    sucursalId: 'temuco',
    fechaCheckIn: '2026-07-01',
    fechaCheckOut: '2026-07-03',
    cantidadHuespedes: 2,
    huespedNombre: 'Pedro Soto',
    huespedEmail: 'pedro@correo.cl',
    huespedTelefono: '+56 9 1111 2222',
    servicios: [],
  };

  // La creación exitosa inserta en PostgreSQL (cliente + reserva) y se valida con la BD
  // levantada. En este suite, sin conexión, cubrimos las validaciones previas a tocar la
  // BD (que es donde vive la lógica de entrada del controlador).

  it('400 si faltan campos obligatorios', async () => {
    const res = await request(app).post('/api/reservas').send({ habitacionId: 1 });
    expect(res.status).toBe(400);
  });

  it('400 si el email no es válido', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({ ...validBody, huespedEmail: 'correo-sin-arroba' });
    expect(res.status).toBe(400);
  });

  it('400 si el check-out no es posterior al check-in', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({ ...validBody, fechaCheckIn: '2026-07-03', fechaCheckOut: '2026-07-01' });
    expect(res.status).toBe(400);
  });
});

describe('Disponibilidad API (HabitacionController)', () => {
  it('400 cuando la consulta no trae la sucursal (validación en la capa de servicio)', async () => {
    const res = await request(app).post('/api/habitaciones/disponibilidad').send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  it('propaga el error (500) al consultar el catálogo sin base de datos disponible', async () => {
    const res = await request(app).get('/api/admin/rooms');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe('error');
  });
});

describe('Frontdesk API — búsqueda de reservas, check-in y folios (check-out)', () => {
  describe('Búsqueda de reservas', () => {
    it('encuentra una reserva por código de confirmación', async () => {
      const res = await request(app).get('/api/admin/reservations/by-code/htl-2026-00101');
      expect(res.status).toBe(200);
      expect(res.body.confirmation_code).toBe('HTL-2026-00101');
    });

    it('404 si el código no existe', async () => {
      const res = await request(app).get('/api/admin/reservations/by-code/NO-EXISTE');
      expect(res.status).toBe(404);
    });

    it('encuentra reservas por documento del huésped (normaliza puntos y guiones)', async () => {
      const res = await request(app).get('/api/admin/reservations/by-guest/152345678');
      expect(res.status).toBe(200);
      expect(res.body[0].guest.document_number).toBe('15.234.567-8');
    });

    it('404 si el documento no tiene reservas', async () => {
      const res = await request(app).get('/api/admin/reservations/by-guest/99999999');
      expect(res.status).toBe(404);
    });
  });

  describe('Check-in', () => {
    it('registra acompañantes, cambia el estado a CHECKED_IN y abre el folio', async () => {
      const res = await request(app)
        .post('/api/admin/reservations/res-001/check-in')
        .send({
          companions: [
            {
              first_name: 'Luis',
              last_name: 'Pérez',
              document_number: '11.111.111-1',
              document_type: 'RUT',
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('CHECKED_IN');
      expect(res.body.registered_companions).toHaveLength(1);
      expect(res.body.registered_companions[0].id).toEqual(expect.any(String));
    });

    it('404 si la reserva no existe', async () => {
      const res = await request(app).post('/api/admin/reservations/inexistente/check-in').send({});
      expect(res.status).toBe(404);
    });
  });

  describe('Folio y check-out', () => {
    it('abre el folio con el cargo base, permite agregar cargos y cerrarlo', async () => {
      // 1. Obtener / crear el folio de la reserva
      const folioRes = await request(app).get('/api/admin/folios/reservation/res-002');
      expect(folioRes.status).toBe(200);
      expect(folioRes.body.status).toBe('OPEN');
      expect(folioRes.body.charges[0].category).toBe('BASE_RATE');
      const folioId = folioRes.body.id;

      // 2. Agregar un consumo al folio abierto
      const charge = await request(app).post('/api/admin/folios/charges').send({
        folio_id: folioId,
        category: 'MINIBAR',
        description: 'Agua',
        amount: 2000,
        quantity: 1,
      });
      expect(charge.status).toBe(201);
      expect(charge.body.charge.id).toEqual(expect.any(String));

      // 3. Cerrar el folio (check-out)
      const close = await request(app).patch(`/api/admin/folios/${folioId}/close`).send();
      expect(close.status).toBe(200);

      // 4. No se pueden agregar cargos a un folio ya cerrado
      const afterClose = await request(app).post('/api/admin/folios/charges').send({
        folio_id: folioId,
        category: 'MINIBAR',
        description: 'Tarde',
        amount: 1000,
        quantity: 1,
      });
      expect(afterClose.status).toBe(400);
    });

    it('404 al agregar un cargo a un folio inexistente', async () => {
      const res = await request(app).post('/api/admin/folios/charges').send({
        folio_id: 'folio-fantasma',
        category: 'X',
        description: 'X',
        amount: 1,
        quantity: 1,
      });
      expect(res.status).toBe(404);
    });

    it('404 al cerrar un folio inexistente', async () => {
      const res = await request(app).patch('/api/admin/folios/folio-fantasma/close').send();
      expect(res.status).toBe(404);
    });
  });

  describe('Actualización de tarifa', () => {
    it('400 si la tarifa es menor o igual a 0', async () => {
      const res = await request(app).patch('/api/admin/rooms/1/rate').send({ base_rate: 0 });
      expect(res.status).toBe(400);
    });
  });
});
