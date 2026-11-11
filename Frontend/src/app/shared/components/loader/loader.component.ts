import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay">
      <div class="loader-content">
        <div class="loader-ring">
          <div></div><div></div><div></div><div></div>
        </div>
        <p class="loader-text">Loading<span class="dots">...</span></p>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeOutLoader 0.5s 2s forwards;
    }

    .loader-content {
      text-align: center;
    }

    .loader-ring {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;

      div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 51px;
        height: 51px;
        margin: 6px;
        border: 3px solid transparent;
        border-top-color: var(--accent, #6c63ff);
        border-radius: 50%;
        animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

        &:nth-child(1) { animation-delay: -0.45s; }
        &:nth-child(2) { animation-delay: -0.3s; }
        &:nth-child(3) { animation-delay: -0.15s; }
      }
    }

    .loader-text {
      color: rgba(255,255,255,0.6);
      font-family: 'Space Grotesk', sans-serif;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      letter-spacing: 2px;
    }

    .dots {
      animation: blink 1.4s infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes blink {
      0%, 20% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes fadeOutLoader {
      to { opacity: 0; pointer-events: none; }
    }
  `]
})
export class LoaderComponent {}
