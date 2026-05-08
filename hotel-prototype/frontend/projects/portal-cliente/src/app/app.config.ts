import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './config/api.config';
import { errorInterceptor } from './core/error.interceptor';
import { DISPONIBILIDAD_SERVICE } from './features/reservas/services/disponibilidad.interface';
import { DisponibilidadMockService } from './features/reservas/services/disponibilidad-mock.service';
import { DisponibilidadService } from './features/reservas/services/disponibilidad';
import { HABITACIONES_SERVICE } from './features/reservas/services/habitaciones.interface';
import { HabitacionesMockService } from './features/reservas/services/habitaciones-mock.service';
import { HabitacionesService } from './features/reservas/services/habitaciones.service';

export function disponibilidadServiceFactory(): typeof DisponibilidadService | typeof DisponibilidadMockService {
  return environment.useMock ? DisponibilidadMockService : DisponibilidadService;
}

export function habitacionesServiceFactory(): typeof HabitacionesService | typeof HabitacionesMockService {
  return environment.useMock ? HabitacionesMockService : HabitacionesService;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideRouter(routes),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: DISPONIBILIDAD_SERVICE, useFactory: disponibilidadServiceFactory },
    { provide: HABITACIONES_SERVICE, useFactory: habitacionesServiceFactory },
  ],
};
