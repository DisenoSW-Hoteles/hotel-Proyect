import {
    ConsultaDisponibilidadDTO,
    HabitacionDisponibleDTO,
} from "../models/dtos/Habitacion.dto"

export interface IHabitacionService {
    obtenerHabitacionesDisponibles(
        consulta: ConsultaDisponibilidadDTO,
    ): Promise<HabitacionDisponibleDTO[]>
    obtenerTodas(): Promise<HabitacionDisponibleDTO[]>
}
