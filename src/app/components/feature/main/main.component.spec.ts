import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { ProductService } from '../../../services';
import { mockCategories, mockProducts } from '../../../models/testing';
import { of } from 'rxjs';

class MockProductService {
  filterProducts$ = () => {};
  getCategories$ = () => of(mockCategories);
  filteredProducts$ = of(mockProducts);
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [{ provide: ProductService, useClass: MockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
