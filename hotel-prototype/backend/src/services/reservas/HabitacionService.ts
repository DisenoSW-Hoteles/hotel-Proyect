import { HabitacionRepository } from '../../repositories/reservas/HabitacionRepository';
import {
  ConsultaDisponibilidadDTO,
  HabitacionDisponibleDTO,
  TipoHabitacion
} from '../../models/dtos/Habitacion.dto';
import { AppError } from '../../utils/errors/AppError';
import { IHabitacionService } from '../../interfaces/IHabitacionService';

export class HabitacionService implements IHabitacionService {

async obtenerHabitacionesDisponibles(consulta: ConsultaDisponibilidadDTO): Promise<HabitacionDisponibleDTO[]> {
    // 0. PROGRAMACIÓN DEFENSIVA: Validamos que la sucursal exista antes de normalizar
    if (!consulta || !consulta.sucursalNombre) {
      // Si no viene la sucursal, lanzamos un error 400 (Bad Request)
      // para que el servidor no se caiga.
      throw new AppError('El nombre de la sucursal es obligatorio para buscar disponibilidad.', 400);
    }

    consulta.sucursalNombre = consulta.sucursalNombre
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z0-9_]/g, "")
    // 2. Pedir los ingredientes al Bodeguero
    const habitacionesCrudas = await HabitacionRepository.buscarDisponibles(consulta);

    // 3. LA MAGIA DEL CHEF: Mapeo y transformación
    // Aquí traducimos los valores de la DB (SNAKE_CASE) al formato del Frontend (PascalCase)
    return habitacionesCrudas.map(hab => ({
      id: hab.id,
      tipoHabitacion: this.mapearTipoHabitacion(hab.tipo),
      capacidadMaxima: hab.capacidadMaxima,
      // Nota: En un flujo real, aquí llamaríamos a otro servicio para calcular el precio exacto
      // basado en la tabla 'regla_tarifa', por ahora enviamos un valor base para el MVP.
      precioPorNoche: 0,
      descripcionBreve: `Habitación ${hab.numero} ubicada en el hotel.`
    }));
  }


async obtenerTodas(): Promise<HabitacionDisponibleDTO[]> {
  // 1. Pedir todas las habitaciones al bodeguero
  const habitacionesCrudas = await HabitacionRepository.buscarTodas();

  // 2. Mapear al formato DTO para que el panel de administración lo entienda
  return habitacionesCrudas.map(hab => ({
    id: hab.id,
    tipoHabitacion: this.mapearTipoHabitacion(hab.tipo),
    capacidadMaxima: hab.capacidadMaxima,
    precioPorNoche: 50000,
      descripcionBreve: `Habitación número ${hab.numero} ubicada en el hotel.`
  }));
}

  /**
   * Mapeador privado para resolver el descalce de Enums entre DB y Frontend.
   * Principio de Responsabilidad Única: El servicio se encarga de la consistencia de datos.
   */
  private mapearTipoHabitacion(tipoDB: string): TipoHabitacion {
    const mapping: Record<string, TipoHabitacion> = {
      'ESTANDAR': TipoHabitacion.Estandar,
      'PLUS': TipoHabitacion.Plus,
      'SUITE_EJECUTIVA': TipoHabitacion.SuiteEjecutiva
    };

    return mapping[tipoDB] || TipoHabitacion.Estandar;
  }
}
