import jwt from 'jsonwebtoken';
import { AuthService } from './AuthService';
import { AppError } from '../../utils/errors/AppError';

describe('AuthService', () => {
  let service: AuthService;
  const JWT_SECRET = process.env.JWT_SECRET ?? 'secreto_super_seguro_desarrollo';

  beforeEach(() => {
    service = new AuthService();
  });

  describe('login', () => {
    it('devuelve access_token, refresh_token y datos del usuario con credenciales válidas', () => {
      const result = service.login('admin@hotel.cl', 'admin123');

      expect(result.access_token).toEqual(expect.any(String));
      expect(result.refresh_token).toEqual(expect.any(String));
      expect(result.token_type).toBe('Bearer');
      expect(result.expires_in).toBe(3600);
      expect(result.user).toMatchObject({
        email: 'admin@hotel.cl',
        role: 'SUPER_ADMIN',
        branch: 'TEMUCO',
      });
    });

    it('firma un JWT verificable que contiene id, email y role', () => {
      const { access_token } = service.login('recepcion@hotel.cl', 'recep123');
      const decoded = jwt.verify(access_token, JWT_SECRET) as Record<string, unknown>;

      expect(decoded.email).toBe('recepcion@hotel.cl');
      expect(decoded.role).toBe('RECEPTIONIST');
      expect(decoded.id).toBe('2');
    });

    it('normaliza el email a minúsculas antes de buscar el usuario', () => {
      const result = service.login('ADMIN@HOTEL.CL', 'admin123');
      expect(result.user.role).toBe('SUPER_ADMIN');
    });

    it('lanza AppError 401 si el usuario no existe', () => {
      expect(() => service.login('nadie@hotel.cl', 'x')).toThrow(AppError);
      try {
        service.login('nadie@hotel.cl', 'x');
      } catch (err) {
        expect((err as AppError).statusCode).toBe(401);
      }
    });

    it('lanza AppError 401 si la contraseña es incorrecta', () => {
      expect(() => service.login('admin@hotel.cl', 'mala')).toThrow(AppError);
    });
  });

  describe('refreshAccessToken (rotación)', () => {
    it('emite un nuevo access_token y un nuevo refresh_token rotado', () => {
      const { refresh_token } = service.login('admin@hotel.cl', 'admin123');
      const refreshed = service.refreshAccessToken(refresh_token);

      expect(refreshed.access_token).toEqual(expect.any(String));
      expect(refreshed.refresh_token).toEqual(expect.any(String));
      expect(refreshed.refresh_token).not.toBe(refresh_token);
      expect(refreshed.token_type).toBe('Bearer');
    });

    it('invalida el refresh token anterior tras la rotación (un solo uso)', () => {
      const { refresh_token } = service.login('admin@hotel.cl', 'admin123');
      service.refreshAccessToken(refresh_token);

      expect(() => service.refreshAccessToken(refresh_token)).toThrow(AppError);
    });

    it('permite encadenar rotaciones con el token más reciente', () => {
      const { refresh_token } = service.login('admin@hotel.cl', 'admin123');
      const first = service.refreshAccessToken(refresh_token);
      const second = service.refreshAccessToken(first.refresh_token);

      expect(second.access_token).toEqual(expect.any(String));
    });

    it('lanza AppError 401 si el refresh token es desconocido', () => {
      expect(() => service.refreshAccessToken('token-inexistente')).toThrow(AppError);
    });

    it('lanza AppError 401 y revoca el token cuando ha expirado', () => {
      jest.useFakeTimers();
      try {
        const { refresh_token } = service.login('admin@hotel.cl', 'admin123');
        // Avanzamos el reloj 8 días (el TTL del refresh token es de 7 días)
        jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
        expect(() => service.refreshAccessToken(refresh_token)).toThrow(AppError);
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('logout', () => {
    it('revoca el refresh token de forma que ya no puede usarse', () => {
      const { refresh_token } = service.login('admin@hotel.cl', 'admin123');
      service.logout(refresh_token);

      expect(() => service.refreshAccessToken(refresh_token)).toThrow(AppError);
    });

    it('es idempotente: revocar un token inexistente no lanza error', () => {
      expect(() => service.logout('no-existe')).not.toThrow();
    });
  });
});
