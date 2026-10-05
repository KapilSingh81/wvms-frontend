import { Routes } from '@angular/router';
import { ManageDepartment } from './department/pages/manage-department/manage-department';
import { ManageDesignation } from './designation/pages/manage-designation/manage-designation';
import { ManageEmployeeVisitor } from './employee-visitor/pages/manage-employee-visitor/manage-employee-visitor';
import { ManageUser } from './user/pages/manage-user/manage-user';
import { ManageVisitor } from './visitor/pages/manage-visitor/manage-visitor';
import { ManageRole } from './role/pages/manage-role/manage-role';

export const MASTER_ROUTES: Routes = [
    {
        path: 'department',
        component: ManageDepartment,
    },
    {
        path: 'designation',
        component: ManageDesignation,
    },
    {
        path: 'employee-visitor',
        component: ManageEmployeeVisitor,
    },
    {
        path: 'user',
        component: ManageUser,
    },
    {
        path: 'visitor',
        component: ManageVisitor,
    },
    {
        path: 'role',
        component: ManageRole,
    },
];
