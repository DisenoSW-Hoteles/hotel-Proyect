import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/auth/AuthService';

const authService = new AuthService();

export class AuthController {
  /**
   * POST /api/auth/login
   * Body: { email: string, password: string }
   */
  login(req: Request, res: Response, next: NextFunction): void {
    try {
      const { email, password } = req.body;
      const result = authService.login(email, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/refresh
   * Body: { refresh_token: string }
   * Devuelve un nuevo access_token usando rotación de refresh token.
   */
  refresh(req: Request, res: Response, next: NextFunction): void {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        res.status(400).json({ message: 'refresh_token es requerido.' });
        return;
      }
      const result = authService.refreshAccessToken(refresh_token);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/logout
   * Body: { refresh_token: string }
   * Invalida el refresh token en el servidor (revocación explícita).
   */
  logout(req: Request, res: Response, next: NextFunction): void {
    try {
      const { refresh_token } = req.body;
      if (refresh_token) {
        authService.logout(refresh_token);
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
