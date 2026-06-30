import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors/AppError';
import { ITokenService } from '../../../domain/ports/ITokenService';
import { AccessTokenPayload, UserRole } from '../../../domain/dtos/Auth.dto';

/** Request enriquecido con el usuario autenticado (payload del access token). */
export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
}

/**
 * Factoría del middleware de autenticación. Recibe el puerto ITokenService por
 * inyección (DIP) para verificar el access token. Retorna un middleware Express.
 */
export const crearAuthMiddleware = (tokenService: ITokenService) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No estás autenticado. Por favor, inicia sesión.', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
      req.user = tokenService.verificarAccessToken(token);
      next();
    } catch {
      return next(new AppError('Token inválido o expirado.', 401));
    }
  };
};

/**
 * Middleware de autorización por roles (RBAC). Debe usarse SIEMPRE después de
 * `crearAuthMiddleware`, que es quien inyecta `req.user`.
 */
export const autorizarRoles = (...rolesPermitidos: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('No autenticado.', 401));
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return next(new AppError('No tienes permisos para acceder a este recurso.', 403));
    }
    next();
  };
};
