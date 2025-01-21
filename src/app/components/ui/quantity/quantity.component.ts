import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quantity',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './quantity.component.html',
  styleUrl: './quantity.component.scss',
})
export class QuantityComponent {
  @Input() form: FormControl;

  increaseQuantity($event: Event): void {
    $event.stopPropagation();
    let count = parseInt(this.form.value) || 0;
    count++;
    this.form.setValue(count);
  }

  decreaseQuantity($event: Event): void {
    $event.stopPropagation();
    let count = parseInt(this.form.value) || 0;
    if (count > 0) {
      count--;
      this.form.setValue(count);
    }
  }
}
