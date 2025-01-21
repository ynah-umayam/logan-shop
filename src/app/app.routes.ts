import { Routes } from '@angular/router';
import {
  MainComponent,
  LoginComponent,
  ProductDetailsComponent,
  ErrorComponent,
  CartDetailsComponent,
} from './components';
import { authenticateGuard } from './guards/authenticate.guard';
import { ProductResolver, UserResolver } from './resolvers';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    resolve: {
      user: UserResolver,
    },
  },
  {
    path: 'product-details',
    component: ProductDetailsComponent,
    canActivate: [authenticateGuard],
    resolve: {
      user: UserResolver,
    },
  },
  {
    path: 'cart-details',
    component: CartDetailsComponent,
    canActivate: [authenticateGuard],
    resolve: {
      user: UserResolver,
      products: ProductResolver,
    },
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'main' },
];
