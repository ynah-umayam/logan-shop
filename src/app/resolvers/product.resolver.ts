import { Injectable } from '@angular/core';
import { CartProduct, Product } from '../models';
import { Observable } from 'rxjs';
import { ProductService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver {
  constructor(private productService: ProductService) {}

  resolve(): Observable<CartProduct[]> {
    return this.productService.productsInCart$;
  }
}
