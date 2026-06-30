import { AuthService } from '../../src/application/auth/AuthService';
import { JwtTokenService } from '../../src/infrastructure/security/JwtTokenService';
import { InMemoryRefreshTokenStore } from '../../src/infrastructure/security/InMemoryRefreshTokenStore';
import { InMemoryUserRepository } from '../../src/infrastructure/security/InMemoryUserRepository';
import { AppError } from '../../src/domain/errors/AppError';

const buildService = () => {
  const tokenService = new JwtTokenService({
    accessSecret: 'a-secret',
    refreshSecret: 'r-secret',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
    accessExpiresInSeconds: 900,
  });
  const store = new InMemoryRefreshTokenStore();
  const repo = new InMemoryUserRepository(4); // pocas rondas => tests rápidos
  return { service: new AuthService(repo, tokenService, store), tokenService, store };
};

describe('AuthService', () => {
  describe('login', () => {
    it('autentica credenciales válidas y emite access + refresh tokens', async () => {
      const { service } = buildService();
      const res = await service.login('admin@hotel.cl', 'Admin123!');

      expect(res.access_token).toBeTruthy();
      expect(res.refresh_token).toBeTruthy();
      expect(res.token_type).toBe('Bearer');
      expect(res.expires_in).toBe(900);
      expect(res.user.role).toBe('SUPER_ADMIN');
      // La respuesta pública nunca expone el hash.
      expect(res.user).not.toHaveProperty('passwordHash');
    });

    it('rechaza una contraseña incorrecta con 401', async () => {
      const { service } = buildService();
      await expect(service.login('admin@hotel.cl', 'mala')).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('rechaza un usuario inexistente con 401', async () => {
      const { service } = buildService();
      await expect(service.login('ghost@hotel.cl', 'x')).rejects.toBeInstanceOf(AppError);
    });

    it('exige email y password (400)', async () => {
      const { service } = buildService();
      await expect(service.login('', '')).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('refresh con rotación', () => {
    it('emite un nuevo par de tokens e invalida el refresh anterior', async () => {
      const { service } = buildService();
      const login = await service.login('admin@hotel.cl', 'Admin123!');

      const renovado = await service.refresh(login.refresh_token);
      expect(renovado.access_token).toBeTruthy();
      expect(renovado.refresh_token).not.toBe(login.refresh_token);

      // El refresh token original ya no debe servir (rotación).
      await expect(service.refresh(login.refresh_token)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('rechaza un refresh token inválido', async () => {
      const { service } = buildService();
      await expect(service.refresh('token.basura')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('exige refresh token (400)', async () => {
      const { service } = buildService();
      await expect(service.refresh('')).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('logout', () => {
    it('revoca el refresh token impidiendo renovaciones posteriores', async () => {
      const { service } = buildService();
      const login = await service.login('admin@hotel.cl', 'Admin123!');

      await service.logout(login.refresh_token);

      await expect(service.refresh(login.refresh_token)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('es idempotente ante un token vacío o inválido', async () => {
      const { service } = buildService();
      await expect(service.logout('')).resolves.toBeUndefined();
      await expect(service.logout('basura')).resolves.toBeUndefined();
    });
  });
});
