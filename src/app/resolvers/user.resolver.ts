import { Injectable } from '@angular/core';
import { User } from '../models';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(private authenticateService: AuthenticateService) {}

  resolve(): Observable<User> {
    return this.authenticateService.getUserDetails$();
  }
}
