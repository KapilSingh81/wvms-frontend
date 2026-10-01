import { Component } from '@angular/core';
import { DepartmentList } from '../../components/department-list/department-list';

@Component({
  selector: 'app-manage-department',
  imports: [DepartmentList],
  templateUrl: './manage-department.html',
  styleUrl: './manage-department.scss',
})
export class ManageDepartment {}
