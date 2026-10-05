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
import { RoleService } from '../../../role/services/role-service';
import { UserService } from '../../services/user-service';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectDropDownModule, FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss',
})
export class CreateUser implements OnInit {
  @Output() mapdata = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalService);
  private service = inject(UserService);
  private roleService = inject(RoleService);
  private notification = inject(NotificationService);

  userForm!: FormGroup;
  tittle: string = 'Create';
  editData: any;
  isSubmitting = false;
  roleList: any[] = [];
  selectedRole: any = null;

  roleConfig = {
    displayKey: 'name',
    search: true,
    height: '250px',
    placeholder: 'Select Role',
    limitTo: 50,
    noResultsFound: 'No role found',
    searchPlaceholder: 'Search role...',
    clearOnSelection: false,
    inputDirection: 'ltr',
  };

  imagePreview: string | null = null;
  imageFile: File | null = null;
  StatusDropdown = [
    { value: true, text: 'Active' },
    { value: false, text: 'InActive' },
  ];

  // ==================== LIFECYCLE ====================
  ngOnInit(): void {
    this.setInitialForm();
    this.loadDropdowns();
  }

  setInitialForm(): void {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      username: [''],
      role_id: [null, [Validators.required]],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [true, [Validators.required]],
    });

    if (this.editData) {
      this.tittle = 'Update';
      this.userForm.patchValue({
        first_name: this.editData?.first_name,
        last_name: this.editData?.last_name,
        email: this.editData?.email,
        phone: this.editData?.phone,
        username: this.editData?.username,
        role_id: this.editData?.role_id,
        address: this.editData?.address,
        status: this.editData?.status,
      });

      if (this.editData?.image) {
        this.imagePreview = this.editData.image;
      }
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadDropdowns(): void {
    this.roleService.roleList().subscribe((res: any) => {
      const body = res?.body ?? res;
      if (body?.success === true) {
        this.roleList = body?.data ?? [];

        // Edit mode: pre-select role
        if (this.editData?.role_id) {
          this.selectedRole = this.roleList.find(
            (r: any) => r.id === this.editData.role_id
          );
        }
      }
    });
  }

  onSelectRole(event: any): void {
    const selected = event?.value ?? event;
    const control = this.userForm.get('role_id');
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
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const formData = new FormData();
    formData.append('first_name', formValue.first_name);
    formData.append('last_name', formValue.last_name);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone);

    if (formValue.username) {
      formData.append('username', formValue.username);
    }

    formData.append('role_id', String(formValue.role_id));
    formData.append('status', String(formValue.status));

    if (formValue.address) {
      formData.append('address', formValue.address);
    }

    if (formValue.password) {
      formData.append('password', formValue.password);
    }

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.isSubmitting = true;
    let req;
    if (this.editData?.id) {
      req = this.service.updateUser(this.editData.id, formData);
    } else {
      req = this.service.createUser(formData);
    }

    req.subscribe((res: any) => {
      this.isSubmitting = false;
      const body = res?.body ?? res;
      if (body?.success === true || body?.code === 200 || body?.code === 201) {
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