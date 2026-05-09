import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Services } from '../service/services';

export const guardGuard: CanActivateFn = (route, state) => {

  let alert = inject(Services);
  
  if (!localStorage.getItem('accessToken')) {
    let router = inject(Router);
    router.navigate(['/log-in']);
    alert.show(`Log in first!`)
    return false;
  }
  return true;
};
