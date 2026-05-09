// =============================================================================
// ADMIN ROUTING MODULE
// Patrón: "Shell / Layout Route"
//
// AdminLayoutComponent actúa como parent component con su propio <router-outlet>.
// Todos los children se renderizan dentro del shell (topbar + contenido).
//
// Ventaja: el AuthGuard en app.routes.ts protege el segmento /admin completo.
// Cualquier ruta nueva bajo /admin automáticamente hereda la protección Y el layout.
// =============================================================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { RoomsComponent } from './rooms.component';
import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
  {
    // AdminLayoutComponent envuelve todo el módulo admin con topbar + <router-outlet>
    path: '',
    component: AdminLayoutComponent,
    children: [
      // Ruta raíz → redirige al check-in (punto de entrada natural del recepcionista)
      { path: '', redirectTo: 'front-desk/check-in', pathMatch: 'full' },

      // Gestión de habitaciones y tarifas
      { path: 'rooms', component: RoomsComponent },

      // Front-desk: check-in y check-out (lazy-loaded por separado para código splitting)
      {
        path: 'front-desk',
        loadChildren: () =>
          import('../operations/operations.module').then((m) => m.OperationsModule),
      },

      // Pantalla de acceso denegado (para usuarios sin el rol correcto)
      { path: 'unauthorized', component: UnauthorizedComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
