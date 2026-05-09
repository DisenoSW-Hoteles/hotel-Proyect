// =============================================================================
// ADMIN LAYOUT COMPONENT
// Principio Arquitectónico — Shell Pattern:
//   Este componente es la "carcasa" de todo el panel administrativo.
//   Su única responsabilidad es estructurar el layout (topbar + contenido)
//   y NO contiene lógica de negocio.
//
// Por qué existe aquí y no en app.ts:
//   El layout solo aplica a rutas bajo /admin. El login (/auth/login)
//   ocupa pantalla completa sin topbar. Un componente dedicado permite
//   tener ambos layouts conviviendo sin condicionales en app.html.
// =============================================================================

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../shared/constants/app-routes';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser$ = this.authService.currentUser$;

  isMobileMenuOpen = false;

  readonly navItems = [
    {
      label: 'Check-in',
      icon: 'login',
      route: APP_ROUTES.ADMIN_CHECK_IN,
      description: 'Registro de entrada',
    },
    {
      label: 'Check-out',
      icon: 'logout',
      route: APP_ROUTES.ADMIN_CHECK_OUT,
      description: 'Cierre de folio',
    },
    {
      label: 'Habitaciones',
      icon: 'hotel',
      route: APP_ROUTES.ADMIN_ROOMS,
      description: 'Tarifas y disponibilidad',
    },
  ] as const;

  onLogout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
