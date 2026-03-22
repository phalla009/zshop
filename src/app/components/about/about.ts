import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Footer } from '../footer/footer';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  imports: [Footer],
})
export class About implements AfterViewInit, OnDestroy {
  private langService = inject(LangService);
  private observer!: IntersectionObserver;

  get lang() {
    return this.langService.lang();
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll('[data-aos]').forEach((el) => {
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  team = [
    {
      num: '01',
      name: 'HEANG PHALLA',
      role: 'Frontend Developer',
      descEn: 'Specializes in Interface design and user experience.',
      descKh: 'ជំនាញខាងរចនា Interface និងបទពិសោធន៍អ្នកប្រើប្រាស់ឱ្យកាន់តែរស់រវើក។',
      delay: '100',
    },
    {
      num: '02',
      name: 'lAA Z3E',
      role: 'Backend Developer',
      descEn: 'Expert in data management and backend security systems.',
      descKh: 'អ្នកជំនាញផ្នែកគ្រប់គ្រងទិន្នន័យ និងប្រព័ន្ធសុវត្ថិភាពពីក្រោយខ្នង។',
      delay: '200',
    },
    {
      num: '03',
      name: 'Jane Smith',
      role: 'UI/UX Designer',
      descEn: 'Creates wireframes and designs that provide ease of use.',
      descKh: 'បង្កើតនូវគំនូសព្រាង និងការរចនាដែលផ្តល់ភាពងាយស្រួលដល់អ្នកប្រើប្រាស់។',
      delay: '300',
    },
    {
      num: '04',
      name: "Z'SHOP",
      role: 'Project Manager',
      descEn: 'Leads projects and ensures work is completed on time with quality.',
      descKh: 'ដឹកនាំគម្រោង និងធានាថាការងារត្រូវបានបញ្ចប់ទាន់ពេលវេលា និងមានគុណភាព។',
      delay: '400',
    },
  ];
}
