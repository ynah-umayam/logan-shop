import { Injectable } from '@angular/core';
import { Product } from '../models';
import { Observable } from 'rxjs';
import { ProductService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver {
  constructor(private productService: ProductService) {}

  resolve(): Observable<{ [key: string]: Product[] }> {
    return this.productService.productsInCart$;
  }
}
