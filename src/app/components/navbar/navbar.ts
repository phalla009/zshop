import { Component, ElementRef, HostListener, signal } from '@angular/core';
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
  // ប្តូរទាំងអស់ពី plain property ទៅ signal — ព្រោះ App ប្រើ Zoneless
  // Change Detection, ការកែប្រែ property ធម្មតាក្នុង HostListener
  // នឹងមិនធ្វើឱ្យ template ដឹងថាមានការផ្លាស់ប្តូរឡើយ
  isOpen = signal(false);
  isCategoryOpen = signal(false);
  activeCategory = signal<string | null>(null);

  isScrolled = signal(false);
  isHidden = signal(false);
  lastScrollY = 0; // តម្លៃធម្មតា មិនប៉ះពាល់ template ដូច្នេះមិនចាំបាច់ជា signal

  constructor(
    public langService: LangService,
    private elementRef: ElementRef,
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;

    this.isScrolled.set(currentScrollY > 50);

    if (this.isOpen()) {
      this.isHidden.set(false);
    } else if (currentScrollY > this.lastScrollY && currentScrollY > 150) {
      this.isHidden.set(true);
    } else {
      this.isHidden.set(false);
    }

    this.lastScrollY = currentScrollY;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeMenu();
    }
  }

  get lang() {
    return this.langService.lang();
  }

  toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
    this.isCategoryOpen.set(false);
    this.activeCategory.set(null);
  }

  toggleCategory(event: Event): void {
    event.stopPropagation();
    this.isCategoryOpen.update((v) => !v);
  }

  toggleCategorySub(event: Event, category: string): void {
    event.stopPropagation();
    this.activeCategory.update((current) => (current === category ? null : category));
  }

  toggleLang(): void {
    this.langService.toggle();
  }
}
