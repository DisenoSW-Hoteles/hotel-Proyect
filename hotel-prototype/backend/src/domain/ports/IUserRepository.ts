import { UserRole } from '../dtos/Auth.dto';

/**
 * Registro interno de usuario. Incluye el hash de la contraseña,
 * por lo que NUNCA debe serializarse directamente hacia el cliente.
 */
export interface UsuarioRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  branch: string;
}

/**
 * PUERTO de salida para el acceso a datos de usuarios.
 * La capa de aplicación depende de esta abstracción; la implementación concreta
 * (in-memory, TypeORM/PostgreSQL...) vive en infraestructura (Inversión de Dependencias).
 */
export interface IUserRepository {
  findByEmail(email: string): Promise<UsuarioRecord | null>;
  findById(id: string): Promise<UsuarioRecord | null>;
}
