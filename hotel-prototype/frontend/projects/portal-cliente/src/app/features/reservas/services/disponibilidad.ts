import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {
  // Esta URL apuntará al backend de Jaime cuando esté listo
  private apiUrl = 'http://localhost:3000/api/reservas';

  // DIP: Inyectamos el cliente HTTP nativo de Angular en el constructor
  constructor(private http: HttpClient) { }

  // SRP: La única responsabilidad de este método es ir a buscar datos
  // Usamos Observable de RxJS porque las peticiones a internet toman tiempo (asincronía)
  buscarHabitaciones(checkIn: string, checkOut: string, huespedes: number): Observable<any> {
    const payload = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount: huespedes
    };
    
    // Hacemos la petición POST al backend
    return this.http.post<any>(`${this.apiUrl}/disponibilidad`, payload);
  }
}