import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONSTANT } from '../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../shared/services/http.services.ts/http.services';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiService = inject(HttpService);

  /**
   * Get dashboard summary + visitor list
   * @param fromDate — YYYY-MM-DDTHH:mm
   * @param toDate   — YYYY-MM-DDTHH:mm
   * @param type     — 'total' | 'checked_in' | 'checked_out' | 'still_inside'
   */
  getDashboardData(fromDate: string, toDate: string, type: string): Observable<any> {
    const url = API_CONSTANT.dashboardData
      .replace('{fromDate}', encodeURIComponent(fromDate))
      .replace('{toDate}', encodeURIComponent(toDate))
      .replace('{type}', type);

    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}