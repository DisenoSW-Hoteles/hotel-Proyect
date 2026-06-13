import { Request, Response } from 'express';
import { errorHandler } from './errorHandler';
import { AppError } from '../../utils/errors/AppError';

const buildRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  it('usa el statusCode y mensaje de un AppError operacional', () => {
    const res = buildRes();
    errorHandler(new AppError('No autorizado', 401), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401, message: 'No autorizado' }),
    );
  });

  it('responde 500 genérico ante un Error no controlado y no filtra el mensaje', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = buildRes();

    errorHandler(new Error('fallo interno con datos sensibles'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500, message: 'Error interno del servidor' }),
    );
    spy.mockRestore();
  });
});
