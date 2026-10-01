import { Routes } from '@angular/router';
import { Login } from './features/shared/auth/login/login';
import { MainLayout } from './features/shared/layout/main-layout/main-layout';
import { authGuard } from './features/shared/services/auth/auth-guard';

export const routes: Routes = [

      {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login', component: Login
    },
    {
    path: 'admin',
    component: MainLayout,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ROUTES),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
