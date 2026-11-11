import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BooksService } from '@core/services/books.service';
import { ToastService } from '@core/services/toast.service';
import { Book } from '@core/models';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'app-books-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RevealDirective],
  template: `
    <section class="section admin-books">
      <div class="container">
        <div class="admin-books__header" appReveal>
          <h2>Admin Books</h2>
          <p>Create, update, or remove books displayed on the portfolio.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="admin-books__card glass-card" appReveal>
          <div class="form-grid">
            <div class="form-field">
              <label for="title">Title</label>
              <input id="title" type="text" formControlName="title" />
            </div>
            <div class="form-field">
              <label for="author">Author</label>
              <input id="author" type="text" formControlName="author" />
            </div>
            <div class="form-field">
              <label for="rating">Rating (0-5)</label>
              <input id="rating" type="number" min="0" max="5" step="0.1" formControlName="rating" />
            </div>
            <div class="form-field full">
              <label for="description">Description</label>
              <textarea id="description" rows="3" formControlName="description"></textarea>
            </div>
            <div class="form-field full">
              <label for="coverImageUrl">Cover Image URL</label>
              <input id="coverImageUrl" type="text" formControlName="coverImageUrl" />
            </div>
            <div class="form-field full">
              <label for="amazonUrl">Amazon URL</label>
              <input id="amazonUrl" type="text" formControlName="amazonUrl" />
            </div>
          </div>

          <div class="admin-books__actions">
            <button type="submit" class="btn btn--primary" [disabled]="saving() || form.invalid">
              <span *ngIf="!saving()">{{ editingId() ? 'Update Book' : 'Add Book' }}</span>
              <span *ngIf="saving()" class="spinner"></span>
            </button>
            <button type="button" class="btn btn--outline" (click)="resetForm()" [disabled]="saving()">
              Clear
            </button>
            <a routerLink="/admin/contacts" class="btn btn--outline">Manage Contacts</a>
            <a routerLink="/admin/projects" class="btn btn--outline">Manage Projects</a>
            <a routerLink="/admin/pictures" class="btn btn--outline">Manage Pictures</a>
            <a routerLink="/admin/bio" class="btn btn--outline">Back to Bio</a>
            <a routerLink="/" class="btn btn--outline">Back to Portfolio</a>
          </div>
        </form>

        <div class="admin-books__list" appReveal>
          <div *ngIf="loading()" class="empty-state">Loading books...</div>
          <div *ngIf="!loading() && books().length === 0" class="empty-state">
            No books found. Add your first book above.
          </div>

          <div *ngIf="!loading() && books().length" class="books-grid">
            <article *ngFor="let book of books(); trackBy: trackById" class="book-card glass-card">
              <div class="book-card__info">
                <h3>{{ book.title }}</h3>
                <p class="book-card__author">{{ book.author }}</p>
                <p class="book-card__desc" *ngIf="book.description">{{ book.description }}</p>
                <p class="book-card__rating">Rating: {{ book.rating }}</p>
              </div>
              <div class="book-card__actions">
                <button class="btn btn--sm btn--outline" (click)="editBook(book)">Edit</button>
                <button class="btn btn--sm btn--primary" (click)="deleteBook(book)" [disabled]="saving()">
                  Delete
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./books-admin.component.scss']
})
export class BooksAdminComponent implements OnInit {
  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      coverImageUrl: ['', Validators.required],
      amazonUrl: [''],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.value as Book;
    const id = this.editingId();

    const request$ = id ? this.booksService.update(id, payload) : this.booksService.create(payload);
    request$.subscribe(res => {
      this.saving.set(false);
      if (res) {
        this.toast.show(id ? 'Book updated.' : 'Book added.', 'success');
        this.resetForm();
        this.refresh();
      } else {
        this.toast.show('Failed to save book.', 'error');
      }
    });
  }

  editBook(book: Book): void {
    if (!book.id) return;
    this.editingId.set(book.id);
    this.form.patchValue({
      title: book.title,
      author: book.author,
      description: book.description,
      coverImageUrl: book.coverImageUrl,
      amazonUrl: book.amazonUrl,
      rating: book.rating
    });
  }

  deleteBook(book: Book): void {
    if (!book.id) return;
    this.saving.set(true);
    this.booksService.delete(book.id).subscribe(success => {
      this.saving.set(false);
      if (success) {
        this.toast.show('Book deleted.', 'success');
        this.refresh();
      } else {
        this.toast.show('Failed to delete book.', 'error');
      }
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      author: '',
      description: '',
      coverImageUrl: '',
      amazonUrl: '',
      rating: 0
    });
  }

  private refresh(): void {
    this.loading.set(true);
    this.booksService.getAll().subscribe(data => {
      this.books.set(data || []);
      this.loading.set(false);
    });
  }

  trackById(_: number, item: Book): number | undefined {
    return item.id;
  }
}
