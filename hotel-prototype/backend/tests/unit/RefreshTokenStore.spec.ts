import { InMemoryRefreshTokenStore } from '../../src/infrastructure/security/InMemoryRefreshTokenStore';

describe('InMemoryRefreshTokenStore', () => {
  let store: InMemoryRefreshTokenStore;

  beforeEach(() => {
    store = new InMemoryRefreshTokenStore();
  });

  it('registra y reconoce un token activo', () => {
    store.registrar('jti-1', 'user-1');
    expect(store.estaActivo('jti-1', 'user-1')).toBe(true);
  });

  it('no reconoce un token de otro usuario', () => {
    store.registrar('jti-1', 'user-1');
    expect(store.estaActivo('jti-1', 'user-2')).toBe(false);
  });

  it('revoca un token (rotación / logout)', () => {
    store.registrar('jti-1', 'user-1');
    store.revocar('jti-1');
    expect(store.estaActivo('jti-1', 'user-1')).toBe(false);
  });

  it('revoca todas las sesiones de un usuario', () => {
    store.registrar('jti-1', 'user-1');
    store.registrar('jti-2', 'user-1');
    store.registrar('jti-3', 'user-2');

    store.revocarTodas('user-1');

    expect(store.estaActivo('jti-1', 'user-1')).toBe(false);
    expect(store.estaActivo('jti-2', 'user-1')).toBe(false);
    expect(store.estaActivo('jti-3', 'user-2')).toBe(true);
  });
});
