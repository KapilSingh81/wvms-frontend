import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';
import { DesignationService } from '../../services/designation-service';

@Component({
  selector: 'app-create-designation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-designation.html',
  styleUrl: './create-designation.scss',
})
export class CreateDesignation implements OnInit {
  @Output() mapdata = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalService);
  private designationService = inject(DesignationService);
  private notification = inject(NotificationService);

  designationForm!: FormGroup;
  tittle: string = 'Create';
  editData: any;
  isSubmitting = false;

  StatusDropdown = [
    { value: true, text: 'Active' },
    { value: false, text: 'InActive' },
  ];

  ngOnInit(): void {
    this.setInitialForm();
  }

  setInitialForm(): void {
    this.designationForm = this.fb.group({
      name: ['', [Validators.required]],
      status: [true, [Validators.required]],
    });

    if (this.editData) {
      this.tittle = 'Update';
      this.designationForm.patchValue({
        name: this.editData?.name,
        status: this.editData?.status,
      });
    }
  }

  submit(): void {
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }
    const formValue = this.designationForm.value;
    const payload: any = {
      name: formValue?.name,
      status: formValue?.status,
    };

    let service;
    if (this.editData?.id) {
      payload.id = this.editData.id;
      service = this.designationService.updateDesignation(payload);
    } else {
      service = this.designationService.createDesignation(payload);
    }
    this.isSubmitting = true;
    service.subscribe((res: any) => {
      this.isSubmitting = false;
      const body = res?.body ?? res;
      if (body?.success === true || body?.code === 200) {
        this.bsModalService.hide();
        this.mapdata.emit(body);
        this.notification.success(
          body?.message || body?.actionResponse || 'Saved successfully'
        );
      } else {
        this.notification.error(
          body?.message || body?.actionResponse || 'Save failed'
        );
      }
    });
  }

  cancel(): void {
    this.bsModalService.hide();
  }
}