import { Router } from 'express';
import { HealthController } from '../controllers/healthController.js';
import { HealthService } from '../services/healthService.js';

const router = Router();
const healthService = new HealthService();
const healthController = new HealthController(healthService);

router.get('/health', (req, res) => healthController.checkHealth(req, res));

export default router;
