import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CATEGORY_GROUPS, Category, CategoryGroup } from '../../../models';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  categoryGroupings: CategoryGroup[] = CATEGORY_GROUPS;
  selectedCategoryGroup: CategoryGroup | undefined;
  @Output() selectCategoryGroup = new EventEmitter<CategoryGroup>();

  private subscriptions = new Subscription();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.onSelectCategoryGroup({
      groupKey: 'all',
      groupName: 'All',
    });
    this.subscriptions.add(
      this.productService
        .getCategories$()
        .subscribe((categories) => (this.categories = categories)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSelectCategoryGroup(categoryGroup: CategoryGroup): void {
    this.selectedCategoryGroup = categoryGroup;
    this.selectCategoryGroup.emit(categoryGroup);
  }
}
