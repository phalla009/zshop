import { Component, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Categoryservice } from '../../services/categoryservice';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  private categoryService = inject(Categoryservice);
  private elRef = inject(ElementRef);

  categories = this.categoryService.categorieslist;

  isOpen = false;
  isCategoryOpen = false;

  // 'clothing' | 'watches' | 'shoes' | null
  activeCategory: string | null = null;

  toggleCategory(event: Event) {
    event.preventDefault();
    this.isCategoryOpen = !this.isCategoryOpen;
    if (!this.isCategoryOpen) this.activeCategory = null;
  }

  toggleCategorySub(event: Event, key: string) {
    event.preventDefault();
    event.stopPropagation();
    this.activeCategory = this.activeCategory === key ? null : key;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? 'hidden' : 'auto';
  }

  closeMenu() {
    this.isOpen = false;
    this.isCategoryOpen = false;
    this.activeCategory = null;
    document.body.style.overflow = 'auto';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
      this.isCategoryOpen = false;
      this.activeCategory = null;
      document.body.style.overflow = 'auto';
    }
  }
}
