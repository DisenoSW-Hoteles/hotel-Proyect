import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Importamos nuestros contratos de datos estrictos
import { ConsultaDisponibilidadDTO, HabitacionDisponibleDTO } from '../models/disponibilidad.dto';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {
  // Esta URL apuntará a la API REST de Jaime
  private apiUrl = 'http://localhost:3000/api/reservas';

  // DIP: Inyección de Dependencias del cliente HTTP
  constructor(private http: HttpClient) { }

  /**
   * Busca las habitaciones disponibles en base a las fechas y huéspedes.
   * Recibe nuestro DTO de consulta y retorna un Observable con un arreglo del DTO de respuesta.
   */
  buscarDisponibilidad(consulta: ConsultaDisponibilidadDTO): Observable<HabitacionDisponibleDTO[]> {
    const url = `${this.apiUrl}/disponibilidad`;
    
    // Hacemos un POST enviando los datos del huésped y tipamos la respuesta
    return this.http.post<HabitacionDisponibleDTO[]>(url, consulta);
  }
}