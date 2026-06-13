// El repositorio toca PostgreSQL en tiempo de import (AppDataSource), por lo que lo
// mockeamos por completo para poder probar la lógica del servicio de forma aislada.
jest.mock('../../repositories/reservas/HabitacionRepository', () => ({
  HabitacionRepository: {
    buscarDisponibles: jest.fn(),
    buscarTodas: jest.fn(),
  },
}));

import { HabitacionService } from './HabitacionService';
import { HabitacionRepository } from '../../repositories/reservas/HabitacionRepository';
import { TipoHabitacion, ConsultaDisponibilidadDTO } from '../../models/dtos/Habitacion.dto';
import { AppError } from '../../utils/errors/AppError';

const repo = HabitacionRepository as unknown as {
  buscarDisponibles: jest.Mock;
  buscarTodas: jest.Mock;
};

const baseConsulta = (
  over: Partial<ConsultaDisponibilidadDTO> = {},
): ConsultaDisponibilidadDTO => ({
  fechaCheckIn: '2026-07-01',
  fechaCheckOut: '2026-07-03',
  cantidadHuespedes: 2,
  sucursalNombre: 'TEMUCO',
  ...over,
});

describe('HabitacionService', () => {
  let service: HabitacionService;

  beforeEach(() => {
    service = new HabitacionService();
  });

  describe('obtenerHabitacionesDisponibles', () => {
    it('lanza AppError 400 si no se entrega consulta', async () => {
      await expect(
        service.obtenerHabitacionesDisponibles(undefined as unknown as ConsultaDisponibilidadDTO),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('lanza AppError 400 si falta el nombre de la sucursal', async () => {
      await expect(
        service.obtenerHabitacionesDisponibles(baseConsulta({ sucursalNombre: '' })),
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('normaliza el nombre de la sucursal (mayúsculas, espacios → _, sin símbolos)', async () => {
      repo.buscarDisponibles.mockResolvedValue([]);

      await service.obtenerHabitacionesDisponibles(
        baseConsulta({ sucursalNombre: '  santiago centro! ' }),
      );

      expect(repo.buscarDisponibles).toHaveBeenCalledWith(
        expect.objectContaining({ sucursalNombre: 'SANTIAGO_CENTRO' }),
      );
    });

    it('mapea el tipo de habitación al enum y agrega la descripción por tipo', async () => {
      repo.buscarDisponibles.mockResolvedValue([
        { id: 7, numero: '201', tipo: 'PLUS', capacidadMaxima: 3, precioPorNoche: 80000 },
      ]);

      const result = await service.obtenerHabitacionesDisponibles(baseConsulta());

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 7,
        tipoHabitacion: TipoHabitacion.Plus,
        capacidadMaxima: 3,
        precioPorNoche: 80000,
      });
      expect(result[0].descripcionBreve).toContain('Plus');
    });

    it('usa Estándar y descripción de respaldo para un tipo desconocido', async () => {
      repo.buscarDisponibles.mockResolvedValue([
        { id: 9, numero: '999', tipo: 'DESCONOCIDO', capacidadMaxima: 1, precioPorNoche: 10000 },
      ]);

      const result = await service.obtenerHabitacionesDisponibles(baseConsulta());

      expect(result[0].tipoHabitacion).toBe(TipoHabitacion.Estandar);
      expect(result[0].descripcionBreve).toContain('999');
    });
  });

  describe('obtenerTodas', () => {
    it('delega en el repositorio y devuelve sus resultados', async () => {
      const rooms = [{ id: '1', number: '101' }];
      repo.buscarTodas.mockResolvedValue(rooms);

      const result = await service.obtenerTodas('TEMUCO');

      expect(repo.buscarTodas).toHaveBeenCalledWith('TEMUCO');
      expect(result).toBe(rooms);
    });
  });
});
