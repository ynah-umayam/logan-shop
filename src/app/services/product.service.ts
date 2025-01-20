import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category, CategoryGroup, Product } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private filteredProducts = new BehaviorSubject<Product[]>([]);
  private productsInCart = new BehaviorSubject<{ [key: string]: Product[] }>(
    undefined,
  );

  public filteredProducts$ = this.filteredProducts.asObservable();
  public productsInCart$ = this.productsInCart.asObservable();

  constructor(private http: HttpClient) {}

  getCategories$(): Observable<Category[]> {
    return this.http.get<any>('/assets/mocks/categories.json').pipe(
      map((response) => {
        return (response || [])
          .map((category: any) => {
            return {
              id: category.id,
              categoryName: category.category_name,
            };
          })
          .sort((a: Category, b: Category) =>
            a.categoryName.localeCompare(b.categoryName),
          );
      }),
    );
  }

  getProducts$(): Observable<Product[]> {
    return this.http.get<any>('/assets/mocks/products.json').pipe(
      map((response) => {
        return (response || []).map((product: any) => {
          return {
            ...product,
            categoryId: product.category_id,
          };
        });
      }),
    );
  }

  filterProducts$(categoryGroup: CategoryGroup): void {
    this.getProducts$()
      .pipe(
        map((products) => {
          if (categoryGroup?.groupKey === 'all') {
            return products;
          } else {
            return (products || []).filter((product) =>
              (categoryGroup?.categoryList || []).includes(product.categoryId),
            );
          }
        }),
        take(1),
      )
      .subscribe((products) => {
        this.filteredProducts.next(products);
      });
  }

  addProductToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.productsInCart.value;
    const products = Array.from({ length: quantity }, () => product);
    const updatedCart = {
      ...currentCart,
      [product.asin]: [...(currentCart?.[product.asin] || []), ...products],
    };
    this.productsInCart.next(updatedCart);
  }

  removeProductFromCart(productId: number): void {
    const currentCart = this.productsInCart.value;

    const updatedCart = {
      ...currentCart,
      [productId]: (currentCart[productId] || []).splice(0, 1),
    };
    this.productsInCart.next(updatedCart);
  }

  getCartCount$(): Observable<number> {
    return this.productsInCart$.pipe(
      map((products) => Object.keys(products || []).length),
    );
  }
}
