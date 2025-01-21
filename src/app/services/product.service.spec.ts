import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { ProductService } from './product.service';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  mockCategories,
  mockCategoryGroup,
  mockProducts,
} from '../models/testing';
import { BehaviorSubject } from 'rxjs';
import { CartProduct, CategoryGroup, Product } from '../models';

describe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('getCategories$', () => {
    it('should sort categories', (done) => {
      const mockCategoriesResponse = [
        {
          id: 1,
          category_name: 'Beading & Jewelry Making',
        },
        {
          id: 2,
          category_name: 'Fabric Decorating',
        },
        {
          id: 3,
          category_name: 'Knitting & Crochet Supplies',
        },
        {
          id: 4,
          category_name: 'Printmaking Supplies',
        },
        {
          id: 5,
          category_name: 'Scrapbooking & Stamping Supplies',
        },
        {
          id: 6,
          category_name: 'Sewing Products',
        },
        {
          id: 7,
          category_name: 'Craft & Hobby Fabric',
        },
        {
          id: 8,
          category_name: 'Needlework Supplies',
        },
        {
          id: 9,
          category_name: 'Arts, Crafts & Sewing Storage',
        },
        {
          id: 10,
          category_name: 'Painting, Drawing & Art Supplies',
        },
      ];
      service.getCategories$().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
        done();
      });

      const req = httpController.expectOne({
        method: 'GET',
        url: '/assets/mocks/categories.json',
      });

      req.flush(mockCategoriesResponse);
    });
  });

  describe('getProducts$', () => {
    it('should map products', (done) => {
      const mockProductResponse = [
        { id: '1', title: 'Phone', category_id: 1 },
        { id: '2', title: 'Book', category_id: 2 },
      ];

      service.getProducts$().subscribe((products) => {
        expect(products).toEqual([
          { id: '1', title: 'Phone', category_id: 1, categoryId: 1 },
          { id: '2', title: 'Book', category_id: 2, categoryId: 2 },
        ]);
        done();
      });

      const req = httpController.expectOne('/assets/mocks/products.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProductResponse);
    });
  });

  describe('filterProducts$', () => {
    it('should filter products by categories', (done) => {
      jest
        .spyOn(service, 'getProducts$')
        .mockReturnValue(
          new BehaviorSubject([
            { title: 'Phone', categoryId: 1 } as Product,
            { title: 'Book', categoryId: 2 } as Product,
          ]).asObservable(),
        );
      const categoryGroup: CategoryGroup = {
        groupKey: 'testGroup',
        groupName: 'Test Group',
        categoryList: [1],
      };

      service.filteredProducts$.subscribe((filteredProducts) => {
        expect(filteredProducts).toEqual([{ title: 'Phone', categoryId: 1 }]);
        done();
      });

      service.filterProducts$('Phone', categoryGroup);
    });
  });

  describe('addProductToCart', () => {
    it('should add a new product to the cart', () => {
      service.addProductToCart({ asin: '123', price: 10 } as Product, 2);

      service.productsInCart$.subscribe((cart) => {
        expect(cart).toEqual([
          { asin: '123', price: 10, quantity: 2, totalPrice: 20 },
        ]);
      });
    });

    it('should update the quantity of an existing product', () => {
      service.setProductsInCart([
        { asin: '123', price: 10, quantity: 2, totalPrice: 20 } as CartProduct,
      ]);

      service.addProductToCart({ asin: '123', price: 10 } as Product, 1);

      service.productsInCart$.subscribe((cart) => {
        expect(cart).toEqual([
          { asin: '123', price: 10, quantity: 2, totalPrice: 20 },
        ]);
      });
    });
  });

  describe('selectProductFromCart', () => {
    it('should toggle the isSelected property of a product in the cart', () => {
      service.setProductsInCart([
        { asin: '123', isSelected: false } as CartProduct,
      ]);

      service.selectProductFromCart('123');

      service.productsInCart$.subscribe((cart) => {
        expect(cart[0].isSelected).toBe(true);
      });
    });
  });

  describe('toggleAllProductsFromCart', () => {
    it('should toggle the selection of all products in the cart', () => {
      service.setProductsInCart([
        { asin: '123', isSelected: false } as CartProduct,
        { asin: '456', isSelected: false } as CartProduct,
      ]);

      service.toggleAllProductsFromCart();

      service.productsInCart$.subscribe((cart) => {
        expect(cart.every((item) => item.isSelected)).toBe(true);
      });
    });
  });

  describe('removeProductFromCart', () => {
    it('should remove a product from the cart', () => {
      service.setProductsInCart([
        { asin: '123' } as CartProduct,
        { asin: '456' } as CartProduct,
      ]);

      service.removeProductFromCart('123');

      service.productsInCart$.subscribe((cart) => {
        expect(cart.length).toBe(1);
        expect(cart[0].asin).toBe('456');
      });
    });
  });

  describe('getCartCount$', () => {
    it('should return the count of products in the cart', (done) => {
      service.setProductsInCart([
        { asin: '123' } as CartProduct,
        { asin: '456' } as CartProduct,
      ]);

      service.getCartCount$().subscribe((count) => {
        expect(count).toBe(2);
        done();
      });
    });
  });
});
