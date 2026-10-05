import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_CONSTANT } from '../../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../../shared/services/http.services.ts/http.services';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiService = inject(HttpService);

  // ==================== LIST ====================
  visitorList(): Observable<any> {
    return this.apiService
      .get(API_CONSTANT.visitorList)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== SEARCH (by phone or national id) ====================
  searchVisitor(payload: { phone?: string; national_id_no?: string }): Observable<any> {
    let url = API_CONSTANT.visitorSearch;
    const query: string[] = [];

    if (payload?.phone) {
      query.push(`phone=${encodeURIComponent(payload.phone)}`);
    }
    if (payload?.national_id_no) {
      query.push(`national_id_no=${encodeURIComponent(payload.national_id_no)}`);
    }

    if (query.length) {
      url += `?${query.join('&')}`;
    }

    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== GET BY ID ====================
  getVisitorById(id: any): Observable<any> {
    const url = API_CONSTANT.getVisitorById.replace('{id}', id);
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== CREATE (multipart/form-data) ====================
  createVisitor(payload: FormData): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.createVisitor, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== UPDATE (multipart/form-data) ====================
  updateVisitor(id: any, payload: FormData): Observable<any> {
    const url = API_CONSTANT.updateVisitor.replace('{id}', id);
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== CHECKOUT ====================
  checkoutVisitor(payload: any): Observable<any> {
    const url = API_CONSTANT.visitorCheckout.replace('{id}', payload.id);
    return this.apiService
      .put(url, {})
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ==================== DELETE (soft delete) ====================
  deleteVisitor(payload: any): Observable<any> {
    const url = API_CONSTANT.deleteVisitor.replace('{id}', payload.id);
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}