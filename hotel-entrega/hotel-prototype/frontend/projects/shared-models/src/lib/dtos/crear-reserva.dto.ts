import { Sucursal } from '../enums/sucursal.enum';
import { TipoServicio } from '../enums/tipo-servicio.enum';

export interface CrearReservaDTO {
  habitacionId: number;
  sucursalId: Sucursal;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: TipoServicio[];
}
