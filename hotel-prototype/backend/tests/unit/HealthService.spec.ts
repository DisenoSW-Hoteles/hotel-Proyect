import { Request, Response } from 'express';
import { HealthService } from '../../src/application/health/HealthService';
import { HealthController } from '../../src/infrastructure/http/controllers/HealthController';

describe('HealthService', () => {
  it('reporta estado ok', async () => {
    const result = await new HealthService().checkHealth();
    expect(result).toEqual({ status: 'ok' });
  });
});

describe('HealthController', () => {
  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('responde 200 con el estado del servicio', async () => {
    const controller = new HealthController(new HealthService());
    const res = mockRes();

    await controller.checkHealth({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });

  it('responde 500 si el servicio falla', async () => {
    const service = new HealthService();
    jest.spyOn(service, 'checkHealth').mockRejectedValue(new Error('db down'));
    const controller = new HealthController(service);
    const res = mockRes();

    await controller.checkHealth({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
