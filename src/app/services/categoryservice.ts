import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Categoryservice {
  private categorylist = signal<any[]>([
    { id: 'សម្លៀកបំពាក់', name: 'សម្លៀកបំពាក់', description: 'Clothing' },
    { id: 'នាឡិកា', name: 'នាឡិកា', description: 'Watches' },
    { id: 'ស្បែកជើង', name: 'ស្បែកជើង', description: 'Shoes' },
  ]);

  constructor(private http: HttpClient) {}

  get categorieslist() {
    return this.categorylist.asReadonly();
  }
}
