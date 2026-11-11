import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PicturesService } from '@core/services/pictures.service';
import { ToastService } from '@core/services/toast.service';
import { Picture } from '@core/models';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'app-pictures-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RevealDirective],
  template: `
    <section class="section admin-pictures">
      <div class="container">
        <div class="admin-pictures__header" appReveal>
          <h2>Admin Pictures</h2>
          <p>Create, update, or remove gallery pictures.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="admin-pictures__card glass-card" appReveal>
          <div class="form-grid">
            <div class="form-field">
              <label for="title">Title</label>
              <input id="title" type="text" formControlName="title" />
            </div>
            <div class="form-field">
              <label for="category">Category</label>
              <input id="category" type="text" formControlName="category" />
            </div>
            <div class="form-field full">
              <label for="imageUrl">Image URL</label>
              <input id="imageUrl" type="text" formControlName="imageUrl" />
            </div>
            <div class="form-field full">
              <label for="description">Description</label>
              <textarea id="description" rows="3" formControlName="description"></textarea>
            </div>
          </div>

          <div class="admin-pictures__actions">
            <button type="submit" class="btn btn--primary" [disabled]="saving() || form.invalid">
              <span *ngIf="!saving()">{{ editingId() ? 'Update Picture' : 'Add Picture' }}</span>
              <span *ngIf="saving()" class="spinner"></span>
            </button>
            <button type="button" class="btn btn--outline" (click)="resetForm()" [disabled]="saving()">
              Clear
            </button>
            <a routerLink="/admin/bio" class="btn btn--outline">Back to Bio</a>
            <a routerLink="/admin/books" class="btn btn--outline">Manage Books</a>
            <a routerLink="/admin/contacts" class="btn btn--outline">Manage Contacts</a>
            <a routerLink="/admin/projects" class="btn btn--outline">Manage Projects</a>
            <a routerLink="/" class="btn btn--outline">Back to Portfolio</a>
          </div>
        </form>

        <div class="admin-pictures__list" appReveal>
          <div *ngIf="loading()" class="empty-state">Loading pictures...</div>
          <div *ngIf="!loading() && pictures().length === 0" class="empty-state">
            No pictures found. Add your first picture above.
          </div>

          <div *ngIf="!loading() && pictures().length" class="pictures-grid">
            <article *ngFor="let pic of pictures(); trackBy: trackById" class="picture-card glass-card">
              <div class="picture-card__image">
                <img [src]="pic.imageUrl" [alt]="pic.title || 'Gallery image'" loading="lazy" />
              </div>
              <div class="picture-card__info">
                <h3>{{ pic.title }}</h3>
                <p class="picture-card__category">Category: {{ pic.category }}</p>
                <p class="picture-card__desc" *ngIf="pic.description">{{ pic.description }}</p>
              </div>
              <div class="picture-card__actions">
                <button class="btn btn--sm btn--outline" (click)="editPicture(pic)">Edit</button>
                <button class="btn btn--sm btn--primary" (click)="deletePicture(pic)" [disabled]="saving()">
                  Delete
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./pictures-admin.component.scss']
})
export class PicturesAdminComponent implements OnInit {
  readonly pictures = signal<Picture[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private picturesService: PicturesService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
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
    const payload = this.form.value as Picture;
    const id = this.editingId();

    const request$ = id ? this.picturesService.update(id, payload) : this.picturesService.create(payload);
    request$.subscribe(res => {
      this.saving.set(false);
      if (res) {
        this.toast.show(id ? 'Picture updated.' : 'Picture added.', 'success');
        this.resetForm();
        this.refresh();
      } else {
        this.toast.show('Failed to save picture.', 'error');
      }
    });
  }

  editPicture(pic: Picture): void {
    if (!pic.id) return;
    this.editingId.set(pic.id);
    this.form.patchValue({
      title: pic.title,
      imageUrl: pic.imageUrl,
      description: pic.description,
      category: pic.category
    });
  }

  deletePicture(pic: Picture): void {
    if (!pic.id) return;
    this.saving.set(true);
    this.picturesService.delete(pic.id).subscribe(success => {
      this.saving.set(false);
      if (success) {
        this.toast.show('Picture deleted.', 'success');
        this.refresh();
      } else {
        this.toast.show('Failed to delete picture.', 'error');
      }
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      imageUrl: '',
      description: '',
      category: ''
    });
  }

  private refresh(): void {
    this.loading.set(true);
    this.picturesService.getAll().subscribe(data => {
      this.pictures.set(data || []);
      this.loading.set(false);
    });
  }

  trackById(_: number, item: Picture): number | undefined {
    return item.id;
  }
}
