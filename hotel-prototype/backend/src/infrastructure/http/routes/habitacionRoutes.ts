import { Router } from 'express';
import { container } from '../../config/container';
import { autorizarRoles } from '../middleware/authMiddleware';
import { UserRole } from '../../../domain/dtos/Auth.dto';

/**
 * Rutas del módulo de Habitaciones/Reservas (adaptador HTTP).
 *  - Búsqueda de disponibilidad: pública (portal-cliente).
 *  - Catálogo administrativo: protegido con JWT + rol (panel-admin).
 */
const router = Router();
const { habitacionController, authMiddleware } = container;

router.post('/habitaciones/disponibilidad', habitacionController.buscarDisponibilidad);

router.get(
  '/admin/rooms',
  authMiddleware,
  autorizarRoles(UserRole.SuperAdmin, UserRole.Admin),
  habitacionController.obtenerTodas
);

export default router;
