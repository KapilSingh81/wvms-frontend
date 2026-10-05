import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONSTANT } from '../../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../../shared/services/http.services.ts/http.services';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiService = inject(HttpService);

  // ==================== LIST ====================
  roleList(): Observable<any> {
    const url = API_CONSTANT.roleList;
    return this.apiService.get(url).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

  // ==================== CREATE ====================
  createRole(payload: any): Observable<any> {
    const url = API_CONSTANT.createRole;
    return this.apiService.post(url, payload).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

  // ==================== UPDATE ====================
  updateRole(payload: any): Observable<any> {
    const url = API_CONSTANT.updateRole.replace('{id}', payload.id);
    return this.apiService.put(url, payload).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

  // ==================== DELETE ====================
  deleteRole(payload: any): Observable<any> {
    const url = API_CONSTANT.deleteRole.replace('{id}', payload.id);
    return this.apiService.delete(url).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }
}