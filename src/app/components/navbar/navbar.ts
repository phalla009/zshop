import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  isOpen = false;
  isCategoryOpen = false;
  activeCategory: string | null = null;

  constructor(public langService: LangService) {}

  get lang() {
    return this.langService.lang();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
    this.isCategoryOpen = false;
    this.activeCategory = null;
  }

  toggleCategory(event: Event): void {
    event.stopPropagation();
    this.isCategoryOpen = !this.isCategoryOpen;
  }

  toggleCategorySub(event: Event, category: string): void {
    event.stopPropagation();
    this.activeCategory = this.activeCategory === category ? null : category;
  }

  toggleLang(): void {
    this.langService.toggle();
  }
}
