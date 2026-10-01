import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_CONSTANT } from '../../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../../shared/services/http.services.ts/http.services';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private apiService = inject(HttpService);

  // ==================== LIST ====================
  designationList(): Observable<any> {
    return this.apiService
      .get(API_CONSTANT.designationList)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== CREATE ====================
  createDesignation(payload: any): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.createDesignation, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== UPDATE ====================
  updateDesignation(payload: any): Observable<any> {
    const url = API_CONSTANT.updateDesignation.replace('{id}', payload.id);
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== DELETE ====================
  deleteDesignation(payload: any): Observable<any> {
    const url = API_CONSTANT.deleteDesignation.replace('{id}', payload.id);
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}