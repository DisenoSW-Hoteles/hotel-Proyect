import { JwtTokenService } from '../../src/infrastructure/security/JwtTokenService';
import { UserRole } from '../../src/domain/dtos/Auth.dto';

const config = {
  accessSecret: 'access-secret-test',
  refreshSecret: 'refresh-secret-test',
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
  accessExpiresInSeconds: 900,
};

describe('JwtTokenService', () => {
  const service = new JwtTokenService(config);

  it('firma y verifica un access token conservando el payload', () => {
    const token = service.generarAccessToken({
      sub: '1',
      email: 'admin@hotel.cl',
      role: UserRole.SuperAdmin,
      branch: 'TEMUCO',
    });

    const payload = service.verificarAccessToken(token);
    expect(payload.sub).toBe('1');
    expect(payload.email).toBe('admin@hotel.cl');
    expect(payload.role).toBe(UserRole.SuperAdmin);
  });

  it('genera un refresh token con jti único', () => {
    const a = service.generarRefreshToken('1');
    const b = service.generarRefreshToken('1');

    expect(a.jti).not.toBe(b.jti);
    const payload = service.verificarRefreshToken(a.token);
    expect(payload.sub).toBe('1');
    expect(payload.jti).toBe(a.jti);
  });

  it('rechaza un token firmado con otro secreto', () => {
    const otro = new JwtTokenService({ ...config, accessSecret: 'otro' });
    const token = otro.generarAccessToken({
      sub: '9',
      email: 'x@y.cl',
      role: UserRole.Admin,
      branch: 'PUCON',
    });

    expect(() => service.verificarAccessToken(token)).toThrow();
  });

  it('expone los segundos de expiración del access token', () => {
    expect(service.accessExpiresInSeconds).toBe(900);
  });
});
