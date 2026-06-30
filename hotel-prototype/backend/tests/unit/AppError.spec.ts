import { AppError } from '../../src/domain/errors/AppError';

describe('AppError', () => {
  it('crea un error operacional con statusCode y mensaje', () => {
    const error = new AppError('Recurso no encontrado', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Recurso no encontrado');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('captura el stack trace', () => {
    const error = new AppError('Boom', 500);
    expect(error.stack).toBeDefined();
  });
});
