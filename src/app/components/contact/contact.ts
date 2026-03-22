import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Footer } from '../footer/footer';
import { environment } from '../../../environments/environment';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Footer],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact implements AfterViewInit, OnDestroy {
  private langService = inject(LangService);
  contactForm: FormGroup;
  successMessage = false;
  isSending = false;

  private observer!: IntersectionObserver;

  get lang() {
    return this.langService.lang();
  }

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,}$/)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  // ─── Scroll animations ───────────────────────────────────
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll('[data-aos]').forEach((el) => {
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  // ─────────────────────────────────────────────────────────

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSending = true;

      const botToken = environment.telegramToken;
      const chatId = environment.telegramChatId;
      const { name, email, phone, message } = this.contactForm.value;

      const text = `
📩 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
📝 Message: ${message}
      `;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      })
        .then((res) => res.json())
        .then(() => {
          this.successMessage = true;
          this.contactForm.reset();
          setTimeout(() => (this.successMessage = false), 4000);
        })
        .catch((err) => console.error('Telegram error:', err))
        .finally(() => (this.isSending = false));
    }
  }
}
