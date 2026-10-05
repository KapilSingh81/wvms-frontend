import {
  Component,
  EventEmitter,
  Output,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';
import { DepartmentService } from '../../../department/services/department-service';
import { DesignationService } from '../../../designation/services/designation-service';
import { EmployeeVisitorService } from '../../services/employee-visitor-service';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@Component({
  selector: 'app-create-employee-visitor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectDropDownModule, FormsModule],
  templateUrl: './create-employee-visitor.html',
  styleUrl: './create-employee-visitor.scss',
})
export class CreateEmployeeVisitor implements OnInit {
  @Output() mapdata = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalService);
  private service = inject(EmployeeVisitorService);
  private departmentService = inject(DepartmentService);
  private designationService = inject(DesignationService);
  private notification = inject(NotificationService);

  empVisitorForm!: FormGroup;
  tittle: string = 'Create';
  editData: any;
  isSubmitting = false;

  departmentList: any[] = [];
  designationList: any[] = [];
  selectedDepartment: any = null;
  selectedDesignation: any = null;

  departmentConfig = {
    displayKey: 'name',
    search: true,
    height: '250px',
    placeholder: 'Select Department',
  };

  designationConfig = {
    displayKey: 'name',
    search: true,
    height: '250px',
    placeholder: 'Select Designation',
  };

  imagePreview: string | null = null;
  imageFile: File | null = null;

  GenderDropdown = [
    { value: 'Male', text: 'Male' },
    { value: 'Female', text: 'Female' },
    { value: 'Other', text: 'Other' },
  ];

  StatusDropdown = [
    { value: true, text: 'Active' },
    { value: false, text: 'InActive' },
  ];

  ngOnInit(): void {
    this.setInitialForm();
    this.loadDropdowns();
  }

  setInitialForm(): void {
    this.empVisitorForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      joining_date: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      department_id: [null, [Validators.required]],
      designation_id: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      status: [true, [Validators.required]],
      about: [''],
    });

    if (this.editData) {
      this.tittle = 'Update';
      this.empVisitorForm.patchValue({
        first_name: this.editData?.first_name,
        last_name: this.editData?.last_name,
        email: this.editData?.email,
        phone: this.editData?.phone,
        joining_date: this.editData?.joining_date,
        gender: this.editData?.gender,
        department_id: this.editData?.department_id,
        designation_id: this.editData?.designation_id,
        status: this.editData?.status,
        about: this.editData?.about,
      });

      if (this.editData?.image) {
        this.imagePreview = this.editData.image;
      }

      this.empVisitorForm.get('password')?.clearValidators();
      this.empVisitorForm.get('confirm_password')?.clearValidators();
      this.empVisitorForm.get('password')?.updateValueAndValidity();
      this.empVisitorForm.get('confirm_password')?.updateValueAndValidity();
    }
  }

  loadDropdowns(): void {
    this.departmentService.departmentList().subscribe((res: any) => {
      const body = res?.body ?? res;
      if (body?.success === true) {
        this.departmentList = body?.data ?? [];
        if (this.editData?.department_id) {
          this.selectedDepartment = this.departmentList.find(
            (d: any) => d.id === this.editData.department_id
          );
        }
      }
    });

    this.designationService.designationList().subscribe((res: any) => {
      const body = res?.body ?? res;
      if (body?.success === true) {
        this.designationList = body?.data ?? [];
        if (this.editData?.designation_id) {
          this.selectedDesignation = this.designationList.find(
            (d: any) => d.id === this.editData.designation_id
          );
        }
      }
    });
  }

  onSelectDepartment(event: any): void {
    const selected = event?.value ?? event;
    const control = this.empVisitorForm.get('department_id');
    if (selected && selected.id) {
      control?.setValue(selected.id);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    } else {
      control?.setValue(null);
    }
  }

  onSelectDesignation(event: any): void {
    const selected = event?.value ?? event;
    const control = this.empVisitorForm.get('designation_id');
    if (selected && selected.id) {
      control?.setValue(selected.id);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    } else {
      control?.setValue(null);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.notification.error('Image size must be less than 5MB');
      return;
    }
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
  }

  submit(): void {
    if (this.empVisitorForm.invalid) {
      this.empVisitorForm.markAllAsTouched();
      return;
    }
    const pwd = this.empVisitorForm.get('password')?.value;
    const confirmPwd = this.empVisitorForm.get('confirm_password')?.value;

    if (pwd && pwd !== confirmPwd) {
      this.notification.error('Password and Confirm Password must match');
      return;
    }

    if (this.empVisitorForm.invalid) {
      this.empVisitorForm.markAllAsTouched();
      return;
    }
    const formValue = this.empVisitorForm.value;
    const formData = new FormData();
    formData.append('first_name', formValue.first_name);
    formData.append('last_name', formValue.last_name);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone);
    formData.append('joining_date', formValue.joining_date);
    formData.append('gender', formValue.gender);
    formData.append('department_id', String(formValue.department_id));
    formData.append('designation_id', String(formValue.designation_id));
    formData.append('status', String(formValue.status));

    if (formValue.password) {
      formData.append('password', formValue.password);
      formData.append('confirm_password', formValue.confirm_password);
    }

    if (formValue.about) {
      formData.append('about', formValue.about);
    }

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.isSubmitting = true;

    let req;

    if (this.editData?.id) {
      req = this.service.updateEmployeeVisitor(this.editData.id, formData);
    } else {
      req = this.service.createEmployeeVisitor(formData);
    }

    req.subscribe((res: any) => {
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