import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth-service/auth-service';

let isRedirecting = false;

export const HttpInterceptorService: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const bsModalService = inject(BsModalService);

  // 1. Attach Bearer token
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 2. Auth endpoints check
  const isAuthEndpoint =
    req.url.includes('refresh-token') ||
    req.url.includes('logout') ||
    req.url.includes('login');

  // 3. Handle response
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthError = error.status === 401 || error.status === 403;

      const isInvalidToken = error.error?.errors?.some(
        (e: any) =>
          e.type === 'InvalidTokenError' ||
          e.type === 'UnauthorizedError' ||
          e.type === 'TokenExpiredError'
      );

      if ((isAuthError || isInvalidToken) && !isAuthEndpoint) {
        if (!isRedirecting) {
          isRedirecting = true;

          // Cleanup
          authService.clearInvalidToken();

          // Close all modals
          let attempts = 0;
          while (bsModalService.getModalsCount() > 0 && attempts < 10) {
            bsModalService.hide();
            attempts++;
          }

          // Redirect
          router.navigate(['/login']).then(() => {
            isRedirecting = false;
          });
        }
      }

      return throwError(() => error);
    })
  );
};