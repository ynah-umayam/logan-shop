import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDetailsComponent } from './cart-details.component';
import { ProductService } from '../../../services';
import { mockProducts } from '../../../models/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

class MockRouter {
  navigateByUrl = () => {};
}
class MockProductService {
  productsInCart$ = of(mockProducts);
}

describe('CartDetailsComponent', () => {
  let component: CartDetailsComponent;
  let fixture: ComponentFixture<CartDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDetailsComponent],
      providers: [
        FormBuilder,
        { provide: Router, useClass: MockRouter },
        { provide: ProductService, useClass: MockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('calculateTotal', () => {
    it('should calculate totalPrice', () => {
      component.products = [
        {
          ...mockProducts[0],
          isSelected: true,
          price: 99,
          quantity: 1,
          totalPrice: 99,
        },
        {
          ...mockProducts[1],
          isSelected: true,
          price: 199,
          quantity: 2,
          totalPrice: 398,
        },
        {
          ...mockProducts[1],
          isSelected: false,
          price: 88,
          quantity: 2,
          totalPrice: 176,
        },
      ];
      component.calculateTotal();
      expect(component.totalPrice).toEqual(497);
    });
  });
});
