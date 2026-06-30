/**
 * Pruebas End-to-End de la API (caja negra) usando supertest contra la app
 * Express real. Se mockea SOLO el adaptador de persistencia con query-builder
 * (TypeOrmHabitacionRepository) para no requerir una conexión PostgreSQL activa;
 * el resto del flujo (routing, middlewares, controladores, casos de uso, JWT)
 * se ejercita de forma real.
 */
jest.mock('../../src/infrastructure/persistence/TypeOrmHabitacionRepository', () => ({
  TypeOrmHabitacionRepository: jest.fn().mockImplementation(() => ({
    buscarDisponibles: jest.fn().mockResolvedValue([
      {
        id: 1,
        numero: '101',
        tipo: 'PLUS',
        capacidadMaxima: 2,
        piso: 1,
        estado: 'DISPONIBLE',
        sucursalNombre: 'TEMUCO',
        precioBase: 80000,
      },
    ]),
    buscarTodas: jest.fn().mockResolvedValue([
      {
        id: 1,
        numero: '201',
        tipo: 'ESTANDAR',
        capacidadMaxima: 2,
        piso: 2,
        estado: 'DISPONIBLE',
        sucursalNombre: 'TEMUCO',
        precioBase: 50000,
      },
    ]),
    buscarPorId: jest.fn().mockResolvedValue({
      id: 1,
      numero: '101',
      tipo: 'PLUS',
      capacidadMaxima: 4,
      piso: 1,
      estado: 'DISPONIBLE',
      sucursalNombre: 'TEMUCO',
      precioBase: 80000,
    }),
  })),
}));

import request from 'supertest';
import { app } from '../../src/infrastructure/http/app';

describe('API E2E', () => {
  describe('Health & errores', () => {
    it('GET /api/health -> 200 ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });

    it('GET /api/ruta-inexistente -> 404 controlado', async () => {
      const res = await request(app).get('/api/no-existe');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('Autenticación JWT + Refresh', () => {
    it('POST /api/auth/login con credenciales válidas -> 200 + tokens', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'Admin123!' });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeTruthy();
      expect(res.body.refresh_token).toBeTruthy();
      expect(res.body.user.role).toBe('SUPER_ADMIN');
    });

    it('POST /api/auth/login con credenciales inválidas -> 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'incorrecta' });
      expect(res.status).toBe(401);
    });

    it('POST /api/auth/refresh rota el token y emite uno nuevo', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'Admin123!' });

      const refreshed = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: login.body.refresh_token });

      expect(refreshed.status).toBe(200);
      expect(refreshed.body.access_token).toBeTruthy();

      // El refresh token original queda revocado (rotación).
      const reuse = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: login.body.refresh_token });
      expect(reuse.status).toBe(401);
    });

    it('POST /api/auth/logout -> 204 y revoca la sesión', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'Admin123!' });

      const logout = await request(app)
        .post('/api/auth/logout')
        .send({ refresh_token: login.body.refresh_token });
      expect(logout.status).toBe(204);

      const reuse = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: login.body.refresh_token });
      expect(reuse.status).toBe(401);
    });
  });

  describe('Disponibilidad y autorización RBAC', () => {
    it('POST /api/habitaciones/disponibilidad (público) -> 200', async () => {
      const res = await request(app).post('/api/habitaciones/disponibilidad').send({
        fechaCheckIn: '2026-07-01',
        fechaCheckOut: '2026-07-05',
        cantidadHuespedes: 2,
        sucursalNombre: 'Temuco',
      });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('GET /api/admin/rooms sin token -> 401', async () => {
      const res = await request(app).get('/api/admin/rooms');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/rooms con token de SUPER_ADMIN -> 200', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'Admin123!' });

      const res = await request(app)
        .get('/api/admin/rooms')
        .set('Authorization', `Bearer ${login.body.access_token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/admin/rooms con rol RECEPCIONISTA -> 403', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'recepcion@hotel.cl', password: 'Recepcion123!' });

      const res = await request(app)
        .get('/api/admin/rooms')
        .set('Authorization', `Bearer ${login.body.access_token}`);

      expect(res.status).toBe(403);
    });

    it('POST /api/reservas (público) -> 201 con total estimado', async () => {
      const res = await request(app)
        .post('/api/reservas')
        .send({
          habitacionId: 1,
          sucursalId: 'Temuco',
          fechaCheckIn: '2026-07-01',
          fechaCheckOut: '2026-07-03',
          cantidadHuespedes: 2,
          huespedNombre: 'Juan Pérez',
          huespedEmail: 'juan@example.cl',
          huespedTelefono: '+56912345678',
          servicios: ['DesayunoCafeteria'],
        });

      expect(res.status).toBe(201);
      // 2 noches × 80000 (mock) + 5000 = 165000
      expect(res.body.totalEstimado).toBe(165000);
      expect(res.body.id).toBeDefined();
    });
  });

  describe('Check-in y Check-out (admin)', () => {
    const tokenAdmin = async (): Promise<string> => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'Admin123!' });
      return login.body.access_token;
    };

    it('GET /api/admin/reservations/by-code/:code sin token -> 401', async () => {
      const res = await request(app).get('/api/admin/reservations/by-code/ABC123');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/reservations/by-code/ABC123 con token -> 200', async () => {
      const res = await request(app)
        .get('/api/admin/reservations/by-code/ABC123')
        .set('Authorization', `Bearer ${await tokenAdmin()}`);
      expect(res.status).toBe(200);
      expect(res.body.confirmation_code).toBe('ABC123');
      expect(res.body.guest.last_name).toBe('Pérez');
    });

    it('POST /api/admin/reservations/res-002/check-in -> 200 CHECKED_IN', async () => {
      const res = await request(app)
        .post('/api/admin/reservations/res-002/check-in')
        .set('Authorization', `Bearer ${await tokenAdmin()}`)
        .send({ companions: [], actual_check_in_time: '2026-07-02T15:00:00.000Z', staff_id: '1' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('CHECKED_IN');
    });

    it('GET /api/admin/folios/reservation/res-001 -> 200 con cargos', async () => {
      const res = await request(app)
        .get('/api/admin/folios/reservation/res-001')
        .set('Authorization', `Bearer ${await tokenAdmin()}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('fol-001');
      expect(Array.isArray(res.body.charges)).toBe(true);
    });

    it('POST /api/admin/folios/charges -> 201 con id del cargo', async () => {
      const res = await request(app)
        .post('/api/admin/folios/charges')
        .set('Authorization', `Bearer ${await tokenAdmin()}`)
        .send({
          folio_id: 'fol-001',
          category: 'MINIBAR',
          description: 'Snack',
          amount: 3000,
          quantity: 1,
        });
      expect(res.status).toBe(201);
      expect(res.body.charge.id).toBeDefined();
    });

    it('PATCH /api/admin/folios/fol-002/close -> 204', async () => {
      const res = await request(app)
        .patch('/api/admin/folios/fol-002/close')
        .set('Authorization', `Bearer ${await tokenAdmin()}`);
      expect(res.status).toBe(204);
    });
  });
});
