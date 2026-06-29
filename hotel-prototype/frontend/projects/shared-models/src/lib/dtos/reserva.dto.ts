import { TipoHabitacion } from '../enums/tipo-habitacion.enum';
import { TipoServicio } from '../enums/tipo-servicio.enum';

export interface ReservaDTO {
  id: number;
  habitacionId: number;
  tipoHabitacion: TipoHabitacion;
  sucursalNombre: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: TipoServicio[];
  totalEstimado: number;
  fechaCreacion: string;
}
