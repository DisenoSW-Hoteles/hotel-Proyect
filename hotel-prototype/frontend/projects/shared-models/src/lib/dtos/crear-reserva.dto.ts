import { TipoServicio } from '../enums/tipo-servicio.enum';

export interface CrearReservaDTO {
  habitacionId: number;
  sucursalNombre: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: TipoServicio[];
  tipoDocumento?: 'RUT' | 'PASAPORTE';
  documentoNum?: string;
}
