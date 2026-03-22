import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { About } from './components/about/about';
import { Contact } from './components/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'product', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'shop/:category/:subcategory', component: ProductListComponent },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
];
