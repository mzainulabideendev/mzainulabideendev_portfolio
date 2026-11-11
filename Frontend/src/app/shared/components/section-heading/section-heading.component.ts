import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-heading">
      <p class="section-heading__tag">{{ tag }}</p>
      <h2 class="section-heading__title">{{ title }}</h2>
      <div class="section-heading__line"></div>
    </div>
  `,
  styles: [`
    .section-heading {
      text-align: center;
      margin-bottom: 3.5rem;

      &__tag {
        text-transform: uppercase;
        letter-spacing: 3px;
        font-size: 0.75rem;
        color: var(--accent);
        margin-bottom: 0.75rem;
        font-weight: 600;
      }

      &__title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(1.8rem, 4vw, 2.8rem);
        font-weight: 700;
        color: #fff;
        margin: 0;
      }

      &__line {
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), #a855f7);
        margin: 1rem auto 0;
        border-radius: 2px;
      }
    }
  `]
})
export class SectionHeadingComponent {
  @Input() tag = '';
  @Input() title = '';
}
