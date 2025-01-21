import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityComponent } from './quantity.component';
import { FormControl } from '@angular/forms';

describe('QuantityComponent', () => {
  let component: QuantityComponent;
  let fixture: ComponentFixture<QuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityComponent);
    component = fixture.componentInstance;
    component.form = new FormControl(0);
    fixture.detectChanges();
  });

  describe('increaseQuantity', () => {
    it('should increase the quantity value by 1', () => {
      const initialValue = 5;
      component.form.setValue(initialValue);
      component.increaseQuantity(new Event('click'));
      expect(component.form.value).toBe(initialValue + 1);
    });

    it('should set the value to 1 if the current value is null or invalid', () => {
      component.form.setValue(null);
      component.increaseQuantity(new Event('click'));
      expect(component.form.value).toBe(1);
    });
  });

  describe('decreaseQuantity', () => {
    it('should decrease the quantity value by 1 if greater than 0', () => {
      const initialValue = 5;
      component.form.setValue(initialValue);
      component.decreaseQuantity(new Event('click'));
      expect(component.form.value).toBe(initialValue - 1);
    });

    it('should not decrease the quantity value below 0', () => {
      component.form.setValue(0);
      component.decreaseQuantity(new Event('click'));
      expect(component.form.value).toBe(0);
    });
  });
});
