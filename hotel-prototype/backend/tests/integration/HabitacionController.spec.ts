import { Request, Response, NextFunction } from 'express';
import { HabitacionController } from '../../src/infrastructure/http/controllers/HabitacionController';
import { HabitacionService } from '../../src/application/reservas/HabitacionService';
import { IHabitacionRepository } from '../../src/domain/ports/IHabitacionRepository';
import { AppError } from '../../src/domain/errors/AppError';

// Integración: Controlador (HTTP) -> Caso de uso (HabitacionService) -> Puerto.
// La capa de datos (puerto) se sustituye por un doble de prueba.
const makeRepoMock = (): jest.Mocked<IHabitacionRepository> => ({
  buscarDisponibles: jest.fn(),
  buscarTodas: jest.fn(),
  buscarPorId: jest.fn(),
});

const mockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('HabitacionController (integración)', () => {
  let repo: jest.Mocked<IHabitacionRepository>;
  let controller: HabitacionController;

  beforeEach(() => {
    repo = makeRepoMock();
    controller = new HabitacionController(new HabitacionService(repo));
  });

  it('buscarDisponibilidad responde 200 con resultados', async () => {
    repo.buscarDisponibles.mockResolvedValue([
      {
        id: 1,
        numero: '101',
        tipo: 'PLUS',
        capacidadMaxima: 2,
        piso: 1,
        estado: 'DISPONIBLE',
        sucursalNombre: 'TEMUCO',
        precioBase: 80000,
      },
    ]);
    const req = {
      body: {
        fechaCheckIn: '2026-07-01',
        fechaCheckOut: '2026-07-05',
        cantidadHuespedes: 2,
        sucursalNombre: 'Temuco',
      },
    } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    await controller.buscarDisponibilidad(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', results: 1 })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('delega el error al middleware (next) cuando faltan datos de negocio', async () => {
    const req = { body: { sucursalNombre: '' } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    await controller.buscarDisponibilidad(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(res.status).not.toHaveBeenCalled();
  });

  it('obtenerTodas responde 200 con el catálogo', async () => {
    repo.buscarTodas.mockResolvedValue([
      {
        id: 1,
        numero: '201',
        tipo: 'ESTANDAR',
        capacidadMaxima: 2,
        piso: 2,
        estado: 'DISPONIBLE',
        sucursalNombre: 'TEMUCO',
        precioBase: 50000,
      },
    ]);
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    await controller.obtenerTodas({} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
