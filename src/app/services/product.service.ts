import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category, CategoryGroup, Product, CartProduct } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private filteredProducts = new BehaviorSubject<Product[]>([]);
  private productsInCart = new BehaviorSubject<CartProduct[]>(undefined);

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

  addProductToCart(
    product: Product,
    quantity: number = 1,
    isUpdate: boolean = false,
  ): void {
    const currentCart = this.productsInCart.value || [];
    let totalPrice = product.price * quantity;
    const productIndex = currentCart.findIndex(
      (cartProduct) => cartProduct.asin === product.asin,
    );
    if (productIndex !== -1) {
      let updatedQuantity = currentCart[productIndex].quantity;
      if (isUpdate) {
        updatedQuantity = quantity;
      } else {
        updatedQuantity += quantity;
      }
      totalPrice = product.price * updatedQuantity;

      currentCart[productIndex] = {
        ...currentCart[productIndex],
        quantity: updatedQuantity,
        totalPrice,
      };
    } else {
      currentCart.push({ ...product, quantity, totalPrice });
    }
    this.productsInCart.next(currentCart);
  }

  selectProductFromCart(productId: string, isSelected: boolean): void {
    const currentCart = this.productsInCart.value;
    const productIndex = currentCart.findIndex(
      (cartProduct) => cartProduct.asin === productId,
    );

    if (productIndex !== -1) {
      currentCart[productIndex] = {
        ...currentCart[productIndex],
        isSelected: !currentCart[productIndex].isSelected,
      };
    }

    this.productsInCart.next(currentCart);
  }

  toggleAllProductsFromCart(): void {
    const currentCart = this.productsInCart.value;
    const isAllSelected = (currentCart || []).every((item) => item.isSelected);
    const updatedCart = (currentCart || []).map((item) => ({
      ...item,
      isSelected: !isAllSelected,
    }));
    this.productsInCart.next(updatedCart);
  }

  removeProductFromCart(productId: string): void {
    const currentCart = this.productsInCart.value;
    const productIndex = currentCart.findIndex(
      (cartProduct) => cartProduct.asin === productId,
    );

    currentCart.splice(productIndex, 1);
    this.productsInCart.next(currentCart);
  }

  getCartCount$(): Observable<number> {
    return this.productsInCart$.pipe(
      map((products) => Object.keys(products || []).length),
    );
  }
}
