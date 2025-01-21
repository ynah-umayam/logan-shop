import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, FooterComponent } from './components';
import { Observable, Subscription, distinctUntilChanged, filter } from 'rxjs';
import { User } from './models';
import { AuthenticateService, ProductService } from './services';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'logan-shop';
  user$: Observable<User>;
  cartCount$: Observable<number>;
  isHeaderEnabled = false;
  headerDisabledRoutes = ['/login', '/error'];
  searchForm: FormControl = new FormControl('');

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.user$ = this.authenticateService.user$;
    this.cartCount$ = this.productService.getCartCount$();

    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.isHeaderEnabled = !this.headerDisabledRoutes.some((route) =>
            event?.url?.includes(route),
          );
        }),
    );

    this.subscriptions.add(
      this.searchForm.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((value) => {
          this.productService.filterProducts$(value);
        }),
    );

    this.subscriptions.add(
      this.productService.selectedCategoryGroup$
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.searchForm.reset();
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
