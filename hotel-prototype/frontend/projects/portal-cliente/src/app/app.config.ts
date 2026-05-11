import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { API_BASE_URL } from './config/api.config';

// 1. Importamos el "Cargo" (El Token) y al "Empleado" (La Clase Concreta)
import { DISPONIBILIDAD_SERVICE } from './features/reservas/services/disponibilidad.interface';
import { DisponibilidadService } from './features/reservas/services/disponibilidad';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_BASE_URL, useValue: 'http://127.0.0.1:3000/api' },

    // 2. Registramos el contrato: Cuando pidan el token, usa esta clase
    { provide: DISPONIBILIDAD_SERVICE, useClass: DisponibilidadService }
  ]
};
