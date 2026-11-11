import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BioService } from '@core/services/bio.service';
import { ToastService } from '@core/services/toast.service';
import { Bio } from '@core/models';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'app-bio-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RevealDirective],
  template: `
    <section class="section admin-bio">
      <div class="container">
        <div class="admin-bio__header" appReveal>
          <h2>Admin Bio</h2>
          <p>Update the profile information shown on the portfolio.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="admin-bio__card glass-card" appReveal>
          <div class="form-grid">
            <div class="form-field">
              <label for="name">Name</label>
              <input id="name" type="text" formControlName="name" />
            </div>
            <div class="form-field">
              <label for="title">Title</label>
              <input id="title" type="text" formControlName="title" />
            </div>
            <div class="form-field full">
              <label for="description">Description</label>
              <textarea id="description" rows="4" formControlName="description"></textarea>
            </div>
            <div class="form-field full">
              <label for="profileImageUrl">Profile Image URL</label>
              <input id="profileImageUrl" type="text" formControlName="profileImageUrl" />
            </div>
            <div class="form-field">
              <label for="email">Email</label>
              <input id="email" type="email" formControlName="email" />
            </div>
            <div class="form-field">
              <label for="phone">Phone</label>
              <input id="phone" type="text" formControlName="phone" />
            </div>
            <div class="form-field">
              <label for="linkedInUrl">LinkedIn URL</label>
              <input id="linkedInUrl" type="text" formControlName="linkedInUrl" />
            </div>
            <div class="form-field">
              <label for="githubUrl">GitHub URL</label>
              <input id="githubUrl" type="text" formControlName="githubUrl" />
            </div>
            <div class="form-field">
              <label for="twitterUrl">Twitter/X URL</label>
              <input id="twitterUrl" type="text" formControlName="twitterUrl" />
            </div>
          </div>

          <div class="admin-bio__actions">
            <button type="submit" class="btn btn--primary" [disabled]="saving() || form.invalid">
              <span *ngIf="!saving()">Save Bio</span>
              <span *ngIf="saving()" class="spinner"></span>
            </button>
            <a routerLink="/admin/books" class="btn btn--outline">Manage Books</a>
            <a routerLink="/admin/contacts" class="btn btn--outline">Manage Contacts</a>
            <a routerLink="/admin/projects" class="btn btn--outline">Manage Projects</a>
            <a routerLink="/admin/pictures" class="btn btn--outline">Manage Pictures</a>
            <a routerLink="/" class="btn btn--outline">Back to Portfolio</a>
          </div>
        </form>
      </div>
    </section>
  `,
  styleUrls: ['./bio-admin.component.scss']
})
export class BioAdminComponent implements OnInit {
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bioService: BioService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      profileImageUrl: ['', Validators.required],
      email: [''],
      phone: [''],
      linkedInUrl: [''],
      githubUrl: [''],
      twitterUrl: ['']
    });
  }

  ngOnInit(): void {
    this.bioService.getBio().subscribe((bio: Bio | null) => {
      if (bio) {
        this.editingId.set(bio.id ?? null);
        this.form.patchValue(bio);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.value as Bio;
    const id = this.editingId();
    const request$ = id ? this.bioService.updateBio(payload) : this.bioService.createBio(payload);

    request$.subscribe(res => {
      this.saving.set(false);
      if (res) {
        this.editingId.set(res.id ?? id ?? null);
        this.toast.show(id ? 'Bio updated successfully.' : 'Bio saved successfully.', 'success');
      } else {
        this.toast.show('Failed to save bio.', 'error');
      }
    });
  }
}
