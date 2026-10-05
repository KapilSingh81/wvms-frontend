import { Component } from '@angular/core';
import { VisitorList } from '../../components/visitor-list/visitor-list';

@Component({
  selector: 'app-manage-visitor',
  imports: [VisitorList],
  templateUrl: './manage-visitor.html',
  styleUrl: './manage-visitor.scss',
})
export class ManageVisitor {}
