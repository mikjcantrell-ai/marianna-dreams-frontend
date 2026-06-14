import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Blocks access to the admin dashboard if no credentials are stored.
 * Credentials are saved to sessionStorage on login and cleared on logout.
 */
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const creds  = sessionStorage.getItem('md_admin_creds');
  if (creds) return true;
  router.navigate(['/admin/login']);
  return false;
};
