import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../../../services';
import { Router } from '@angular/router';
import { mockProducts } from '../../../models/testing';

class MockRouter {
  getCurrentNavigation = () => {
    return {
      extras: {
        state: mockProducts[0],
      },
    };
  };
  navigateByUrl = () => {};
}
class MockProductService {
  addProductToCart = () => {};
}

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ProductService, useClass: MockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-title')?.textContent).toContain(
      'Sion Softside Expandable Roller Luggage, Black, Checked-Large 29-Inch',
    );
  });
});
