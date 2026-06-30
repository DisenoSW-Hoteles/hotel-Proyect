import { IHabitacionRepository } from '../../domain/ports/IHabitacionRepository';
import { AppError } from '../../domain/errors/AppError';
import { CrearReservaDTO, ReservaPublicaDTO } from '../../domain/dtos/ReservaPublica.dto';

/** Costo (CLP) de los servicios adicionales ofrecidos en el portal. */
const COSTO_SERVICIO: Record<string, number> = {
  DesayunoHabitacion: 8000,
  DesayunoCafeteria: 5000,
  EventoPrivado: 50000,
};

/** Tipo de habitación BD -> etiqueta del portal (enum TipoHabitacion de shared-models). */
const TIPO_PUBLICO: Record<string, string> = {
  ESTANDAR: 'Estandar',
  PLUS: 'Plus',
  SUITE_EJECUTIVA: 'SuiteEjecutiva',
};

const MS_POR_DIA = 1000 * 60 * 60 * 24;

/**
 * CASO DE USO de creación de reserva desde el portal público.
 * Calcula el total estimado (noches × tarifa real + servicios) y valida las
 * reglas de negocio básicas. Depende del puerto `IHabitacionRepository`.
 */
export class CrearReservaService {
  constructor(private readonly habitacionRepository: IHabitacionRepository) {}

  async crear(dto: CrearReservaDTO): Promise<ReservaPublicaDTO> {
    if (!dto.fechaCheckIn || !dto.fechaCheckOut || dto.fechaCheckOut <= dto.fechaCheckIn) {
      throw new AppError('El check-out debe ser posterior al check-in.', 400);
    }

    const habitacion = await this.habitacionRepository.buscarPorId(dto.habitacionId);
    if (!habitacion) {
      throw new AppError('Habitación no encontrada.', 404);
    }
    if (dto.cantidadHuespedes > habitacion.capacidadMaxima) {
      throw new AppError(
        `La habitación admite hasta ${habitacion.capacidadMaxima} huésped(es).`,
        400
      );
    }

    const noches = Math.max(
      1,
      Math.round(
        (new Date(dto.fechaCheckOut).getTime() - new Date(dto.fechaCheckIn).getTime()) / MS_POR_DIA
      )
    );
    const totalServicios = (dto.servicios ?? []).reduce(
      (suma, s) => suma + (COSTO_SERVICIO[s] ?? 0),
      0
    );
    const totalEstimado = noches * habitacion.precioBase + totalServicios;

    return {
      id: Date.now(),
      habitacionId: dto.habitacionId,
      tipoHabitacion: TIPO_PUBLICO[habitacion.tipo] ?? 'Estandar',
      sucursalId: dto.sucursalId,
      fechaCheckIn: dto.fechaCheckIn,
      fechaCheckOut: dto.fechaCheckOut,
      cantidadHuespedes: dto.cantidadHuespedes,
      huespedNombre: dto.huespedNombre,
      huespedEmail: dto.huespedEmail,
      huespedTelefono: dto.huespedTelefono,
      servicios: dto.servicios ?? [],
      precioPorNoche: habitacion.precioBase,
      noches,
      totalEstimado,
      fechaCreacion: new Date().toISOString(),
    };
  }
}
