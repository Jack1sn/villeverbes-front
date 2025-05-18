import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../src/environments/environment'; // Certifique-se de importar corretamente

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRoles'] as string[];

  // Verifica se o usuário está autenticado
  if (!authService.isAuthenticated()) {
    if (!environment.production) {
      console.log('Usuário não autenticado. Redirecionando para login...');
    }
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getUser();

  // Verifica se os dados do usuário estão completos
  if (!user || !user.usuario || !user.usuario.perfil) {
    if (!environment.production) {
      console.log('Dados do usuário inválidos ou incompletos. Redirecionando para login...');
    }
    router.navigate(['/login']);
    return false;
  }

  const userRole = user.usuario.perfil.toUpperCase();

  // Log de verificação para ambiente de desenvolvimento
  if (!environment.production) {
    console.log('Perfil do usuário:', userRole);
    console.log('Perfis esperados na rota:', expectedRoles);
  }

  // Verifica se o usuário tem permissão para acessar a rota
  const hasAccess = expectedRoles.some(role => role.toUpperCase() === userRole);

  // Log de verificação para ambiente de desenvolvimento
  if (!environment.production) {
    console.log('Acesso permitido:', hasAccess);
  }

  // Caso o usuário não tenha permissão
  if (!hasAccess) {
    if (!environment.production) {
      console.log('Usuário não tem permissão para acessar esta página. Redirecionando para login...');
    }
    alert('Você não tem permissão para acessar esta página.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
