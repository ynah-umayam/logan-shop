import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedContainerComponent } from '../../ui/shared-container/shared-container.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [SharedContainerComponent, MatButtonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent {
  constructor(private router: Router) {}

  goToMain(): void {
    this.router.navigateByUrl('/main');
  }
}
