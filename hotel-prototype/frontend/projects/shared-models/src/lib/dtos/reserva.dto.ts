import { Sucursal } from '../enums/sucursal.enum';
import { TipoHabitacion } from '../enums/tipo-habitacion.enum';
import { TipoServicio } from '../enums/tipo-servicio.enum';

export interface ReservaDTO {
  id: number;
  habitacionId: number;
  tipoHabitacion: TipoHabitacion;
  sucursalId: Sucursal;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: TipoServicio[];
  precioPorNoche: number;
  noches: number;
  totalEstimado: number;
  fechaCreacion: string;
}
