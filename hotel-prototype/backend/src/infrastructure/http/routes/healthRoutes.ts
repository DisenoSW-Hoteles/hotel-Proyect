import { Router } from 'express';
import { container } from '../../config/container';

/**
 * Ruta de health check (adaptador HTTP).
 */
const router = Router();
const { healthController } = container;

router.get('/health', healthController.checkHealth);

export default router;
