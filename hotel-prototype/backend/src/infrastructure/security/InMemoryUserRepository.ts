import bcrypt from 'bcryptjs';
import { IUserRepository, UsuarioRecord } from '../../domain/ports/IUserRepository';
import { UserRole } from '../../domain/dtos/Auth.dto';

/**
 * ADAPTADOR in-memory del puerto IUserRepository.
 *
 * Se usa por defecto para la demostración y los tests: el login funciona sin
 * depender de una conexión PostgreSQL activa. En producción se inyecta una
 * implementación TypeORM que cumple el mismo puerto (Inversión de Dependencias).
 *
 * Las contraseñas se almacenan SIEMPRE como hash bcrypt, nunca en texto plano.
 */
export class InMemoryUserRepository implements IUserRepository {
  private readonly usuarios: UsuarioRecord[];

  constructor(saltRounds = 10) {
    this.usuarios = [
      {
        id: '1',
        email: 'admin@hotel.cl',
        passwordHash: bcrypt.hashSync('Admin123!', saltRounds),
        fullName: 'Administrador Principal',
        role: UserRole.SuperAdmin,
        branch: 'TEMUCO',
      },
      {
        id: '2',
        email: 'recepcion@hotel.cl',
        passwordHash: bcrypt.hashSync('Recepcion123!', saltRounds),
        fullName: 'Recepción Pucón',
        role: UserRole.Recepcionista,
        branch: 'PUCON',
      },
    ];
  }

  async findByEmail(email: string): Promise<UsuarioRecord | null> {
    const normalizado = email.trim().toLowerCase();
    return this.usuarios.find((u) => u.email.toLowerCase() === normalizado) ?? null;
  }

  async findById(id: string): Promise<UsuarioRecord | null> {
    return this.usuarios.find((u) => u.id === id) ?? null;
  }
}
