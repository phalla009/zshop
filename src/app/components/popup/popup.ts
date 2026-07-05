import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup implements OnInit {
  // ប្តូរពី plain boolean ទៅ signal — ធានាថា Angular ជ្រាបពីការផ្លាស់ប្តូរ
  // ភ្លាមៗ ទោះក្នុងកម្មវិធីប្រើ Zoneless Change Detection ក៏ដោយ
  isVisible = signal(false);

  constructor(public langService: LangService) {}

  get lang() {
    return this.langService.lang();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible.set(true);
    }, 800);
  }

  close() {
    this.isVisible.set(false);
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup-backdrop')) {
      this.close();
    }
  }
}
