import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD),
    },
    {
        path: 'master',
        loadChildren: () =>
            import('./master/master.routes').then((m) => m.MASTER_ROUTES),
    },
    {
        path: 'report',
        loadChildren: () =>
            import('./report/report.routes').then((m) => m.REPORT_ROUTES),
    }
];
