import bcrypt from 'bcryptjs';
import { InMemoryUserRepository } from '../../src/infrastructure/security/InMemoryUserRepository';

describe('InMemoryUserRepository', () => {
  const repo = new InMemoryUserRepository();

  it('encuentra un usuario por email (case-insensitive) con hash bcrypt', async () => {
    const usuario = await repo.findByEmail('ADMIN@HOTEL.CL');
    expect(usuario).not.toBeNull();
    expect(usuario?.email).toBe('admin@hotel.cl');
    // La contraseña se guarda hasheada, nunca en texto plano.
    expect(usuario?.passwordHash).not.toBe('Admin123!');
    expect(bcrypt.compareSync('Admin123!', usuario?.passwordHash ?? '')).toBe(true);
  });

  it('retorna null si el email no existe', async () => {
    expect(await repo.findByEmail('nadie@hotel.cl')).toBeNull();
  });

  it('encuentra un usuario por id', async () => {
    const usuario = await repo.findById('2');
    expect(usuario?.email).toBe('recepcion@hotel.cl');
  });

  it('retorna null si el id no existe', async () => {
    expect(await repo.findById('999')).toBeNull();
  });
});
