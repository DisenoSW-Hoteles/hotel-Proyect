import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultaDisponibilidadDTO, HabitacionDisponibleDTO, CrearReservaDTO, ReservaDTO } from 'shared-models';

export interface IDisponibilidadService {
  buscarDisponibilidad(consulta: ConsultaDisponibilidadDTO): Observable<HabitacionDisponibleDTO[]>;
  crearReserva(reserva: CrearReservaDTO): Observable<ReservaDTO>;
}

export const DISPONIBILIDAD_SERVICE = new InjectionToken<IDisponibilidadService>('DISPONIBILIDAD_SERVICE');
