import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '../../utils/errors/AppError';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

interface LoginResult {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    branch: string;
  };
}

// Almacén en memoria de refresh tokens válidos → suficiente para la demo y
// fácilmente sustituible por una tabla `refresh_token` en PostgreSQL.
// Estructura: refreshToken → { userId, email, role, expiresAt }
const refreshTokenStore = new Map<
  string,
  { userId: string; email: string; role: string; expiresAt: Date }
>();

// Usuarios hardcodeados para la presentación en vivo.
// En producción reemplazar con consulta a tabla `usuario` + bcrypt.compare().
const MOCK_USERS: Record<
  string,
  { id: string; password: string; full_name: string; role: string; branch: string }
> = {
  'admin@hotel.cl': {
    id: '1',
    password: 'admin123',
    full_name: 'Administrador Principal',
    role: 'SUPER_ADMIN',
    branch: 'TEMUCO',
  },
  'recepcion@hotel.cl': {
    id: '2',
    password: 'recep123',
    full_name: 'Recepcionista Temuco',
    role: 'RECEPTIONIST',
    branch: 'TEMUCO',
  },
};

const JWT_SECRET = process.env.JWT_SECRET ?? 'secreto_super_seguro_desarrollo';
const ACCESS_TOKEN_TTL = '1h';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export class AuthService {
  login(email: string, password: string): LoginResult {
    const user = MOCK_USERS[email?.toLowerCase()];

    if (!user || user.password !== password) {
      throw new AppError('Credenciales inválidas. Verifique su email y contraseña.', 401);
    }

    const payload: JwtPayload = { id: user.id, email, role: user.role };

    const access_token = this.signAccessToken(payload);
    const refresh_token = this.generateRefreshToken(user.id, email, user.role);

    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: user.id,
        email,
        full_name: user.full_name,
        role: user.role,
        branch: user.branch,
      },
    };
  }

  refreshAccessToken(refreshToken: string): {
    access_token: string;
    refresh_token: string;
    token_type: 'Bearer';
    expires_in: number;
  } {
    const stored = refreshTokenStore.get(refreshToken);

    if (!stored) {
      throw new AppError('Refresh token inválido o ya fue utilizado.', 401);
    }

    if (new Date() > stored.expiresAt) {
      refreshTokenStore.delete(refreshToken);
      throw new AppError('Refresh token expirado. Por favor, inicie sesión nuevamente.', 401);
    }

    // Rotación: el token viejo se invalida inmediatamente
    refreshTokenStore.delete(refreshToken);

    const payload: JwtPayload = { id: stored.userId, email: stored.email, role: stored.role };
    const access_token = this.signAccessToken(payload);

    // Emitir un nuevo refresh token para la próxima rotación y devolverlo al cliente
    const refresh_token = this.generateRefreshToken(stored.userId, stored.email, stored.role);

    return { access_token, refresh_token, token_type: 'Bearer', expires_in: 3600 };
  }

  logout(refreshToken: string): void {
    refreshTokenStore.delete(refreshToken);
  }

  private signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL } as SignOptions);
  }

  private generateRefreshToken(userId: string, email: string, role: string): string {
    const token = crypto.randomBytes(64).toString('hex');
    refreshTokenStore.set(token, {
      userId,
      email,
      role,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
    return token;
  }
}
