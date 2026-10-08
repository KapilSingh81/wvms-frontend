import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['role'] as string[] | undefined;
  if (allowedRoles && allowedRoles.length > 0) {
    if (!authService.hasRole(allowedRoles)) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};