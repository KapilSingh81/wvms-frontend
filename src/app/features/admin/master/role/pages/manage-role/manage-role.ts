import { Component } from '@angular/core';
import { RoleList } from '../../components/role-list/role-list';

@Component({
  selector: 'app-manage-role',
  imports: [RoleList],
  templateUrl: './manage-role.html',
  styleUrl: './manage-role.scss',
})
export class ManageRole {}
