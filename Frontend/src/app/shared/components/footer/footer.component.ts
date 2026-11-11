import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__top">
          <div class="footer__brand">
            <span class="bracket">&lt;</span>Portfolio<span class="bracket">/&gt;</span>
          </div>
          <div class="footer__socials">
            <a href="#" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
            <a href="#" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" target="_blank" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
          </div>
        </div>
        <div class="footer__divider"></div>
        <p class="footer__copy">&copy; {{ year }} All rights reserved. </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: rgba(10, 8, 30, 0.9);
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 3rem 0 1.5rem;
      color: rgba(255,255,255,0.5);
      font-size: 0.85rem;

      &__container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }

      &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      &__brand {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #fff;
        .bracket { color: var(--accent); }
      }

      &__socials {
        display: flex;
        gap: 1rem;
        a {
          color: rgba(255,255,255,0.5);
          font-size: 1.1rem;
          transition: color 0.3s, transform 0.3s;
          &:hover {
            color: var(--accent);
            transform: translateY(-2px);
          }
        }
      }

      &__divider {
        height: 1px;
        background: rgba(255,255,255,0.06);
        margin-bottom: 1.5rem;
      }

      &__copy {
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
