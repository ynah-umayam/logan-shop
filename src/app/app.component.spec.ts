import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthenticateService, ProductService } from './services';
import { of } from 'rxjs';
import { mockCategoryGroup } from './models/testing';
import { Router } from '@angular/router';

class MockRouter {
  events = of({});
}

class MockAuthenticateService {
  user$ = of({});
}

class MockProductService {
  getCartCount$ = () => of(9);
  selectedCategoryGroup$ = of(mockCategoryGroup);
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthenticateService, useClass: MockAuthenticateService },
        { provide: ProductService, useClass: MockProductService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'logan-shop' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('logan-shop');
  });
});
