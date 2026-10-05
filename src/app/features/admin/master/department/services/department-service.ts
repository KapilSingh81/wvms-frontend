import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONSTANT } from '../../../../shared/CONSTANT/API_CONSTANT';
import { HttpService } from '../../../../shared/services/http.services.ts/http.services';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiService = inject(HttpService);

  departmentList(): Observable<any> {
    const url = API_CONSTANT.departmentList
    return this.apiService.get(url).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

  createDepartment(payload: any): Observable<any> {
    const url = API_CONSTANT.createDepartment;
    return this.apiService.post(url, payload).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

  updateDepartment(payload: any): Observable<any> {
    const url = API_CONSTANT.updateDepartment.replace('{id}', payload.id);
    return this.apiService.put(url, payload).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

  deleteDepartment(payload: any): Observable<any> {
    const url = API_CONSTANT.deleteDepartment.replace('{id}', payload.id);
    return this.apiService.delete(url).pipe(
      catchError((error: HttpErrorResponse) => of(error))
    );
  }

}