import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { RoleService } from '../../services/role-service';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-role.html',
  styleUrl: './create-role.scss',
})
export class CreateRole implements OnInit {
  @Output() mapdata = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalService);
  private roleService = inject(RoleService);
  private notification = inject(NotificationService);

  roleForm!: FormGroup;
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
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
      status: [true, [Validators.required]],
    });

    if (this.editData) {
      this.tittle = 'Update';
      this.roleForm.patchValue({
        name: this.editData?.name,
        status: this.editData?.status,
      });
    }
  }

  submit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const formValue = this.roleForm.value;
    const payload: any = {
      name: formValue?.name,
      status: formValue?.status,
    };

    let service;

    if (this.editData?.id) {
      payload.id = this.editData.id;
      service = this.roleService.updateRole(payload);
    } else {
      service = this.roleService.createRole(payload);
    }

    this.isSubmitting = true;
    service.subscribe((res: any) => {
      this.isSubmitting = false;
      const body = res?.body ?? res;
      if (body?.success === true || body?.code === 200 || body?.code === 201) {
        this.bsModalService.hide();
        this.mapdata.emit(body);
        this.notification.success(body?.message || body?.actionResponse || 'Saved successfully');
      } else {
        this.notification.error(body?.message || body?.actionResponse || 'Save failed');
      }
    });
  }

  cancel(): void {
    this.bsModalService.hide();
  }
}
