import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/errors/AppError';

export class AuthController {
  public login(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;

    // HARDCODE (Mock) exclusivo para la presentación en vivo
    if (email === 'admin@hotel.cl' && password === 'admin123') {

      // 1. Fabricamos la pulsera VIP (Token JWT) con la firma secreta
      const token = jwt.sign(
        { id: '1', email: email, role: 'SUPER_ADMIN' },
        process.env.JWT_SECRET || 'secreto_super_seguro_desarrollo',
        { expiresIn: '1h' }
      );

      // 2. Devolvemos la estructura JSON exacta que el frontend necesita mapear
      res.status(200).json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          id: '1',
          email: email,
          full_name: 'Administrador Principal',
          role: 'SUPER_ADMIN',
          branch: 'TEMUCO'
        }
      });
    } else {
      // Si el email o clave fallan, lanzamos un error que atrapará tu manejador global
      next(new AppError('Credenciales inválidas. Verifique su email y contraseña.', 401));
    }
  }
}
