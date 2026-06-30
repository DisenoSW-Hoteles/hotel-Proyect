import { Request, Response } from 'express';
import { errorHandler } from '../../src/infrastructure/http/middleware/errorHandler';
import { AppError } from '../../src/domain/errors/AppError';

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  it('responde con el statusCode de un AppError operacional', () => {
    const res = mockResponse();
    const err = new AppError('No autorizado', 401);

    errorHandler(err, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401, message: 'No autorizado' })
    );
  });

  it('oculta detalles y responde 500 ante un error no controlado', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = mockResponse();

    errorHandler(new Error('fallo interno con datos sensibles'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500, message: 'Error interno del servidor' })
    );
    consoleSpy.mockRestore();
  });
});
