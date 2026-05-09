import { Request, Response } from 'express';
import { HealthService } from '../services/healthService';
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    checkHealth(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=healthController.d.ts.map