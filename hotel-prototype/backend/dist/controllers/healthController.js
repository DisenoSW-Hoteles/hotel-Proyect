"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
class HealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    /**
     * @swagger
     * /api/health:
     *   get:
     *     summary: Health check endpoint
     *     description: Verifies that the server is running and healthy
     *     responses:
     *       200:
     *         description: Server is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: ok
     */
    async checkHealth(_req, res) {
        try {
            const result = await this.healthService.checkHealth();
            res.status(200).json(result);
        }
        catch {
            res.status(500).json({ status: 'error', message: 'Health check failed' });
        }
    }
}
exports.HealthController = HealthController;
