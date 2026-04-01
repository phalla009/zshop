import {
  Component,
  signal,
  computed,
  inject,
  HostListener,
  AfterViewInit,
  AfterViewChecked,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Footer } from '../footer/footer';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Productservice } from '../../services/productservice';
import { Product } from '../../models/product.model';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [Footer],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  expandedCards: { [key: string]: boolean } = {};
  private productService = inject(Productservice);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private langService = inject(LangService);

  private routeParams = toSignal(this.route.params);
  isShow = false;
  products = this.productService.productslist;
  searchTerm = signal('');

  get lang() {
    return this.langService.lang();
  }

  // ─── Firebase ────────────────────────────────────────────
  private readonly DB_URL = 'https://zshop-c7b61-default-rtdb.asia-southeast1.firebasedatabase.app';

  ngOnInit(): void {
    // reserved for future use
  }

  // ─── Animation ───────────────────────────────────────────
  private cardObserver!: IntersectionObserver;
  private animatedCards = new Set<Element>();

  ngAfterViewInit(): void {
    this.setupCardObserver();
    this.observeCards();
    this.updateViewCount(); // ✅ ត្រូវវាហៅនៅត្រង់នេះ ក្រោយ DOM រួចរាល់
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
    const isEn = this.langService.lang() === 'en';

    if (!cat) return isEn ? 'All Products' : 'ផលិតផលទាំងអស់';
    if (sub) {
      const label = sub === 'men' ? (isEn ? 'Men' : 'បុរស') : isEn ? 'Women' : 'ស្ត្រី';
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

  @HostListener('document:scroll', [])
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop || window.scrollY;
    this.isShow = scrollTop > 400;

    // sync view-counter show class
    const vc = document.querySelector('.view-counter');
    if (vc) {
      this.isShow ? vc.classList.add('show') : vc.classList.remove('show');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private async updateViewCount(): Promise<void> {
    const el = document.getElementById('viewCount');
    if (!el) return;
    try {
      const alreadyCounted = sessionStorage.getItem('viewCounted');

      if (!alreadyCounted) {
        const res = await fetch(`${this.DB_URL}/views.json?t=${Date.now()}`);
        const data = await res.json();
        const current = typeof data === 'number' ? data : 0;
        const newCount = current + 1;

        await fetch(`${this.DB_URL}/views.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCount),
        });

        el.textContent = newCount.toLocaleString();
        sessionStorage.setItem('viewCounted', 'true');
      } else {
        const res = await fetch(`${this.DB_URL}/views.json?t=${Date.now()}`);
        const data = await res.json();
        el.textContent = typeof data === 'number' ? data.toLocaleString() : '—';
      }
    } catch (err) {
      console.error('Firebase error:', err);
      el.textContent = '...';
    }
  }
}
