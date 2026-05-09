import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'front-desk/check-in',
        loadComponent: () =>
          import('./pages/check-in/check-in.component').then((m) => m.CheckInComponent),
      },
      {
        path: 'front-desk/check-out',
        loadComponent: () =>
          import('./pages/check-out/check-out.component').then((m) => m.CheckOutComponent),
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('./pages/rooms/rooms.component').then((m) => m.RoomsComponent),
      },
      { path: '', redirectTo: 'front-desk/check-in', pathMatch: 'full' },
    ],
  },
];
