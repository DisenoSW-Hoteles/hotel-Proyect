import { ConsultaDisponibilidadDTO, HabitacionCrudaDTO } from '../dtos/Habitacion.dto';

/**
 * PUERTO de salida para el acceso a datos de habitaciones.
 * Permite que el caso de uso (HabitacionService) no conozca TypeORM ni SQL:
 * solo depende de este contrato. La implementación concreta
 * (TypeOrmHabitacionRepository) vive en infraestructura.
 */
export interface IHabitacionRepository {
  buscarDisponibles(consulta: ConsultaDisponibilidadDTO): Promise<HabitacionCrudaDTO[]>;
  buscarTodas(): Promise<HabitacionCrudaDTO[]>;
  buscarPorId(id: number): Promise<HabitacionCrudaDTO | null>;
}
