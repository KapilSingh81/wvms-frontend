import { Component } from '@angular/core';
import { DesignationList } from '../../components/designation-list/designation-list';

@Component({
  selector: 'app-manage-designation',
  imports: [DesignationList],
  templateUrl: './manage-designation.html',
  styleUrl: './manage-designation.scss',
})
export class ManageDesignation {}
