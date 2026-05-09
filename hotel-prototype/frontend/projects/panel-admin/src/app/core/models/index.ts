// Modelos de dominio compartidos (cross-cutting)
// Solo lo que es verdaderamente global: autenticación y constantes de negocio.

export type AdminRole = 'SUPER_ADMIN' | 'GERENTE' | 'RECEPCIONISTA';
export type HotelBranch = 'TEMUCO' | 'PUCON' | 'SANTIAGO' | 'VINA_DEL_MAR';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  sucursal: HotelBranch;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
