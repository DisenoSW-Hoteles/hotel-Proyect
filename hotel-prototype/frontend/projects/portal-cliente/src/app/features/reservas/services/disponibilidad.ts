import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsultaDisponibilidadDTO, HabitacionDisponibleDTO, CrearReservaDTO, ReservaDTO } from 'shared-models';
import { IDisponibilidadService } from './disponibilidad.interface';
import { API_BASE_URL } from '../../../config/api.config';

/** El backend responde con un envoltorio { status, results, data }. */
interface RespuestaDisponibilidad {
  status: string;
  results: number;
  data: HabitacionDisponibleDTO[];
}

@Injectable()
export class DisponibilidadService implements IDisponibilidadService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiUrl: string
  ) {}

  buscarDisponibilidad(consulta: ConsultaDisponibilidadDTO): Observable<HabitacionDisponibleDTO[]> {
    return this.http
      .post<RespuestaDisponibilidad>(`${this.apiUrl}/habitaciones/disponibilidad`, consulta)
      .pipe(map((res) => res.data ?? []));
  }

  crearReserva(reserva: CrearReservaDTO): Observable<ReservaDTO> {
    return this.http.post<ReservaDTO>(`${this.apiUrl}/reservas`, reserva);
  }
}
