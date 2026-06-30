import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { ITokenService } from '../../domain/ports/ITokenService';
import { AccessTokenPayload, RefreshTokenPayload } from '../../domain/dtos/Auth.dto';

export interface TokenServiceConfig {
  accessSecret: string;
  refreshSecret: string;
  /** Vida del access token, formato `jsonwebtoken` (ej. '15m'). */
  accessExpiresIn: string;
  /** Vida del refresh token (ej. '7d'). */
  refreshExpiresIn: string;
  /** Vida del access token en segundos, para el campo `expires_in`. */
  accessExpiresInSeconds: number;
}

/**
 * ADAPTADOR del puerto ITokenService usando la librería `jsonwebtoken`.
 * Responsabilidad Única: firmar y verificar JWT. Separa el access token (corta
 * vida) del refresh token (larga vida con `jti` para rotarlo/revocarlo).
 */
export class JwtTokenService implements ITokenService {
  constructor(private readonly config: TokenServiceConfig) {}

  generarAccessToken(payload: AccessTokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.config.accessExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, this.config.accessSecret, options);
  }

  generarRefreshToken(userId: string): { token: string; jti: string } {
    const jti = uuid();
    const options: SignOptions = {
      expiresIn: this.config.refreshExpiresIn as SignOptions['expiresIn'],
    };
    const token = jwt.sign({ sub: userId, jti }, this.config.refreshSecret, options);
    return { token, jti };
  }

  verificarAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.config.accessSecret) as AccessTokenPayload;
  }

  verificarRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, this.config.refreshSecret) as RefreshTokenPayload;
  }

  get accessExpiresInSeconds(): number {
    return this.config.accessExpiresInSeconds;
  }
}
