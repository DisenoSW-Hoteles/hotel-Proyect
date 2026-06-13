import request from 'supertest';
import { app } from '../../src/app';

describe('Auth API (integración)', () => {
  describe('POST /api/auth/login', () => {
    it('200 y tokens cuando las credenciales son válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toEqual(expect.any(String));
      expect(res.body.refresh_token).toEqual(expect.any(String));
      expect(res.body.user.role).toBe('SUPER_ADMIN');
    });

    it('401 cuando las credenciales son inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'incorrecta' });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('rota el refresh token y devuelve un nuevo access_token', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'admin123' });

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: login.body.refresh_token });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toEqual(expect.any(String));
      expect(res.body.refresh_token).not.toBe(login.body.refresh_token);
    });

    it('400 cuando falta el refresh_token', async () => {
      const res = await request(app).post('/api/auth/refresh').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('204 e invalida el refresh token', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@hotel.cl', password: 'admin123' });

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

  describe('Rutas inexistentes', () => {
    it('404 con cuerpo de error controlado', async () => {
      const res = await request(app).get('/api/no-existe');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
});
