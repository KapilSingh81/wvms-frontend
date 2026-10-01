import { Routes } from '@angular/router';
import { ManageDepartment } from './department/pages/manage-department/manage-department';
import { ManageDesignation } from './designation/pages/manage-designation/manage-designation';
import { ManageEmployeeVisitor } from './employee-visitor/pages/manage-employee-visitor/manage-employee-visitor';

export const MASTER_ROUTES: Routes = [
    {
        path: 'department', component: ManageDepartment
    },
     {
        path: 'designation', component: ManageDesignation
    },
     {
        path: 'employee-visitor', component: ManageEmployeeVisitor
    }
];
