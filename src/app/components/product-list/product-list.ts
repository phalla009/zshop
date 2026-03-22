import {
  Component,
  signal,
  computed,
  inject,
  HostListener,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { Footer } from '../footer/footer';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Productservice } from '../../services/productservice';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [Footer],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductListComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  expandedCards: { [key: string]: boolean } = {};
  private productService = inject(Productservice);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private routeParams = toSignal(this.route.params);
  isShow = false;
  products = this.productService.productslist;
  searchTerm = signal('');

  // ─── Animation ───────────────────────────────────────────
  private cardObserver!: IntersectionObserver;
  private animatedCards = new Set<Element>();

  ngAfterViewInit(): void {
    this.setupCardObserver();
    this.observeCards();
  }

  ngAfterViewChecked(): void {
    this.observeCards();
  }

  ngOnDestroy(): void {
    this.cardObserver?.disconnect();
  }

  private setupCardObserver(): void {
    this.cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animatedCards.has(entry.target)) {
            this.animatedCards.add(entry.target);

            const siblings = Array.from(
              (entry.target.parentElement?.children ?? []) as HTMLCollectionOf<HTMLElement>,
            );
            const index = siblings.indexOf(entry.target as HTMLElement);
            const delay = Math.min(index * 80, 480);

            (entry.target as HTMLElement).style.animationDelay = `${delay}ms`;
            entry.target.classList.add('animate-in');
            this.cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    );
  }

  private observeCards(): void {
    if (!this.cardObserver) return;
    document.querySelectorAll('.product-card, .blog-card').forEach((card) => {
      if (!this.animatedCards.has(card)) {
        this.cardObserver.observe(card);
      }
    });
  }

  resetCardAnimations(): void {
    this.animatedCards.clear();
    document.querySelectorAll('.product-card, .blog-card').forEach((card) => {
      card.classList.remove('animate-in');
      (card as HTMLElement).style.animationDelay = '';
    });
    setTimeout(() => this.observeCards(), 50);
  }
  // ─────────────────────────────────────────────────────────

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const params = this.routeParams();

    const catParam = params?.['category'] ?? params?.['id'] ?? null;
    const subParam = params?.['subcategory'] ?? null;

    let list = this.products();

    if (catParam && catParam !== 'all') {
      list = list.filter((p) => p.category.toLowerCase().includes(catParam.toLowerCase()));
    }

    if (subParam) {
      list = list.filter((p) => p.subcategory?.toLowerCase() === subParam.toLowerCase());
    }

    if (term) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term),
      );
    }

    return list;
  });

  pageTitle = computed(() => {
    const params = this.routeParams();
    const cat = params?.['category'] ?? params?.['id'] ?? null;
    const sub = params?.['subcategory'] ?? null;

    if (!cat) return 'ផលិតផលទាំងអស់';
    if (sub) {
      const label = sub === 'men' ? 'បុរស' : 'ស្ត្រី';
      return `${cat} — ${label}`;
    }
    return cat;
  });

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.resetCardAnimations();
  }

  openDetails(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShow = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
