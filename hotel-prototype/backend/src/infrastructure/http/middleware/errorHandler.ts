import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors/AppError';

/**
 * Middleware global de manejo de errores (adaptador HTTP).
 * Distingue errores operacionales (AppError) de fallos inesperados, que se
 * registran sin filtrar detalles internos al cliente.
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';

  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error('🔥 ERROR CRÍTICO NO CONTROLADO:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
