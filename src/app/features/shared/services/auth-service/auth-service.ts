import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.services.ts/http.services';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../storage-service/storage.service';
import { CookieService } from 'ngx-cookie-service';
import { API_CONSTANT } from '../../CONSTANT/API_CONSTANT';

export interface UserData {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  image: string | null;
  address: string;
  status: boolean;
  is_deleted: boolean;
  role: string;
  role_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(HttpService);
  private storage = inject(StorageService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  isRefreshing = signal(false);

  // ==================== LOGIN ====================
login(payload: any): Observable<any> {
  return this.apiService.post(API_CONSTANT.login, payload).pipe(
    tap((res: any) => {
      const body = res?.body ?? res;

      if (body?.success === true) {
        const token = body?.data?.token;
        const user = body?.data?.user;

        const userData: UserData = {
          id: user?.id,
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          phone: user?.phone,
          username: user?.username,
          image: user?.image || null,
          address: user?.address,
          status: user?.status,
          is_deleted: user?.is_deleted,
          role: user?.role?.name,
          role_id: user?.role?.id,
        };

        this.cookieService.set('wvms-token', token, {
          path: '/',
          secure: false,
          sameSite: 'Lax',
        });

        this.cookieService.set('wvms-user', JSON.stringify(userData), {
          path: '/',
          secure: false,
          sameSite: 'Lax',
        });
        this.storage.setItem('wvms-user', userData);
      }
    }),
    catchError((error: HttpErrorResponse) => of(error))
  );
}

  // ==================== GETTERS ====================
  getToken(): string | null {
    return this.cookieService.get('wvms-token') || null;
  }

  getUser(): UserData | null {
    const cookieStr = this.cookieService.get('wvms-user');
    if (cookieStr) {
      try {
        return JSON.parse(cookieStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  get isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  hasRole(role: string | string[]): boolean {
    const userRole = this.getUser()?.role;
    if (!userRole) return false;
    if (Array.isArray(role)) return role.includes(userRole);
    return userRole === role;
  }

  // ==================== SESSION ====================
  async hasSession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const user = await this.storage.getItem('wvms-user');
    return !!user;
  }

  clearInvalidToken(): void {
    this.cookieService.delete('wvms-token', '/');
    this.cookieService.delete('wvms-user', '/');
    this.storage.removeItem('wvms-user');
  }

  clearSessionSilently(): void {
    this.clearInvalidToken();
  }

  logout(): void {
    this.clearInvalidToken();
    this.router.navigate(['/login']);
  }
}