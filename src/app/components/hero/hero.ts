import { Component, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit, OnDestroy {
  isShow: boolean = false;
  private observer!: IntersectionObserver;

  constructor(public langService: LangService) {}

  get lang() {
    return this.langService.lang();
  }

  blogData = {
    header: {
      taglineEn: 'LATEST UPDATES',
      taglineKh: 'ព័ត៌មានថ្មីៗ',
      nameEn: 'Knowledge & Modern Fashion Blog',
      nameKh: 'ចំណេះដឹង និងប្លុកម៉ូដទាន់សម័យ',
      descEn: 'Follow the most popular clothing, shoes, and watch trends.',
      descKh: 'តាមដានរាល់និន្នាការសម្លៀកបំពាក់ ស្បែកជើង និងនាឡិកាដៃដែលមានប្រជាប្រិយភាពបំផុត។',
    },
    articles: [
      {
        id: 'post1',
        category: 'Clothing',
        date: 'Feb 14, 2026',
        nameEn: 'Professional Business Attire',
        nameKh: 'ឈុតសម្លៀកបំពាក់បែបផ្លូវការ',
        shortDescEn: 'Boost your confidence and elegance at work...',
        shortDescKh: 'បង្កើនទំនុកចិត្ត និងភាពថ្លៃថ្នូរក្នុងការងារ...',
        fullDescEn:
          'Choosing the right outfit boosts your confidence and professionalism in meetings and important events.',
        fullDescKh:
          'ការជ្រើសរើសឈុតសម្លៀកបំពាក់ឱ្យបានត្រឹមត្រូវ ជួយបង្កើនទំនុកចិត្ត និងភាពអាជីពរបស់អ្នក។',
        img: '/images/fashion/clothing/15.jpg',
      },
      {
        id: 'post2',
        category: 'Shoes',
        date: 'Feb 14, 2026',
        nameEn: 'Premium Sneakers',
        nameKh: 'ស្បែកជើងប៉ាត់តាទំនើប',
        shortDescEn: 'Comfort and unique style for everyday life...',
        shortDescKh: 'ផាសុកភាព និងស្ទីលប្លែកសម្រាប់ជីវិតប្រចាំថ្ងៃ...',
        fullDescEn:
          'Sneakers combining impact-resistant technology and attractive design for leisure and exercise.',
        fullDescKh: 'ស្បែកជើងប៉ាត់តាដែលរួមបញ្ចូលគ្នានូវបច្ចេកវិទ្យា និងការរចនាម៉ូដដ៏ទាក់ទាញ។',
        img: '/images/fashion/shoes/12.jpg',
      },
      {
        id: 'post3',
        category: 'Watches',
        date: 'Feb 14, 2026',
        nameEn: 'Classic & Smart Watches',
        nameKh: 'នាឡិកាដៃបុរស-នារី',
        shortDescEn: 'The essential wrist accessory you cannot miss...',
        shortDescKh: 'គ្រឿងអលង្ការសម្រាប់កដៃដែលមិនអាចខ្វះបាន...',
        fullDescEn:
          'Watch designs reflecting personality with modern features and long-lasting durability.',
        fullDescKh: 'ការរចនាម៉ូដនាឡិកាដៃឆ្លុះបញ្ចាំងពីបុគ្គលិកលក្ខណៈ ជាមួយនឹងមុខងារទំនើបៗ។',
        img: '/images/fashion/watches/15.jpg',
      },
    ],
  };

  expandedCards: { [key: string]: boolean } = {};

  toggleReadMore(cardId: string) {
    this.expandedCards[cardId] = !this.expandedCards[cardId];
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('.hero [data-aos]').forEach((el, i) => {
      setTimeout(() => el.classList.add('aos-animate'), i * 150);
    });

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShow = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
