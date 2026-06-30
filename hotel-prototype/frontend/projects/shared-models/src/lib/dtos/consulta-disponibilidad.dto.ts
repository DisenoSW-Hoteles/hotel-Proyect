import { Sucursal } from '../enums/sucursal.enum';

export interface ConsultaDisponibilidadDTO {
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  // El nombre/clave de la sucursal (ej. 'Vina_Del_Mar'); el backend lo normaliza
  // al enum de la BD. Coincide con el contrato del backend y el formulario.
  sucursalNombre: Sucursal;
}
