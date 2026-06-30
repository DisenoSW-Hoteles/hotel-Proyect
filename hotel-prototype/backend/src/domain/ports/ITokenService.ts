import { AccessTokenPayload, RefreshTokenPayload } from '../dtos/Auth.dto';

/**
 * PUERTO de salida para la emisión/verificación de tokens.
 * Abstrae la librería concreta (jsonwebtoken). El caso de uso de autenticación
 * depende de este contrato, no de la implementación (JwtTokenService).
 */
export interface ITokenService {
  generarAccessToken(payload: AccessTokenPayload): string;
  generarRefreshToken(userId: string): { token: string; jti: string };
  verificarAccessToken(token: string): AccessTokenPayload;
  verificarRefreshToken(token: string): RefreshTokenPayload;
  readonly accessExpiresInSeconds: number;
}
