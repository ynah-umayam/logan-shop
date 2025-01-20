import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private user = new BehaviorSubject<User>(undefined);
  public user$ = this.user.asObservable();

  constructor(private http: HttpClient) {}

  authenticateUser$(email: string, password: string): Observable<boolean> {
    const loginEmail = 'abc@yahoo.com';
    const loginPassword = 'Testpassw0rd!';
    if (email === loginEmail && password === loginPassword) {
      localStorage.setItem('isUserAuthenticated', 'true');
      return of(true);
    }
    return of(false);
  }

  getUserDetails$(): Observable<User> {
    const isUserAuthenticated = localStorage.getItem('isUserAuthenticated');
    if (isUserAuthenticated) {
      return this.http.get<any>('/assets/mocks/user.json').pipe(
        map((response) => {
          const user = {
            email: response.email,
            firstName: response.first_name,
            lastName: response.last_name,
          };
          this.user.next(user);
          return user;
        }),
      );
    }
    const user = {
      email: '',
      firstName: '',
      lastName: '',
    };
    this.user.next(user);
    return of(user);
  }
}
