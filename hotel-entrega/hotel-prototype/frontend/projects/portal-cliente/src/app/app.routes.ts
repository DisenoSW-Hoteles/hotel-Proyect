import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirigimos la raíz vacía directamente a las reservas
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  // Cargamos el mapa de rutas que me mostraste
  {
    path: 'reservas',
    loadChildren: () => import('./features/reservas/reservas.routes')
  }
];
