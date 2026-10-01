import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_CONSTANT } from '../../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../../shared/services/http.services.ts/http.services';

@Injectable({
  providedIn: 'root',
})
export class EmployeeVisitorService {
  private apiService = inject(HttpService);

  // ==================== LIST ====================
  employeeVisitorList(): Observable<any> {
    return this.apiService
      .get(API_CONSTANT.employeeVisitorList)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== CREATE (multipart/form-data) ====================
  createEmployeeVisitor(payload: FormData): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.createEmployeeVisitor, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== UPDATE ====================
  updateEmployeeVisitor(id: any, payload: FormData): Observable<any> {
    const url = API_CONSTANT.updateEmployeeVisitor.replace('{id}', id);
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== DELETE ====================
  deleteEmployeeVisitor(payload: any): Observable<any> {
    const url = API_CONSTANT.deleteEmployeeVisitor.replace('{id}', payload.id);
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}