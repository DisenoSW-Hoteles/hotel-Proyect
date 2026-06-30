export enum TipoHabitacion {
  Estandar = 'Estandar',
  Plus = 'Plus',
  SuiteEjecutiva = 'SuiteEjecutiva',
}

export interface ConsultaDisponibilidadDTO {
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  sucursalNombre: string;
}

export interface HabitacionDisponibleDTO {
  id: number;
  tipoHabitacion: TipoHabitacion;
  capacidadMaxima: number;
  precioPorNoche: number;
  descripcionBreve?: string;
}

/**
 * Fila "cruda" de habitación tal como la entrega la capa de persistencia,
 * antes de mapearse al DTO de salida. Es el contrato del puerto de datos.
 */
export interface HabitacionCrudaDTO {
  id: number;
  numero: string;
  tipo: string;
  capacidadMaxima: number;
  piso: number;
  estado: string;
  sucursalNombre: string;
  /** Tarifa base por noche (regla_tarifa vigente). 0 si no hay tarifa. */
  precioBase: number;
}

/**
 * DTO administrativo de habitación (contrato con el panel-admin, snake_case).
 * Incluye número, piso, estado, tarifa base y sucursal.
 */
export interface AdminRoomDTO {
  id: string;
  number: string;
  floor: number;
  type: string;
  capacity: number;
  base_rate: number;
  status: string;
  amenities: string[];
  branch: string;
}
