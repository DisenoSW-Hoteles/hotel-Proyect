import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Ocurrió un error inesperado.';

      if (error.status === 0) {
        mensaje = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (error.status >= 500) {
        mensaje = 'Error del servidor. Intenta nuevamente más tarde.';
      } else if (error.status === 404) {
        mensaje = 'El recurso solicitado no existe.';
      } else if (error.status === 400) {
        mensaje = error.error?.mensaje || 'Solicitud inválida. Revisa los datos.';
      }

      return throwError(() => new Error(mensaje));
    })
  );
};
