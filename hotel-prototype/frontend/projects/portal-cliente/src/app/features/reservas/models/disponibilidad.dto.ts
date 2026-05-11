export interface ConsultaDisponibilidadDTO {
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  sucursalNombre: string;
}

export interface HabitacionDisponibleDTO {
  id: number;
  tipoHabitacion: string;
  capacidadMaxima: number;
  precioPorNoche: number;
  descripcionBreve?: string;
}
