import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { QuantityComponent } from '../../ui/quantity/quantity.component';
import { ProductService } from '../../../services';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    QuantityComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  count: number = 1;
  countControl = new FormControl('1');

  constructor(
    private router: Router,
    private productService: ProductService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state as Product;
  }

  ngOnInit(): void {
    if (!this.product) {
      this.goToMain();
    }
  }

  buyNow(): void {
    this.router.navigateByUrl('/success');
  }

  goToMain(): void {
    this.router.navigateByUrl('/main');
  }

  addToCart(): void {
    const quantity = parseInt(this.countControl.value);
    this.productService.addProductToCart(this.product, quantity, true);
  }
}
