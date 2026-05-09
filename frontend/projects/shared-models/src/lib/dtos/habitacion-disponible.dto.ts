import { TipoHabitacion } from '../enums/tipo-habitacion.enum';

export interface HabitacionDisponibleDTO {
  id: number;
  tipoHabitacion: TipoHabitacion;
  capacidadMaxima: number;
  precioPorNoche: number;
  descripcionBreve?: string;
}
