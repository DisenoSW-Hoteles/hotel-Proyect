import { HabitacionRepository } from '../../repositories/reservas/HabitacionRepository';
import {
  ConsultaDisponibilidadDTO,
  HabitacionDisponibleDTO,
  TipoHabitacion
} from '../../models/dtos/Habitacion.dto.js';
import { AppError } from '../../utils/errors/AppError.js';

export class HabitacionService {

  async obtenerHabitacionesDisponibles(consulta: ConsultaDisponibilidadDTO): Promise<HabitacionDisponibleDTO[]> {
    // 1. Validación de reglas de negocio básicas (Ej: fechas coherentes)
    const entrada = new Date(consulta.fechaCheckIn);
    const salida = new Date(consulta.fechaCheckOut);

    if (entrada >= salida) {
      throw new AppError('La fecha de salida debe ser posterior a la de entrada.', 400);
    }

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
