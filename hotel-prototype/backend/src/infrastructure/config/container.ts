import { env } from './environment';
import { JwtTokenService } from '../security/JwtTokenService';
import { InMemoryRefreshTokenStore } from '../security/InMemoryRefreshTokenStore';
import { InMemoryUserRepository } from '../security/InMemoryUserRepository';
import { TypeOrmHabitacionRepository } from '../persistence/TypeOrmHabitacionRepository';
import { InMemoryReservationRepository } from '../persistence/InMemoryReservationRepository';
import { InMemoryFolioRepository } from '../persistence/InMemoryFolioRepository';
import { AuthService } from '../../application/auth/AuthService';
import { HabitacionService } from '../../application/reservas/HabitacionService';
import { ReservationService } from '../../application/reservas/ReservationService';
import { CrearReservaService } from '../../application/reservas/CrearReservaService';
import { FolioService } from '../../application/checkout/FolioService';
import { HealthService } from '../../application/health/HealthService';
import { AuthController } from '../http/controllers/AuthController';
import { HabitacionController } from '../http/controllers/HabitacionController';
import { ReservationController } from '../http/controllers/ReservationController';
import { ReservaPublicaController } from '../http/controllers/ReservaPublicaController';
import { FolioController } from '../http/controllers/FolioController';
import { HealthController } from '../http/controllers/HealthController';
import { crearAuthMiddleware } from '../http/middleware/authMiddleware';

/**
 * Composition Root (Inyección de Dependencias).
 *
 * Único lugar donde se instancian las implementaciones concretas (adaptadores de
 * infraestructura) y se cablean a los casos de uso (aplicación) a través de los
 * puertos del dominio. Cambiar in-memory por TypeORM/Redis solo se toca AQUÍ
 * (Inversión de Dependencias / Open-Closed).
 */

// --- Adaptadores de seguridad ---
const tokenService = new JwtTokenService({
  accessSecret: env.jwt.accessSecret,
  refreshSecret: env.jwt.refreshSecret,
  accessExpiresIn: env.jwt.accessExpiresIn,
  refreshExpiresIn: env.jwt.refreshExpiresIn,
  accessExpiresInSeconds: env.jwt.accessExpiresInSeconds,
});
const refreshStore = new InMemoryRefreshTokenStore();
const userRepository = new InMemoryUserRepository();

// --- Adaptadores de persistencia ---
const habitacionRepository = new TypeOrmHabitacionRepository();
const reservationRepository = new InMemoryReservationRepository();
const folioRepository = new InMemoryFolioRepository();

// --- Casos de uso (aplicación) ---
const authService = new AuthService(userRepository, tokenService, refreshStore);
const habitacionService = new HabitacionService(habitacionRepository);
const crearReservaService = new CrearReservaService(habitacionRepository);
const reservationService = new ReservationService(reservationRepository);
const folioService = new FolioService(folioRepository);
const healthService = new HealthService();

export const container = {
  tokenService,
  refreshStore,
  userRepository,
  habitacionRepository,
  reservationRepository,
  folioRepository,
  authService,
  habitacionService,
  reservationService,
  folioService,
  healthService,
  authController: new AuthController(authService),
  habitacionController: new HabitacionController(habitacionService),
  reservationController: new ReservationController(reservationService),
  reservaPublicaController: new ReservaPublicaController(crearReservaService),
  folioController: new FolioController(folioService),
  healthController: new HealthController(healthService),
  /** Middleware de autenticación ya enlazado al puerto ITokenService compartido. */
  authMiddleware: crearAuthMiddleware(tokenService),
};
