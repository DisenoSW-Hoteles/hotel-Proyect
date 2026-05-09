import { Component } from '@angular/core';
import { APP_ROUTES } from '../../shared/constants/app-routes';

@Component({
  selector: 'app-unauthorized',
  standalone: false,
  template: `
    <section class="card card--error">
      <h1>Acceso denegado</h1>
      <p>
        No tienes permiso para ver esta sección. Si crees que es un error,
        contacta con el administrador.
      </p>
      <a [routerLink]="checkInRoute" class="btn btn--primary">
        Volver al panel
      </a>
    </section>
  `,
})
export class UnauthorizedComponent {
  readonly checkInRoute = APP_ROUTES.ADMIN_CHECK_IN;
}
