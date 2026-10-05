import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { DepartmentService } from '../../services/department-service';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';

@Component({
  selector: 'app-create-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-department.html',
  styleUrl: './create-department.scss',
})
export class CreateDepartment implements OnInit {
  @Output() mapdata = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalService);
  private departmentService = inject(DepartmentService);
  private notification = inject(NotificationService);

  departmentForm!: FormGroup;
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
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required]],
      status: [true, [Validators.required]],
    });

    if (this.editData) {
      this.tittle = 'Update';
      this.departmentForm.patchValue({
        name: this.editData?.name,
        status: this.editData?.status,
      });
    }
  }

  submit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    const formValue = this.departmentForm.value;
    const payload: any = {
      name: formValue?.name,
      status: formValue?.status,
    };

    let service;
    if (this.editData?.id) {
      payload.id = this.editData.id;
      service = this.departmentService.updateDepartment(payload);
    } else {
      service = this.departmentService.createDepartment(payload);
    }

    this.isSubmitting = true;

    service.subscribe((res: any) => {
      console.log('Save Response:', res);
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