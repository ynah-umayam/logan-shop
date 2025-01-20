import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs';
import { AuthenticateService } from '../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LogoComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formGroup: FormGroup;
  isAuthenticationFailed = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticateService: AuthenticateService,
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  forgotPassword(): void {
    window.open(
      'https://www.google.com',
      'googleWindow',
      'width=600,height=400,top=200,left=300,resizable=yes,scrollbars=yes',
    );
  }

  login(): void {
    if (this.formGroup.valid) {
      this.authenticateService
        .authenticateUser$(
          this.formGroup.get('email')?.value,
          this.formGroup.get('password')?.value,
        )
        .pipe(take(1))
        .subscribe((isAuthenticated) => {
          if (isAuthenticated) {
            this.router.navigateByUrl('/product-details');
          } else {
            this.isAuthenticationFailed = true;
          }
        });
    }
  }

  signUp(): void {
    this.router.navigateByUrl('/sign-up');
  }
}
