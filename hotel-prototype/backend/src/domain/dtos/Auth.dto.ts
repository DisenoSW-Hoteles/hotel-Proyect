/**
 * Contratos (DTOs) del dominio de Autenticación.
 * Centralizan la forma de los datos que viajan entre capas y hacia el frontend.
 */

/** Roles del sistema (RBAC). El orden no implica jerarquía automática. */
export enum UserRole {
  SuperAdmin = 'SUPER_ADMIN',
  Admin = 'ADMIN',
  Recepcionista = 'RECEPCIONISTA',
}

/** Cuerpo esperado en POST /api/auth/login */
export interface LoginDTO {
  email: string;
  password: string;
}

/** Cuerpo esperado en POST /api/auth/refresh y /logout */
export interface RefreshDTO {
  refresh_token: string;
}

/** Representación pública de un usuario (nunca expone el hash). */
export interface UsuarioPublicoDTO {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  branch: string;
}

/** Respuesta estándar de autenticación enviada al frontend. */
export interface AuthResponseDTO {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: UsuarioPublicoDTO;
}

/** Payload que viaja firmado dentro del access token. */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  branch: string;
}

/** Payload que viaja firmado dentro del refresh token. */
export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}
