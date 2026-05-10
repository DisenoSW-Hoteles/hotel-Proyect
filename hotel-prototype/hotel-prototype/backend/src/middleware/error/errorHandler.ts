import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors/AppError.js'; // Regla Node16: extensión .js

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';

  if ('isOperational' in err && err.isOperational) {
    statusCode = (err as AppError).statusCode;
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
