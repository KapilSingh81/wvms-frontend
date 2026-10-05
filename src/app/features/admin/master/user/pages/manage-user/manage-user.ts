import { Component } from '@angular/core';
import { UserList } from '../../components/user-list/user-list';

@Component({
  selector: 'app-manage-user',
  imports: [UserList],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss',
})
export class ManageUser {}
