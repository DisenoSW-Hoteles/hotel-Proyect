import { Request, Response } from 'express';
import { HealthService } from '../../../application/health/HealthService';

/**
 * Controlador de health check (adaptador HTTP).
 */
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Health check endpoint
   *     responses:
   *       200:
   *         description: Server is healthy
   */
  checkHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.healthService.checkHealth();
      res.status(200).json(result);
    } catch {
      res.status(500).json({ status: 'error', message: 'Health check failed' });
    }
  };
}
