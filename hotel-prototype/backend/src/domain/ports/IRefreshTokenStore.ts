/**
 * PUERTO de salida para el almacén de refresh tokens activos (rotación/revocación).
 * Implementación in-memory para el MVP; en producción se sustituye por Redis o
 * una tabla sin cambiar este contrato.
 */
export interface IRefreshTokenStore {
  registrar(jti: string, userId: string): void;
  estaActivo(jti: string, userId: string): boolean;
  revocar(jti: string): void;
  revocarTodas(userId: string): void;
}
