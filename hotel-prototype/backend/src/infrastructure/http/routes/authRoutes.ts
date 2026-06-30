import { Router } from 'express';
import { container } from '../../config/container';

/**
 * Módulo de rutas de autenticación (adaptador HTTP).
 */
const router = Router();
const { authController } = container;

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
