import { Response } from 'express';
import {
  crearAuthMiddleware,
  autorizarRoles,
  AuthRequest,
} from '../../src/infrastructure/http/middleware/authMiddleware';
import { JwtTokenService } from '../../src/infrastructure/security/JwtTokenService';
import { AppError } from '../../src/domain/errors/AppError';
import { UserRole } from '../../src/domain/dtos/Auth.dto';

const tokenService = new JwtTokenService({
  accessSecret: 'a',
  refreshSecret: 'r',
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
  accessExpiresInSeconds: 900,
});

describe('crearAuthMiddleware', () => {
  const middleware = crearAuthMiddleware(tokenService);

  it('rechaza si no hay header Authorization', () => {
    const next = jest.fn();
    middleware({ headers: {} } as AuthRequest, {} as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it('rechaza un token inválido', () => {
    const next = jest.fn();
    middleware(
      { headers: { authorization: 'Bearer token.malo' } } as AuthRequest,
      {} as Response,
      next
    );
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it('inyecta req.user y continúa con un token válido', () => {
    const token = tokenService.generarAccessToken({
      sub: '1',
      email: 'admin@hotel.cl',
      role: UserRole.SuperAdmin,
      branch: 'TEMUCO',
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const next = jest.fn();

    middleware(req, {} as Response, next);

    expect(req.user?.email).toBe('admin@hotel.cl');
    expect(next).toHaveBeenCalledWith();
  });
});

describe('autorizarRoles', () => {
  it('permite el acceso a un rol autorizado', () => {
    const req = { user: { role: UserRole.SuperAdmin } } as AuthRequest;
    const next = jest.fn();
    autorizarRoles(UserRole.SuperAdmin, UserRole.Admin)(req, {} as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('bloquea con 403 a un rol no autorizado', () => {
    const req = { user: { role: UserRole.Recepcionista } } as AuthRequest;
    const next = jest.fn();
    autorizarRoles(UserRole.SuperAdmin)(req, {} as Response, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  it('bloquea con 401 si no hay usuario autenticado', () => {
    const req = {} as AuthRequest;
    const next = jest.fn();
    autorizarRoles(UserRole.Admin)(req, {} as Response, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});
