import { IService } from '../interfaces/IService';

export interface IHealthService extends IService {
  checkHealth(): Promise<{ status: string }>;
}

export class HealthService implements IHealthService {
  async checkHealth(): Promise<{ status: string }> {
    // Simple health check - in a real scenario, check DB, external services, etc.
    return { status: 'ok' };
  }
}
