import { Router } from 'express';
import { container } from '../../config/container';
import { autorizarRoles } from '../middleware/authMiddleware';
import { UserRole } from '../../../domain/dtos/Auth.dto';

/**
 * Rutas administrativas de Reservas (check-in). Protegidas con JWT + rol.
 * Montadas en /api/admin/reservations.
 */
const router = Router();
const { reservationController, authMiddleware } = container;

router.use(
  authMiddleware,
  autorizarRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.Recepcionista)
);

router.get('/by-code/:code', reservationController.buscarPorCodigo);
router.get('/by-guest/:documentNumber', reservationController.buscarPorDocumento);
router.post('/:id/check-in', reservationController.checkIn);

export default router;
