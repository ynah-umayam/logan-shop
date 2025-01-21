import { Component } from '@angular/core';
import { CategoriesComponent } from '../categories/categories.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../../../services';
import { CategoryGroup } from '../../../models';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CategoriesComponent, ProductListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(private productService: ProductService) {}

  selectCategoryGroup(categoryGroup: CategoryGroup) {
    this.productService.filterProducts$(undefined, categoryGroup);
  }
}
