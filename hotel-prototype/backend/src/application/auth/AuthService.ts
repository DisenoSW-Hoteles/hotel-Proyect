import bcrypt from 'bcryptjs';
import { IUserRepository, UsuarioRecord } from '../../domain/ports/IUserRepository';
import { ITokenService } from '../../domain/ports/ITokenService';
import { IRefreshTokenStore } from '../../domain/ports/IRefreshTokenStore';
import { AppError } from '../../domain/errors/AppError';
import { AuthResponseDTO, UsuarioPublicoDTO } from '../../domain/dtos/Auth.dto';

/**
 * CASO DE USO de autenticación (capa de aplicación).
 *
 * Depende EXCLUSIVAMENTE de puertos del dominio (IUserRepository, ITokenService,
 * IRefreshTokenStore) inyectados por constructor → Regla de Dependencia hacia
 * adentro + alta testeabilidad. No conoce Express, TypeORM ni jsonwebtoken.
 *
 *  - login: valida credenciales con bcrypt y emite access + refresh tokens.
 *  - refresh: rota el refresh token y emite un nuevo access token.
 *  - logout: revoca el refresh token.
 */
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly refreshStore: IRefreshTokenStore
  ) {}

  async login(email: string, password: string): Promise<AuthResponseDTO> {
    if (!email || !password) {
      throw new AppError('Email y contraseña son obligatorios.', 400);
    }

    const usuario = await this.userRepository.findByEmail(email);
    // Comparación contra hash bcrypt. Si el usuario no existe igualmente
    // ejecutamos un compare contra un hash dummy para evitar timing attacks.
    const hash = usuario?.passwordHash ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinv';
    const passwordValido = await bcrypt.compare(password, hash);

    if (!usuario || !passwordValido) {
      throw new AppError('Credenciales inválidas. Verifique su email y contraseña.', 401);
    }

    return this.emitirTokens(usuario);
  }

  async refresh(refreshToken: string): Promise<AuthResponseDTO> {
    if (!refreshToken) {
      throw new AppError('Refresh token requerido.', 400);
    }

    let payload;
    try {
      payload = this.tokenService.verificarRefreshToken(refreshToken);
    } catch {
      throw new AppError('Refresh token inválido o expirado.', 401);
    }

    // El token debe seguir activo (no revocado ni ya rotado).
    if (!this.refreshStore.estaActivo(payload.jti, payload.sub)) {
      throw new AppError('Sesión revocada. Inicie sesión nuevamente.', 401);
    }

    const usuario = await this.userRepository.findById(payload.sub);
    if (!usuario) {
      throw new AppError('Usuario no encontrado.', 401);
    }

    // Rotación: invalida el refresh token usado antes de emitir el nuevo.
    this.refreshStore.revocar(payload.jti);
    return this.emitirTokens(usuario);
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    try {
      const payload = this.tokenService.verificarRefreshToken(refreshToken);
      this.refreshStore.revocar(payload.jti);
    } catch {
      // Token ya inválido: el logout es idempotente, no es un error.
    }
  }

  /** Genera el par access + refresh y registra el refresh para rotación. */
  private emitirTokens(usuario: UsuarioRecord): AuthResponseDTO {
    const accessToken = this.tokenService.generarAccessToken({
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
      branch: usuario.branch,
    });

    const { token: refreshToken, jti } = this.tokenService.generarRefreshToken(usuario.id);
    this.refreshStore.registrar(jti, usuario.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: this.tokenService.accessExpiresInSeconds,
      user: this.toPublico(usuario),
    };
  }

  private toPublico(usuario: UsuarioRecord): UsuarioPublicoDTO {
    return {
      id: usuario.id,
      email: usuario.email,
      full_name: usuario.fullName,
      role: usuario.role,
      branch: usuario.branch,
    };
  }
}
