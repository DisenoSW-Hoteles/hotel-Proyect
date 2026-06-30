import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../application/auth/AuthService';
import { LoginDTO, RefreshDTO } from '../../../domain/dtos/Auth.dto';

/**
 * Controlador de autenticación (adaptador HTTP / capa de presentación).
 * Traduce HTTP <-> caso de uso AuthService. Sin lógica de negocio ni acceso a datos.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Inicia sesión y devuelve access + refresh tokens
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string, example: "admin@hotel.cl" }
   *               password: { type: string, example: "Admin123!" }
   *     responses:
   *       200: { description: Autenticación exitosa }
   *       401: { description: Credenciales inválidas }
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as LoginDTO;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Renueva el access token usando un refresh token (con rotación)
   *     tags: [Auth]
   *     responses:
   *       200: { description: Nuevo par de tokens emitido }
   *       401: { description: Refresh token inválido, expirado o revocado }
   */
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refresh_token } = req.body as RefreshDTO;
      const result = await this.authService.refresh(refresh_token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Cierra sesión revocando el refresh token
   *     tags: [Auth]
   *     responses:
   *       204: { description: Sesión cerrada }
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refresh_token } = req.body as RefreshDTO;
      await this.authService.logout(refresh_token);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
