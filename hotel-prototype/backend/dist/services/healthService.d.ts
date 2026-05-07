import { IService } from '../interfaces/IService';
export interface IHealthService extends IService {
    checkHealth(): Promise<{
        status: string;
    }>;
}
export declare class HealthService implements IHealthService {
    checkHealth(): Promise<{
        status: string;
    }>;
}
//# sourceMappingURL=healthService.d.ts.map