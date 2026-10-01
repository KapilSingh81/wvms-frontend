import { Routes } from '@angular/router';
import { ManageEmployeeReport } from './employee-report/pages/manage-employee-report/manage-employee-report';

export const REPORT_ROUTES: Routes = [
    {
        path: 'employee-report', component: ManageEmployeeReport
    },
];
