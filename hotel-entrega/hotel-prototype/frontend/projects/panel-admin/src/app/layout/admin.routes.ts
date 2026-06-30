import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'front-desk/check-in',
        loadComponent: () =>
          import('../features/check-in/components/check-in.component').then(
            (m) => m.CheckInComponent
          ),
      },
      {
        path: 'front-desk/check-out',
        loadComponent: () =>
          import('../features/check-out/components/check-out.component').then(
            (m) => m.CheckOutComponent
          ),
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('../features/rooms/components/rooms.component').then(
            (m) => m.RoomsComponent
          ),
      },
      { path: '', redirectTo: 'front-desk/check-in', pathMatch: 'full' },
    ],
  },
];
