import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsultaDisponibilidadDTO, HabitacionDisponibleDTO, CrearReservaDTO, ReservaDTO, Sucursal } from 'shared-models';
import { IDisponibilidadService } from './disponibilidad.interface';
import { API_BASE_URL } from '../../../config/api.config';

function mapSucursalToApi(sucursal: Sucursal): string {
  const map: Record<Sucursal, string> = {
    [Sucursal.Temuco]: 'Temuco',
    [Sucursal.Pucon]: 'Pucon',
    [Sucursal.Santiago]: 'Santiago',
    [Sucursal.Vina_Del_Mar]: 'Vina_del_mar',
  };
  return map[sucursal];
}

@Injectable()
export class DisponibilidadService implements IDisponibilidadService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiUrl: string
  ) {}

  buscarDisponibilidad(consulta: ConsultaDisponibilidadDTO): Observable<HabitacionDisponibleDTO[]> {
    return this.http.post<HabitacionDisponibleDTO[]>(`${this.apiUrl}/habitaciones/disponibilidad`, consulta);
  }

  crearReserva(reserva: CrearReservaDTO): Observable<ReservaDTO> {
    return this.http.post<ReservaDTO>(`${this.apiUrl}/reservas`, reserva);
  }
}

export { mapSucursalToApi };
