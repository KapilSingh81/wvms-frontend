import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_CONSTANT } from '../../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../../shared/services/http.services.ts/http.services';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(HttpService);

  // ==================== LIST ====================
  userList(): Observable<any> {
    return this.apiService
      .get(API_CONSTANT.userList)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== GET BY ID ====================
  getUserById(id: any): Observable<any> {
    const url = API_CONSTANT.getUserById.replace('{id}', id);
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== CREATE (multipart/form-data) ====================
  createUser(payload: FormData): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.createUser, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== UPDATE (multipart/form-data) ====================
  updateUser(id: any, payload: FormData): Observable<any> {
    const url = API_CONSTANT.updateUser.replace('{id}', id);
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== DELETE (soft delete) ====================
  deleteUser(payload: any): Observable<any> {
    const url = API_CONSTANT.deleteUser.replace('{id}', payload.id);
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}