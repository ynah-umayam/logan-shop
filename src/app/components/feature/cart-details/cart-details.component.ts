import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../services';
import { Subscription } from 'rxjs';
import { CartProduct } from '../../../models';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { QuantityComponent } from '../../ui/quantity/quantity.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    QuantityComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss',
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  products: CartProduct[] = [];
  displayedColumns: string[] = [
    'select',
    'title',
    'price',
    'quantity',
    'totalPrice',
    'delete',
  ];
  formArray: FormArray;
  totalPrice: number = 0;
  totalItems: number = 0;

  private subscriptions = new Subscription();
  private formSubscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.productService.productsInCart$.subscribe((products) => {
        if (!products?.length) {
          this.goToMain();
        } else {
          this.products = [...products];
          this.formArray = this.fb.array([]);

          (this.products || []).forEach((product) => {
            const group = this.fb.group({
              select: [product.isSelected],
              quantity: [product.quantity],
            });
            this.formArray.push(group);
          });

          this.observeFormArrayChanges();
          this.calculateTotal();
        }
      }),
    );
  }

  observeFormArrayChanges(): void {
    this.formArray.controls.forEach((group, index) => {
      const quantityControl = this.formArray.at(index).get('quantity');
      if (quantityControl) {
        const subscription = quantityControl.valueChanges.subscribe((value) => {
          const selecteProduct = this.products[index];
          this.productService.addProductToCart(selecteProduct, value, true);
        });
        this.formSubscriptions.push(subscription);
      }

      const selectControl = this.formArray.at(index).get('select');
      if (selectControl) {
        const subscription = selectControl.valueChanges.subscribe(() => {
          const selecteProduct = this.products[index];
          this.productService.selectProductFromCart(selecteProduct?.asin);
        });
        this.formSubscriptions.push(subscription);
      }
    });
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.productService.toggleAllProductsFromCart();
    } else {
      this.productService.toggleAllProductsFromCart();
    }
    this.calculateTotal();
  }

  getSelectedProducts(): CartProduct[] {
    return (this.products || []).filter((product) => product.isSelected);
  }

  isAllSelected(): boolean {
    return (this.products || []).every((product) => product.isSelected);
  }

  getControl(index: number, controlName: string): FormControl {
    const formControl = (this.formArray?.at(index) as FormGroup)?.get(
      controlName,
    ) as FormControl;
    return formControl;
  }

  goToMain(): void {
    this.router.navigateByUrl('/main');
  }

  checkout(): void {
    this.getSelectedProducts().forEach((product) => {
      this.productService.removeProductFromCart(product.asin);
    });
    this.router.navigateByUrl('/success');
  }

  removeProductFromCart(product: CartProduct) {
    this.productService.removeProductFromCart(product.asin);
  }

  calculateTotal(): void {
    const selectedProducts = this.getSelectedProducts();
    this.totalItems = selectedProducts.length;
    this.totalPrice = selectedProducts.reduce((a, b) => {
      return a + b.totalPrice;
    }, 0);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.formSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
