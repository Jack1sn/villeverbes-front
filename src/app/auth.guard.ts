import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRoles'] as string[];
  const userRole = authService.getRole();

  if (!authService.isAuthenticated() || userRole === null || !expectedRoles.includes(userRole)) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};