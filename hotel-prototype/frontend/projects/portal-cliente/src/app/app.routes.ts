import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/reservas/buscar', pathMatch: 'full' },
  {
    path: 'reservas',
    loadChildren: () => import('./features/reservas/reservas.routes'),
  },
];
