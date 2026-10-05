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
import { VisitorService } from '../../services/visitor-service';
import { EmployeeVisitorService } from '../../../employee-visitor/services/employee-visitor-service';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@Component({
  selector: 'app-create-visitor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectDropDownModule, FormsModule],
  templateUrl: './create-visitor.html',
  styleUrl: './create-visitor.scss',
})
export class CreateVisitor implements OnInit {
  @Output() mapdata = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalService);
  private service = inject(VisitorService);
  private employeeService = inject(EmployeeVisitorService);
  private notification = inject(NotificationService);

  visitorForm!: FormGroup;
  tittle: string = 'Create';
  editData: any;
  isSubmitting = false;

  employeeList: any[] = [];
  selectedEmployee: any = null;
  employeeConfig = {
    displayKey: 'full_name',
    search: true,
    height: '250px',
    placeholder: 'Select Employee',

  };

  GenderDropdown = [
    { value: 'Male', text: 'Male' },
    { value: 'Female', text: 'Female' },
    { value: 'Other', text: 'Other' },
  ];

  imagePreview: string | null = null;
  imageFile: File | null = null;

  ngOnInit(): void {
    this.setInitialForm();
    this.loadEmployees();
  }

  setInitialForm(): void {
    this.visitorForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.email]],   // optional but valid email if entered
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{7,15}$/),
        ],
      ],
      gender: ['Male', [Validators.required]],
      company_name: [''],
      national_id_no: ['', [Validators.required]],
      employee_id: [null, [Validators.required]],
      purpose: ['', [Validators.required]],
      address: [''],
      previous_visitor_id: [null],
    });

    if (this.editData) {
      this.tittle = 'Update';
      this.visitorForm.patchValue({
        first_name: this.editData?.first_name,
        last_name: this.editData?.last_name,
        email: this.editData?.email,
        phone: this.editData?.phone,
        gender: this.editData?.gender,
        company_name: this.editData?.company_name,
        national_id_no: this.editData?.national_id_no,
        employee_id: this.editData?.employee_id,
        purpose: this.editData?.purpose,
        address: this.editData?.address,
      });

      if (this.editData?.image) {
        this.imagePreview = this.editData.image;
      }
    }
  }

  loadEmployees(): void {
    this.employeeService.employeeVisitorList().subscribe((res: any) => {
      const body = res?.body ?? res;
      if (body?.success === true) {
        const rawList = body?.data ?? [];
        this.employeeList = rawList.map((emp: any) => ({
          ...emp,
          full_name:
            `${emp?.first_name || ''} ${emp?.last_name || ''}`.trim() ||
            emp?.email ||
            'NA',
        }));

        if (this.editData?.employee_id) {
          this.selectedEmployee = this.employeeList.find(
            (e: any) => e.id === this.editData.employee_id
          );
        }
      }
    });
  }

  onSelectEmployee(event: any): void {
    const selected = event?.value ?? event;
    const control = this.visitorForm.get('employee_id');
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
    if (this.visitorForm.invalid) {
      this.visitorForm.markAllAsTouched();
      return;
    }

    const formValue = this.visitorForm.value;
    const formData = new FormData();
    formData.append('first_name', formValue.first_name);
    formData.append('last_name', formValue.last_name);
    formData.append('phone', formValue.phone);
    formData.append('gender', formValue.gender);
    formData.append('national_id_no', formValue.national_id_no);
    formData.append('employee_id', String(formValue.employee_id));
    formData.append('purpose', formValue.purpose);

    if (formValue.email) {
      formData.append('email', formValue.email);
    }
    if (formValue.company_name) {
      formData.append('company_name', formValue.company_name);
    }
    if (formValue.address) {
      formData.append('address', formValue.address);
    }
    if (formValue.previous_visitor_id) {
      formData.append('previous_visitor_id', String(formValue.previous_visitor_id));
    }

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.isSubmitting = true;

    let req;

    if (this.editData?.id) {
      req = this.service.updateVisitor(this.editData.id, formData);
    } else {
      req = this.service.createVisitor(formData);
    }

    req.subscribe((res: any) => {
      console.log('Save Response:', res);
      this.isSubmitting = false;

      const body = res?.body ?? res;

      if (body?.success === true || body?.code === 200 || body?.code === 201) {
        this.bsModalService.hide();
        this.mapdata.emit(body);
        this.notification.success(
          body?.message || body?.actionResponse || 'Visitor saved successfully'
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