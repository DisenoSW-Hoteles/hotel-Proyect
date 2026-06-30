import { IRefreshTokenStore } from '../../domain/ports/IRefreshTokenStore';

/**
 * ADAPTADOR in-memory del puerto IRefreshTokenStore, indexado por `jti`.
 * Permite rotación y revocación de sesiones:
 *  - Al emitir un refresh token se registra su `jti`.
 *  - Al renovar (`/refresh`) se revoca el `jti` antiguo y se registra el nuevo.
 *  - Al cerrar sesión (`/logout`) se revoca el `jti`.
 *
 * En producción se sustituye por Redis o una tabla sin cambiar el puerto.
 */
export class InMemoryRefreshTokenStore implements IRefreshTokenStore {
  private readonly activos = new Map<string, string>(); // jti -> userId

  registrar(jti: string, userId: string): void {
    this.activos.set(jti, userId);
  }

  estaActivo(jti: string, userId: string): boolean {
    return this.activos.get(jti) === userId;
  }

  revocar(jti: string): void {
    this.activos.delete(jti);
  }

  revocarTodas(userId: string): void {
    for (const [jti, uid] of this.activos.entries()) {
      if (uid === userId) {
        this.activos.delete(jti);
      }
    }
  }
}
