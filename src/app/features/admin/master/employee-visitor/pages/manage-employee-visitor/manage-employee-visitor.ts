import { Component } from '@angular/core';
import { EmployeeVisitorList } from '../../components/employee-visitor-list/employee-visitor-list';

@Component({
  selector: 'app-manage-employee-visitor',
  imports: [EmployeeVisitorList],
  templateUrl: './manage-employee-visitor.html',
  styleUrl: './manage-employee-visitor.scss',
})
export class ManageEmployeeVisitor {}
