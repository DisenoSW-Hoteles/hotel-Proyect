import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HabitacionCatalogoDTO } from 'shared-models';

export interface IHabitacionesService {
  obtenerCatalogo(): Observable<HabitacionCatalogoDTO[]>;
}

export const HABITACIONES_SERVICE = new InjectionToken<IHabitacionesService>('HABITACIONES_SERVICE');
