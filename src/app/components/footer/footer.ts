import { Component, inject } from '@angular/core';
import { LangService } from '../../services/Lang';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {
  private langService = inject(LangService);

  get lang() {
    return this.langService.lang();
  }
}
