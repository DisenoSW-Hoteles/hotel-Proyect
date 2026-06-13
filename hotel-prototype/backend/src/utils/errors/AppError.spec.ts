import { AppError } from './AppError';

describe('AppError', () => {
  it('es una instancia de Error con mensaje y statusCode', () => {
    const err = new AppError('Recurso no encontrado', 404);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Recurso no encontrado');
    expect(err.statusCode).toBe(404);
  });

  it('marca el error como operacional (esperado / controlado)', () => {
    const err = new AppError('Credenciales inválidas', 401);
    expect(err.isOperational).toBe(true);
  });

  it('captura un stack trace', () => {
    const err = new AppError('falla', 500);
    expect(err.stack).toBeDefined();
  });
});
