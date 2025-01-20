import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  count: number = 1;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state as Product;
  }

  ngOnInit(): void {
    if (!this.product) {
      this.router.navigateByUrl('/main');
    }
  }

  increaseQuantity(): void {
    this.count++;
  }

  decreaseQuantity(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  buyNow(): void {
    throw new Error('Method not implemented.');
  }
  addToCart(): void {
    throw new Error('Method not implemented.');
  }
}
