import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { Hero } from '../hero/hero';
import { ProductListComponent } from '../product-list/product-list';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, Hero, ProductListComponent, About, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
