import { Router } from 'express';
import { container } from '../../config/container';
import { autorizarRoles } from '../middleware/authMiddleware';
import { UserRole } from '../../../domain/dtos/Auth.dto';

/**
 * Rutas administrativas de Folios (check-out). Protegidas con JWT + rol.
 * Montadas en /api/admin/folios.
 */
const router = Router();
const { folioController, authMiddleware } = container;

router.use(
  authMiddleware,
  autorizarRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.Recepcionista)
);

router.get('/reservation/:reservationId', folioController.obtenerPorReserva);
router.post('/charges', folioController.agregarCargo);
router.patch('/:folioId/close', folioController.cerrar);

export default router;
