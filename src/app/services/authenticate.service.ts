import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor() {}

  authenticateUser$(email: string, password: string): Observable<boolean> {
    const loginEmail = 'abc@yahoo.com';
    const loginPassword = 'Testpassw0rd!';
    if (email === loginEmail && password === loginPassword) {
      return of(true);
    }
    return of(false);
  }
}
