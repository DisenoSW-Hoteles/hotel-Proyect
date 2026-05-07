import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/environment.js';

type ErrorLike = {
  message?: string;
  stack?: string;
  statusCode?: number;
  isOperational?: boolean;
};

export default function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const error = err as ErrorLike;

  const isDev = env.nodeEnv === 'development';

  if (isDev) {
    res.status(error.statusCode ?? 500).json({
      status: 'error',
      message: error.message ?? 'Internal Server Error',
      stack: error.stack ?? null,
      details: error,
    });
    return;
  }

  // production
  if (error.isOperational === true) {
    res.status(error.statusCode ?? 500).json({
      status: 'error',
      message: error.message ?? 'Internal Server Error',
    });
    return;
  }

  // unknown / programming error
  res.status(500).json({
    status: 'error',
    message: 'Algo salió mal',
  });
}
