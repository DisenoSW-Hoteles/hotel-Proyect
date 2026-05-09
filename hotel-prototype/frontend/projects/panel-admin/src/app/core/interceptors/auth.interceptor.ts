// =============================================================================
// JWT AUTH INTERCEPTOR
// Responsabilidades:
//   1. Adjuntar el Bearer token SOLO a peticiones dirigidas al backend propio
//      (verifica que la URL comience con environment.apiBaseUrl).
//   2. Detectar respuestas 401 y forzar el logout automático del usuario,
//      ya que un 401 significa que el token expiró o fue revocado.
//
// SEGURIDAD: No enviar el token a terceros (CDN, APIs externas) si alguna
// llamada HTTP llegara a apuntar a otro dominio en el futuro.
// =============================================================================

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // ── GUARDIA DE DOMINIO ────────────────────────────────────────────────────
    // Solo adjuntar el token si la petición va a nuestro propio backend.
    // Esto evita filtrar el JWT a CDNs, servicios de Google Fonts, etc.
    const isOwnApi = req.url.startsWith(environment.apiBaseUrl);

    if (!isOwnApi) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    const authRequest = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    // ── AUTO-LOGOUT EN 401 ────────────────────────────────────────────────────
    // Un 401 indica que el token expiró o fue invalidado en el servidor.
    // Forzar logout limpia el estado en memoria y redirige al login.
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
