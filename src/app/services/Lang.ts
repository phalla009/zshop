import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LangService {
  lang = signal<'en' | 'kh'>('en');

  toggle(): void {
    this.lang.set(this.lang() === 'en' ? 'kh' : 'en');
  }
}
