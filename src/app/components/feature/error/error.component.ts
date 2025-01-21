import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LogoComponent } from '../../ui/logo/logo.component';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SharedContainerComponent } from '../../ui/shared-container/shared-container.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    LogoComponent,
    SharedContainerComponent,
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
