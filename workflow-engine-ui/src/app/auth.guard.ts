import { createAuthGuard, AuthGuardData } from 'keycloak-angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  if (!authenticated) {
    return false;
  }

  const requiredRole = route.data['requiredRole'] as string | undefined;
  if (!requiredRole) {
    return true;
  }

  return grantedRoles.realmRoles.includes(requiredRole);
};

export const AuthGuard = createAuthGuard(isAccessAllowed);