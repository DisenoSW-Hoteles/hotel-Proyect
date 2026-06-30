import { CrearReservaService } from '../../src/application/reservas/CrearReservaService';
import { IHabitacionRepository } from '../../src/domain/ports/IHabitacionRepository';
import { HabitacionCrudaDTO } from '../../src/domain/dtos/Habitacion.dto';

const habitacion: HabitacionCrudaDTO = {
  id: 3,
  numero: '201',
  tipo: 'PLUS',
  capacidadMaxima: 4,
  piso: 2,
  estado: 'DISPONIBLE',
  sucursalNombre: 'TEMUCO',
  precioBase: 80000,
};

const makeRepo = (): jest.Mocked<IHabitacionRepository> => ({
  buscarDisponibles: jest.fn(),
  buscarTodas: jest.fn(),
  buscarPorId: jest.fn().mockResolvedValue(habitacion),
});

const dtoBase = {
  habitacionId: 3,
  sucursalId: 'Temuco',
  fechaCheckIn: '2026-07-01',
  fechaCheckOut: '2026-07-03', // 2 noches
  cantidadHuespedes: 2,
  huespedNombre: 'Juan Pérez',
  huespedEmail: 'juan@example.cl',
  huespedTelefono: '+56912345678',
  servicios: ['DesayunoCafeteria'], // 5000
};

describe('CrearReservaService', () => {
  it('calcula el total (noches × tarifa + servicios) y mapea el tipo', async () => {
    const service = new CrearReservaService(makeRepo());
    const reserva = await service.crear({ ...dtoBase });

    // 2 noches × 80000 + 5000 (desayuno cafetería) = 165000
    expect(reserva.totalEstimado).toBe(165000);
    expect(reserva.tipoHabitacion).toBe('Plus');
    expect(reserva.id).toBeDefined();
    expect(reserva.fechaCreacion).toBeDefined();
  });

  it('lanza 404 si la habitación no existe', async () => {
    const repo = makeRepo();
    repo.buscarPorId.mockResolvedValue(null);
    await expect(new CrearReservaService(repo).crear({ ...dtoBase })).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('lanza 400 si el check-out no es posterior al check-in', async () => {
    const service = new CrearReservaService(makeRepo());
    await expect(service.crear({ ...dtoBase, fechaCheckOut: '2026-07-01' })).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('lanza 400 si se excede la capacidad de la habitación', async () => {
    const service = new CrearReservaService(makeRepo());
    await expect(service.crear({ ...dtoBase, cantidadHuespedes: 10 })).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
