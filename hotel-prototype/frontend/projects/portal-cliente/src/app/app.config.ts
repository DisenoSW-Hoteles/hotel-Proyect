import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './config/api.config';
import { DISPONIBILIDAD_SERVICE } from './features/reservas/services/disponibilidad.interface';
import { DisponibilidadService } from './features/reservas/services/disponibilidad';
import { DisponibilidadMockService } from './features/reservas/services/disponibilidad-mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    {
      provide: DISPONIBILIDAD_SERVICE,
      useClass: environment.useMock ? DisponibilidadMockService : DisponibilidadService,
    },
  ],
};
