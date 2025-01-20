import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models';
import { ProductService } from '../../services';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  productList: Product[] = [];
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.productService.filteredProducts$.subscribe((products) => {
        this.productList = products;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goToProductDetails(product: Product): void {
    this.router.navigateByUrl('/product-details', { state: product });
  }

  addProductToCart($event: Event, product: Product): void {
    $event.stopPropagation();
    const isUserAuthenticated = localStorage.getItem('isUserAuthenticated');
    if (isUserAuthenticated) {
      this.productService.addProductToCart(product);
    } else {
      this.router.navigateByUrl('/error');
    }
  }
}
