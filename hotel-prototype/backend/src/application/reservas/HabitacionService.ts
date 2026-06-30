import { IHabitacionRepository } from '../../domain/ports/IHabitacionRepository';
import {
  AdminRoomDTO,
  ConsultaDisponibilidadDTO,
  HabitacionDisponibleDTO,
  TipoHabitacion,
} from '../../domain/dtos/Habitacion.dto';
import { AppError } from '../../domain/errors/AppError';

/** Sucursales válidas del negocio (coinciden con el enum `sucursal_enum` de la BD). */
const SUCURSALES_VALIDAS = new Set(['TEMUCO', 'PUCON', 'SANTIAGO', 'VINA_DEL_MAR']);

/** Mapeo de tipo de habitación BD -> etiqueta del panel-admin. */
const TIPO_ADMIN: Record<string, string> = {
  ESTANDAR: 'STANDARD',
  PLUS: 'SUPERIOR',
  SUITE_EJECUTIVA: 'SUITE',
};

/** Mapeo de estado de habitación BD -> estado del panel-admin. */
const ESTADO_ADMIN: Record<string, string> = {
  DISPONIBLE: 'AVAILABLE',
  OCUPADA: 'OCCUPIED',
  SUCIA: 'CLEANING',
  EN_REPARACION: 'MAINTENANCE',
  BLOQUEADA: 'MAINTENANCE',
};

/**
 * CASO DE USO de habitaciones (capa de aplicación).
 *
 * Depende del PUERTO `IHabitacionRepository`, no de TypeORM. La implementación
 * concreta se inyecta por constructor (Inversión de Dependencias), por lo que el
 * servicio es testeable sin base de datos.
 */
export class HabitacionService {
  constructor(private readonly habitacionRepository: IHabitacionRepository) {}

  async obtenerHabitacionesDisponibles(
    consulta: ConsultaDisponibilidadDTO
  ): Promise<HabitacionDisponibleDTO[]> {
    // Programación defensiva: la sucursal es obligatoria.
    if (!consulta?.sucursalNombre) {
      throw new AppError(
        'El nombre de la sucursal es obligatorio para buscar disponibilidad.',
        400
      );
    }

    // Normalización canónica de la sucursal para que coincida con el enum de la BD
    // (TEMUCO, PUCON, SANTIAGO, VINA_DEL_MAR). Se transliteran tildes y la Ñ:
    // "Viña del Mar" -> se eliminan diacríticos -> "VINA_DEL_MAR".
    consulta.sucursalNombre = consulta.sucursalNombre
      .normalize('NFD') // descompone "ñ"->"n"+tilde, "á"->"a"+tilde
      .replace(/[̀-ͯ]/g, '') // elimina los signos diacríticos combinantes
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_') // espacios -> guion bajo
      .replace(/[^A-Z0-9_]/g, ''); // descarta cualquier otro carácter especial

    // Validamos contra las sucursales conocidas para devolver un 400 limpio
    // en lugar de dejar que un valor inválido provoque un error 500 en la BD.
    if (!SUCURSALES_VALIDAS.has(consulta.sucursalNombre)) {
      throw new AppError(`Sucursal no reconocida: "${consulta.sucursalNombre}".`, 400);
    }

    const habitacionesCrudas = await this.habitacionRepository.buscarDisponibles(consulta);

    return habitacionesCrudas.map((hab) => ({
      id: hab.id,
      tipoHabitacion: this.mapearTipoHabitacion(hab.tipo),
      capacidadMaxima: hab.capacidadMaxima,
      precioPorNoche: hab.precioBase,
      descripcionBreve: `Habitación ${hab.numero} · piso ${hab.piso} · ${hab.sucursalNombre}`,
    }));
  }

  /** Catálogo administrativo: shape RoomResponseDto que consume el panel-admin. */
  async obtenerTodas(): Promise<AdminRoomDTO[]> {
    const habitacionesCrudas = await this.habitacionRepository.buscarTodas();

    return habitacionesCrudas.map((hab) => ({
      id: String(hab.id),
      number: hab.numero,
      floor: hab.piso,
      type: TIPO_ADMIN[hab.tipo] ?? 'STANDARD',
      capacity: hab.capacidadMaxima,
      base_rate: hab.precioBase,
      status: ESTADO_ADMIN[hab.estado] ?? 'AVAILABLE',
      amenities: [],
      branch: hab.sucursalNombre,
    }));
  }

  /**
   * Resuelve el descalce de Enums entre BD (SNAKE_CASE) y frontend (PascalCase).
   */
  private mapearTipoHabitacion(tipoDB: string): TipoHabitacion {
    const mapping: Record<string, TipoHabitacion> = {
      ESTANDAR: TipoHabitacion.Estandar,
      PLUS: TipoHabitacion.Plus,
      SUITE_EJECUTIVA: TipoHabitacion.SuiteEjecutiva,
    };

    return mapping[tipoDB] || TipoHabitacion.Estandar;
  }
}
