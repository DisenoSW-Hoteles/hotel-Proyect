import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitacionCatalogoDTO } from 'shared-models';
import { IHabitacionesService } from './habitaciones.interface';
import { API_BASE_URL } from '../../../config/api.config';

@Injectable()
export class HabitacionesService implements IHabitacionesService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiUrl: string
  ) {}

  obtenerCatalogo(): Observable<HabitacionCatalogoDTO[]> {
    return this.http.get<HabitacionCatalogoDTO[]>(`${this.apiUrl}/habitaciones/catalogo`);
  }
}
