import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { verificarToken, AuthRequest } from './authMiddleware';
import { AppError } from '../../utils/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secreto_super_seguro_desarrollo';

const buildRes = (): Response => ({}) as Response;

describe('verificarToken (middleware)', () => {
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    next = jest.fn();
  });

  it('rechaza la petición si no hay header Authorization', () => {
    const req = { headers: {} } as AuthRequest;
    verificarToken(req, buildRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect((next.mock.calls[0][0] as unknown as AppError).statusCode).toBe(401);
  });

  it('rechaza la petición si el header no usa el esquema Bearer', () => {
    const req = { headers: { authorization: 'Basic abc' } } as AuthRequest;
    verificarToken(req, buildRes(), next);

    expect((next.mock.calls[0][0] as unknown as AppError).statusCode).toBe(401);
  });

  it('rechaza un token inválido o manipulado', () => {
    const req = { headers: { authorization: 'Bearer token.falso.123' } } as AuthRequest;
    verificarToken(req, buildRes(), next);

    expect((next.mock.calls[0][0] as unknown as AppError).statusCode).toBe(401);
  });

  it('inyecta el usuario en req y llama a next() sin error con un token válido', () => {
    const token = jwt.sign({ id: '1', email: 'admin@hotel.cl', role: 'SUPER_ADMIN' }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;

    verificarToken(req, buildRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toMatchObject({ email: 'admin@hotel.cl', role: 'SUPER_ADMIN' });
  });
});
