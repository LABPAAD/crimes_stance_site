import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <div class="container">
        &copy; {{ currentYear }} LABPAAD - Crimes Stance · visualização básica
      </div>
    </footer>
  `,
  styles: [
    `.app-footer { padding: 10px 16px; padding-top: 50px; background: #f8fafc; color: #333; text-align: center; border-top: 1px solid #e6eef6; font-size: 0.9rem }`,
    `.app-footer .container { max-width: 1200px; margin: 0 auto; }`
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
