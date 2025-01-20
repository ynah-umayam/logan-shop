import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { LogoComponent } from '../logo/logo.component';
import { User } from '../../models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatBadgeModule,
    FormsModule,
    LogoComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private router: Router) {}

  @Input() user: User;
  @Input() cartCount: number = 0;

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToMain() {
    this.router.navigateByUrl('/main');
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  goToCartDetails() {
    if (this.cartCount > 0) {
      this.router.navigateByUrl('/cart-details');
    }
  }
}
