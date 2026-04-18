import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  
  if (!localStorage.getItem('accessToken')) {
    let router = inject(Router);
    router.navigate(['/log-in']);
    alert(`Log in first!`)
    return false;
  }
  return true;
};
