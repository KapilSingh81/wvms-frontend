import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth-service';
import { NotificationService } from '../../services/notification-service/notificaiton';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Signals
  currentYear = signal(new Date().getFullYear());
  showPassword = signal(false);
  isLoading = signal<boolean>(false);

  form:any = signal({ email: '', password: '' });
  errors = signal<Record<string, string | null>>({
    email: null,
    password: null,
  });
  touched = signal<Record<string, boolean>>({
    email: false,
    password: false,
  });

  // DI
  private router = inject(Router);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  // Validators
  validators: any = {
    email: [
      (v: string) => (!v ? 'Email is required' : null),
      (v: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? null
          : 'Please enter a valid email address',
    ],
    password: [
      (v: string) => (!v ? 'Password is required' : null),
      (v: string) =>
        v.length >= 6 ? null : 'Password must be at least 6 characters',
    ],
  };

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.redirectByRole();
    }
  }

  setField(field: string, value: string): void {
    this.form.update((prev: any) => ({ ...prev, [field]: value }));
    this.touched.update((prev) => ({ ...prev, [field]: true }));
    this.validateField(field);
  }

  validateField(field: string): boolean {
    const value = this.form()[field];
    const rules = this.validators[field];
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        this.errors.update((prev) => ({ ...prev, [field]: error }));
        return false;
      }
    }
    this.errors.update((prev) => ({ ...prev, [field]: null }));
    return true;
  }

  validateForm(): boolean {
    return Object.keys(this.validators)
      .map((field) => this.validateField(field))
      .every(Boolean);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.validateForm()) return;

    const formValues = this.form();
    const payload = { email: formValues.email, password: formValues.password };

    this.isLoading.set(true);

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        console.log('Login Response:', res);
        this.isLoading.set(false);
        if (res?.body?.success === true) {
          this.notification.success(res?.body?.message || 'Login successful');
          this.redirectByRole();
        } else {
          this.notification.error(
            res?.error?.message || 'Login failed'
          );
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.notification.error(err?.error?.message || 'Server error');
      },
    });
  }

  redirectByRole(): void {
    const user = this.authService.getUser();

    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    switch (user.role) {
      case 'Admin':
        this.router.navigateByUrl('/admin/dashboard/home');
        break;
      case 'Receptionist':
        this.router.navigateByUrl('/reception/visitors');
        break;
      case 'Security':
        this.router.navigateByUrl('/security/checkin');
        break;
      default:
        this.router.navigateByUrl('/admin/dashboard/home');
    }
  }
}