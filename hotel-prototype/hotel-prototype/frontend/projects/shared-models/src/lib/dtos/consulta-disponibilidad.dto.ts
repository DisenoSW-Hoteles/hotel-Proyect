import { Sucursal } from '../enums/sucursal.enum';

export interface ConsultaDisponibilidadDTO {
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  sucursalId: Sucursal;
}
