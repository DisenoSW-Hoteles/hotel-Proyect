import { Router } from 'express';
import { container } from '../../config/container';

/**
 * Ruta pública de creación de reservas (portal-cliente). Sin autenticación:
 * el huésped reserva sin tener cuenta. Montada en /api/reservas.
 */
const router = Router();
const { reservaPublicaController } = container;

router.post('/', reservaPublicaController.crear);

export default router;
