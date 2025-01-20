import { Routes } from '@angular/router';
import { MainComponent, LoginComponet } from './components';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponet },
  // { path: "sign-up", component: SignUpComponent },
  { path: 'main', component: MainComponent },
  // { path: "product-detail", component: ProductDetailComponent },
  // { path: "cart-detail", component: CartDetailComponent },
  { path: '**', redirectTo: 'main' },
];
