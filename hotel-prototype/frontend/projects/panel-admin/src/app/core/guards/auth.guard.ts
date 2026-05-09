// =============================================================================
// AUTH GUARD — Functional Guard (Angular 15+)
// Decisión Arquitectónica: Se usa el patrón de "Functional Guard" (función pura
// en lugar de clase con `implements CanActivate`) introducido en Angular 15.
// Esto reduce el boilerplate y alinea con la dirección futura del framework.
//
// Responsabilidad ÚNICA: Verificar si el usuario está autenticado y redirigir
// si no lo está. NO contiene lógica de negocio — solo delega en AuthService.
//
// El guard protege TODAS las rutas bajo /admin. Para autorización por roles,
// se crearía un RoleGuard separado (SRP: un guard = una responsabilidad).
// =============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../data/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    // `take(1)`: completar el Observable después del primer valor para evitar
    // suscripciones "zombie" que queden activas después de la navegación.
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      // Si no está autenticado, redirigir al login preservando la URL de destino
      // para poder redirigir al usuario de vuelta después del login exitoso.
      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
    })
  );
};

// =============================================================================
// ROLE GUARD — Guard adicional para autorización por rol
// SRP: Separado del AuthGuard porque tiene una responsabilidad distinta.
// Uso en rutas: canActivate: [authGuard, roleGuard(['SUPER_ADMIN', 'GERENTE'])]
// =============================================================================

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      return router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.includes(currentUser.role)) {
      return true;
    }

    // El usuario está autenticado pero no tiene el rol requerido
    return router.createUrlTree(['/admin/unauthorized']);
  };
};
