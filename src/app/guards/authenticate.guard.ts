import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticateGuardService {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    const isUserAuthenticated = localStorage.getItem('isUserAuthenticated');
    if (isUserAuthenticated) {
      return of(true);
    } else {
      return from(this.router.navigateByUrl('/error'));
    }
  }
}

export const authenticateGuard: CanActivateFn = () => {
  return inject(AuthenticateGuardService).canActivate();
};
