import { Component, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact/contact';
import { ProductListComponent } from '../product-list/product-list';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, Contact, ProductListComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit, OnDestroy {
  isShow: boolean = false;
  private observer!: IntersectionObserver;

  blogData = {
    header: {
      tagline: 'LATEST UPDATES',
      name: 'ចំណេះដឹង និងប្លុកម៉ូដទាន់សម័យ',
      desc: 'តាមដានរាល់និន្នាការសម្លៀកបំពាក់ ស្បែកជើង និងនាឡិកាដៃដែលមានប្រជាប្រិយភាពបំផុត។',
    },
    articles: [
      {
        id: 'post1',
        category: 'Clothing',
        date: 'Feb 14, 2026',
        name: 'ឈុតសម្លៀកបំពាក់បែបផ្លូវការ (Professional Business Attire)',
        shortDesc: 'បង្កើនទំនុកចិត្ត និងភាពថ្លៃថ្នូរក្នុងការងារ...',
        fullDesc:
          'ការជ្រើសរើសឈុតសម្លៀកបំពាក់ឱ្យបានត្រឹមត្រូវ ជួយបង្កើនទំនុកចិត្ត និងភាពអាជីពរបស់អ្នកនៅក្នុងកិច្ចប្រជុំ ឬកម្មវិធីសំខាន់ៗផ្សេងៗ។',
        img: '/images/fashion/clothing/15.jpg',
      },
      {
        id: 'post2',
        category: 'Shoes',
        date: 'Feb 14, 2026',
        name: 'ស្បែកជើងប៉ាត់តាទំនើប (Premium Sneakers)',
        shortDesc: 'ផាសុកភាព និងស្ទីលប្លែកសម្រាប់ជីវិតប្រចាំថ្ងៃ...',
        fullDesc:
          'ស្បែកជើងប៉ាត់តាដែលរួមបញ្ចូលគ្នានូវបច្ចេកវិទ្យាទប់ទល់នឹងការប៉ះទង្គិច និងការរចនាម៉ូដដ៏ទាក់ទាញ សម្រាប់តម្រូវការដើរលេង និងហាត់ប្រាណ។',
        img: '/images/fashion/shoes/12.jpg',
      },
      {
        id: 'post3',
        category: 'Watches',
        date: 'Feb 14, 2026',
        name: 'នាឡិកាដៃបុរស-នារី (Classic & Smart Watches)',
        shortDesc: 'គ្រឿងអលង្ការសម្រាប់កដៃដែលមិនអាចខ្វះបាន...',
        fullDesc:
          'ការរចនាម៉ូដនាឡិកាដៃដែលឆ្លុះបញ្ចាំងពីបុគ្គលិកលក្ខណៈ ជាមួយនឹងមុខងារទំនើបៗ និងភាពធន់ដែលអាចប្រើប្រាស់បានយូរអង្វែង។',
        img: '/images/fashion/watches/15.jpg',
      },
    ],
  };

  expandedCards: { [key: string]: boolean } = {};

  toggleReadMore(cardId: string) {
    this.expandedCards[cardId] = !this.expandedCards[cardId];
  }

  // ─── Scroll-triggered animations ─────────────────────────
  ngAfterViewInit(): void {
    // Hero elements animate immediately on load (they're above the fold)
    document.querySelectorAll('.hero [data-aos]').forEach((el, i) => {
      setTimeout(() => el.classList.add('aos-animate'), i * 150);
    });

    // Everything else triggers on scroll
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll('[data-aos]:not(.hero [data-aos])').forEach((el) => {
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  // ─────────────────────────────────────────────────────────

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShow = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
