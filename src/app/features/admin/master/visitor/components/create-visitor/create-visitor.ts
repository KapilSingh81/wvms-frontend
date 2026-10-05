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

  // ==================== DROPDOWNS ====================
  employeeList: any[] = [];
  selectedEmployee: any = null;

  employeeConfig = {
    displayKey: 'full_name',   // 👈 we'll add a display field while mapping
    search: true,
    height: '250px',
    placeholder: 'Select Employee',
    limitTo: 50,
    noResultsFound: 'No employee found',
    searchPlaceholder: 'Search employee...',
    clearOnSelection: false,
    inputDirection: 'ltr',
  };

  GenderDropdown = [
    { value: 'Male', text: 'Male' },
    { value: 'Female', text: 'Female' },
    { value: 'Other', text: 'Other' },
  ];

  // ✅ Image preview
  imagePreview: string | null = null;
  imageFile: File | null = null;

  // ==================== LIFECYCLE ====================
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
          // ✅ Digits only, with country code, without '+'
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

    // Edit mode
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

      // Image preview
      if (this.editData?.image) {
        const base = 'http://89.116.34.155:4000';
        this.imagePreview = this.editData.image.startsWith('http')
          ? this.editData.image
          : `${base}/${this.editData.image.replace(/^\//, '')}`;
      }
    }
  }

  // ==================== LOAD EMPLOYEES ====================
  loadEmployees(): void {
    this.employeeService.employeeVisitorList().subscribe((res: any) => {
      const body = res?.body ?? res;

      if (body?.success === true) {
        const rawList = body?.data ?? [];

        // ✅ add full_name for dropdown display
        this.employeeList = rawList.map((emp: any) => ({
          ...emp,
          full_name:
            `${emp?.first_name || ''} ${emp?.last_name || ''}`.trim() ||
            emp?.email ||
            'NA',
        }));

        // ✅ Edit mode: pre-select employee
        if (this.editData?.employee_id) {
          this.selectedEmployee = this.employeeList.find(
            (e: any) => e.id === this.editData.employee_id
          );
        }
      }
    });
  }

  // ==================== DROPDOWN CHANGE ====================
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

  // ==================== IMAGE HANDLING ====================
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

  // ==================== SUBMIT ====================
  submit(): void {
    if (this.visitorForm.invalid) {
      this.visitorForm.markAllAsTouched();
      return;
    }

    const formValue = this.visitorForm.value;

    // ✅ FormData
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