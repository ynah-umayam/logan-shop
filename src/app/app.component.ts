import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, FooterComponent } from './components';
import { ProductService } from './services';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'logan-shop';
  isHeaderEnabled = false;
  headerDisabledRoutes = ['/login'];

  private subscriptions = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
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
