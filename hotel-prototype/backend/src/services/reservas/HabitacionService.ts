import { HabitacionRepository } from '../../repositories/reservas/HabitacionRepository';
import {
  ConsultaDisponibilidadDTO,
  HabitacionDisponibleDTO,
  TipoHabitacion,
} from '../../models/dtos/Habitacion.dto';
import { AppError } from '../../utils/errors/AppError';

const DESCRIPCIONES_POR_TIPO: Record<string, string> = {
  ESTANDAR: 'Habitación estándar con cama matrimonial, baño privado, TV y WiFi.',
  PLUS: 'Habitación Plus con cama King Size, bañera, frigobar y vista panorámica.',
  SUITE_EJECUTIVA: 'Suite Ejecutiva con sala de estar, cocina equipada, jacuzzi y terraza privada.',
};

export class HabitacionService {
  async obtenerHabitacionesDisponibles(
    consulta: ConsultaDisponibilidadDTO,
  ): Promise<HabitacionDisponibleDTO[]> {
    if (!consulta || !consulta.sucursalNombre) {
      throw new AppError(
        'El nombre de la sucursal es obligatorio para buscar disponibilidad.',
        400,
      );
    }

    consulta.sucursalNombre = consulta.sucursalNombre
      .toUpperCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');

    const habitaciones = await HabitacionRepository.buscarDisponibles(consulta);

    return habitaciones.map((hab) => ({
      id: hab.id,
      tipoHabitacion: this.mapearTipoHabitacion(hab.tipo),
      capacidadMaxima: hab.capacidadMaxima,
      precioPorNoche: hab.precioPorNoche,
      descripcionBreve:
        DESCRIPCIONES_POR_TIPO[hab.tipo] ?? `Habitación ${hab.numero} — disponible.`,
    }));
  }

  async obtenerTodas(branch?: string): Promise<object[]> {
    return HabitacionRepository.buscarTodas(branch);
  }

  private mapearTipoHabitacion(tipoDB: string): TipoHabitacion {
    const mapping: Record<string, TipoHabitacion> = {
      ESTANDAR: TipoHabitacion.Estandar,
      PLUS: TipoHabitacion.Plus,
      SUITE_EJECUTIVA: TipoHabitacion.SuiteEjecutiva,
    };
    return mapping[tipoDB] || TipoHabitacion.Estandar;
  }
}
