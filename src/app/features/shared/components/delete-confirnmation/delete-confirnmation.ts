import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-confirnmation',
  imports: [],
  templateUrl: './delete-confirnmation.html',
  styleUrl: './delete-confirnmation.scss',
})
export class DeleteConfirnmation {
    title: any;
  content: any;
  primaryActionLabel: any;
  secondaryActionLabel: any;
  service: any;

  @Output() mapdata = new EventEmitter<string>();

  constructor(private bsmodalservice: BsModalService) {}

  ok() {
    this.service.subscribe((res: any) => {
      this.mapdata.emit(res);
    });
    this.bsmodalservice.hide();
  }

  cancel() {
    this.bsmodalservice.hide();
  }
}
