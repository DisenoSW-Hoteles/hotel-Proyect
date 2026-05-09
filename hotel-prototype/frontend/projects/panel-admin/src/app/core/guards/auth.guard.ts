import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../../shared/constants/app-routes';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree([APP_ROUTES.AUTH_LOGIN], {
        queryParams: { returnUrl: state.url },
      });
    })
  );
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      return router.createUrlTree([APP_ROUTES.AUTH_LOGIN]);
    }

    if (allowedRoles.includes(currentUser.role)) {
      return true;
    }

    return router.createUrlTree([APP_ROUTES.ADMIN_UNAUTHORIZED]);
  };
};
