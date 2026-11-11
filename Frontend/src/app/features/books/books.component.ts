import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '@core/services/books.service';
import { Book } from '@core/models';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { staggerFadeUp } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent, RevealDirective],
  template: `
    <section id="books" class="section books-section">
      <div class="container">
        <app-section-heading tag="Reading" title="My Books"></app-section-heading>

        <div *ngIf="loading()" class="books-grid">
          <div *ngFor="let i of [1,2,3,4]" class="book-card book-card--skeleton">
            <app-skeleton width="100%" height="280px" radius="12px"></app-skeleton>
            <app-skeleton width="80%" height="18px"></app-skeleton>
            <app-skeleton width="60%" height="14px"></app-skeleton>
          </div>
        </div>

        <div *ngIf="!loading()" class="books-grid" [@staggerFadeUp]="visibleBooks().length">
          <div *ngFor="let book of visibleBooks(); trackBy: trackById" class="book-card glass-card" appReveal>
            <div class="book-card__cover-wrapper">
              <img [src]="book.coverImageUrl" [alt]="book.title" class="book-card__cover" loading="lazy" />
            </div>
            <div class="book-card__info">
              <h3 class="book-card__title">{{ book.title }}</h3>
              <p class="book-card__author">{{ book.author }}</p>
              <div class="book-card__rating">
                <i *ngFor="let star of getStars(book.rating); trackBy: trackByIndex"
                   class="fas fa-star"
                   [class.filled]="star"></i>
              </div>
              <a *ngIf="book.amazonUrl" [href]="book.amazonUrl" target="_blank" class="btn btn--sm btn--outline">
                <i class="fab fa-amazon"></i> View on Amazon
              </a>
            </div>
          </div>
        </div>

        <div *ngIf="!loading() && books().length > previewLimit" class="section-actions">
          <button class="btn btn--outline" (click)="toggleShowAllBooks()">
            {{ showAllBooks() ? 'View Less' : 'View All Books' }}
          </button>
        </div>

        <div *ngIf="!loading() && books().length === 0" class="empty-state" appReveal>
          <i class="fas fa-book-open"></i>
          <p>No books available yet.</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./books.component.scss'],
  animations: [staggerFadeUp]
})
export class BooksComponent implements OnInit {
  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly showAllBooks = signal(false);
  readonly previewLimit = 10;

  readonly visibleBooks = computed(() => {
    if (this.showAllBooks()) {
      return this.books();
    }
    return this.books().slice(0, this.previewLimit);
  });

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getAll().subscribe(data => {
      this.books.set(data);
      this.loading.set(false);
    });
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  trackById(_: number, item: Book): number | undefined {
    return item.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  toggleShowAllBooks(): void {
    this.showAllBooks.update(value => !value);
  }
}
