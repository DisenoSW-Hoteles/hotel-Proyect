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
