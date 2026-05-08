import { TipoHabitacion } from '../enums/tipo-habitacion.enum';

export interface HabitacionCatalogoDTO {
  id: number;
  tipo: TipoHabitacion;
  titulo: string;
  descripcion: string;
  capacidadMaxima: number;
  precioBasePorNoche: number;
  amenities: string[];
  imagenUrl?: string;
  destacado: boolean;
}
