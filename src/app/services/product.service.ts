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
  private selectedCategoryGroup = new BehaviorSubject<CategoryGroup>(undefined);

  public filteredProducts$ = this.filteredProducts.asObservable();
  public productsInCart$ = this.productsInCart.asObservable();
  public selectedCategoryGroup$ = this.selectedCategoryGroup.asObservable();

  constructor(private http: HttpClient) {}

  setFilteredProducts(products: Product[]): void {
    this.filteredProducts.next(products);
  }

  setProductsInCart(products: CartProduct[]): void {
    this.productsInCart.next(products);
  }

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

  filterProducts$(keyword: string, categoryGroup?: CategoryGroup): void {
    this.getProducts$()
      .pipe(
        map((products) => {
          let filteredProducts: Product[] = [];
          const selectedCategoryGroup =
            categoryGroup || this.selectedCategoryGroup.value;
          if (selectedCategoryGroup?.groupKey === 'all') {
            filteredProducts = products;
          } else {
            filteredProducts = (products || []).filter((product) =>
              (selectedCategoryGroup?.categoryList || []).includes(
                product.categoryId,
              ),
            );
          }

          if (keyword) {
            filteredProducts = (filteredProducts || []).filter((product) =>
              this.isKeywordMatched(product.title, keyword),
            );
          }
          this.selectedCategoryGroup.next(selectedCategoryGroup);
          return filteredProducts;
        }),
        take(1),
      )
      .subscribe((products) => {
        this.setFilteredProducts(products);
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
    this.setProductsInCart(currentCart);
  }

  selectProductFromCart(productId: string): void {
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
    this.setProductsInCart(currentCart);
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

  private isKeywordMatched(text: string, keyword: string): boolean {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(text);
  }
}
