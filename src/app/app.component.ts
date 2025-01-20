import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, FooterComponent } from './components';
import { Observable, Subscription, filter } from 'rxjs';
import { User } from './models';
import { AuthenticateService, ProductService } from './services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'logan-shop';
  user$: Observable<User>;
  cartCount$: Observable<number>;
  isHeaderEnabled = false;
  headerDisabledRoutes = ['/login', '/error'];

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
  }
}
