import { HabitacionService } from '../../src/application/reservas/HabitacionService';
import { IHabitacionRepository } from '../../src/domain/ports/IHabitacionRepository';
import { HabitacionCrudaDTO, TipoHabitacion } from '../../src/domain/dtos/Habitacion.dto';

// Doble de prueba del PUERTO IHabitacionRepository (inyección de dependencias):
// el servicio se prueba SIN base de datos.
const makeRepoMock = (): jest.Mocked<IHabitacionRepository> => ({
  buscarDisponibles: jest.fn(),
  buscarTodas: jest.fn(),
  buscarPorId: jest.fn(),
});

/** Construye una fila cruda completa (como la entrega la persistencia). */
const cruda = (over: Partial<HabitacionCrudaDTO>): HabitacionCrudaDTO => ({
  id: 1,
  numero: '101',
  tipo: 'ESTANDAR',
  capacidadMaxima: 2,
  piso: 1,
  estado: 'DISPONIBLE',
  sucursalNombre: 'TEMUCO',
  precioBase: 50000,
  ...over,
});

describe('HabitacionService', () => {
  let repo: jest.Mocked<IHabitacionRepository>;
  let service: HabitacionService;

  const consultaValida = {
    fechaCheckIn: '2026-07-01',
    fechaCheckOut: '2026-07-05',
    cantidadHuespedes: 2,
    sucursalNombre: 'Viña del Mar',
  };

  beforeEach(() => {
    repo = makeRepoMock();
    service = new HabitacionService(repo);
  });

  describe('obtenerHabitacionesDisponibles', () => {
    it('lanza 400 si falta la sucursal', async () => {
      await expect(
        service.obtenerHabitacionesDisponibles({ ...consultaValida, sucursalNombre: '' })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('lanza 400 (no 500) si la sucursal no es reconocida', async () => {
      await expect(
        service.obtenerHabitacionesDisponibles({ ...consultaValida, sucursalNombre: 'Narnia' })
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(repo.buscarDisponibles).not.toHaveBeenCalled();
    });

    it('normaliza la sucursal, mapea tipos y expone el precio real', async () => {
      repo.buscarDisponibles.mockResolvedValue([
        cruda({ id: 1, tipo: 'SUITE_EJECUTIVA', capacidadMaxima: 4, precioBase: 150000 }),
        cruda({ id: 2, tipo: 'PLUS', capacidadMaxima: 2, precioBase: 80000 }),
      ]);

      const result = await service.obtenerHabitacionesDisponibles({ ...consultaValida });

      // La sucursal se normaliza al formato canónico del enum (VINA_DEL_MAR).
      expect(repo.buscarDisponibles).toHaveBeenCalledWith(
        expect.objectContaining({ sucursalNombre: 'VINA_DEL_MAR' })
      );
      expect(result[0].tipoHabitacion).toBe(TipoHabitacion.SuiteEjecutiva);
      expect(result[0].precioPorNoche).toBe(150000);
      expect(result[1].tipoHabitacion).toBe(TipoHabitacion.Plus);
    });

    it('mapea un tipo desconocido a Estandar por defecto', async () => {
      repo.buscarDisponibles.mockResolvedValue([cruda({ tipo: 'DESCONOCIDO' })]);
      const result = await service.obtenerHabitacionesDisponibles({ ...consultaValida });
      expect(result[0].tipoHabitacion).toBe(TipoHabitacion.Estandar);
    });
  });

  describe('obtenerTodas (catálogo admin)', () => {
    it('devuelve el shape RoomResponseDto con tarifa, número y estado', async () => {
      repo.buscarTodas.mockResolvedValue([
        cruda({ id: 5, numero: '301', piso: 3, tipo: 'SUITE_EJECUTIVA', precioBase: 150000 }),
      ]);

      const result = await service.obtenerTodas();

      expect(result[0]).toMatchObject({
        id: '5',
        number: '301',
        floor: 3,
        type: 'SUITE',
        capacity: 2,
        base_rate: 150000,
        status: 'AVAILABLE',
        branch: 'TEMUCO',
      });
    });
  });
});
