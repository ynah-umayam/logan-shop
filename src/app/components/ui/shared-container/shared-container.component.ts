import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shared-container',
  standalone: true,
  imports: [],
  templateUrl: './shared-container.component.html',
  styleUrl: './shared-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedContainerComponent {}
