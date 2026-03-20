import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Hero } from "../hero/hero";
import { ProductListComponent } from "../product-list/product-list";
import { About } from "../about/about";
import { Contact } from "../contact/contact";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, ProductListComponent, About, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
