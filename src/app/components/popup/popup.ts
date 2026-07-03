import { Component, OnInit } from '@angular/core';
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
  isVisible: boolean = false;

  constructor(public langService: LangService) {}

  get lang() {
    return this.langService.lang();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 800);
  }

  close() {
    this.isVisible = false;
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup-backdrop')) {
      this.close();
    }
  }
}
