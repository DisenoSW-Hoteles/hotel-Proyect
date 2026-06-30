import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { API_BASE_URL } from './config/api.config';
import { environment } from '../environments/environment';

// 1. Importamos el "Cargo" (El Token) y al "Empleado" (La Clase Concreta)
import { DISPONIBILIDAD_SERVICE } from './features/reservas/services/disponibilidad.interface';
import { DisponibilidadService } from './features/reservas/services/disponibilidad';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // La URL del backend proviene del environment (http://localhost:4000/api).
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },

    // 2. Registramos el contrato: Cuando pidan el token, usa esta clase
    { provide: DISPONIBILIDAD_SERVICE, useClass: DisponibilidadService }
  ]
};
