// product-detail.ts
import { Component, signal, computed, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { Productservice } from '../../services/productservice';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Footer],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(Productservice);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // ── Product ────────────────────────────────────────────
  product = signal<Product | null>(null);

  // Active gallery image
  private _activeImg = signal<string>('');
  activeImg = computed(() => this._activeImg());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = this.productService.productslist().find((p) => String(p.id) === id) ?? null;
    this.product.set(found);
    if (found) this._activeImg.set(found.image[0]);
  }

  selectImage(img: string): void {
    this._activeImg.set(img);
  }

  goBack(): void {
    this.router.navigate(['/shop']); // adjust route as needed
  }

  // ── Scroll ────────────────────────────────────────────
  isShow = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isShow = window.scrollY > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Inquiry form ──────────────────────────────────────
  customerName = '';
  customerPhone = '';
  customerNote = '';
  formSubmitted = false;
  isSending = false;

  statusMessage: string | null = null;
  statusType: 'success' | 'error' | null = null;

  private showStatus(msg: string, type: 'success' | 'error'): void {
    this.statusMessage = msg;
    this.statusType = type;
    setTimeout(() => {
      this.statusMessage = null;
      this.statusType = null;
    }, 3000);
  }

  sendToTelegram(product: Product | null): void {
    if (!product) return;
    this.formSubmitted = true;
    if (!this.customerName.trim() || !this.customerPhone.trim()) return;

    this.isSending = true;
    const botToken = environment.telegramToken;
    const chatId = environment.telegramChatId;
    const imageUrl = this.activeImg() || product.image[0];

    const message = `
<b>🚀 ការសាកសួរផលិតផលថ្មី</b>
━━━━━━━━━━━━━━━━━━
<b>👤 ព័ត៌មានអតិថិជន</b>
<b>• ឈ្មោះ:</b> ${this.customerName}
<b>• លេខទូរស័ព្ទ:</b> <code>${this.customerPhone}</code>
<b>• ចំណាំ:</b> <i>${this.customerNote || 'មិនមាន'}</i>

<b>📦 ព័ត៌មានផលិតផល</b>
<b>• ឈ្មោះ:</b> ${product.name}
<b>• ប្រភេទ:</b> ${product.category}
<b>• លក្ខណៈ:</b> <code>${product.specs}</code>

🔗 <a href="${imageUrl}">ចុចទីនេះដើម្បីមើលរូបភាព</a>
━━━━━━━━━━━━━━━━━━
🕒 <i>ម៉ោងផ្ញើ: ${new Date().toLocaleString('km-KH')}</i>
    `;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    })
      .then((res) => {
        if (res.ok) {
          this.showStatus(
            'បញ្ជូនទិន្នន័យជោគជ័យ! ផ្នែកលក់នឹងទាក់ទងទៅលោកអ្នកក្នុងពេលឆាប់ៗ។',
            'success',
          );
          this.resetForm();
        } else {
          this.showStatus('បរាជ័យ! សូមព្យាយាមម្តងទៀត ឬទាក់ទងមកយើងផ្ទាល់។', 'error');
        }
      })
      .catch(() => {
        this.showStatus('មិនអាចភ្ជាប់ទៅកាន់ Telegram បានទេ', 'error');
      })
      .finally(() => {
        this.isSending = false;
      });
  }

  private resetForm(): void {
    this.customerName = '';
    this.customerPhone = '';
    this.customerNote = '';
    this.formSubmitted = false;
  }
}
