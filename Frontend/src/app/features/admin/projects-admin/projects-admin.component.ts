import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '@core/services/projects.service';
import { ToastService } from '@core/services/toast.service';
import { Project } from '@core/models';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'app-projects-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RevealDirective],
  template: `
    <section class="section admin-projects">
      <div class="container">
        <div class="admin-projects__header" appReveal>
          <h2>Admin Projects</h2>
          <p>Create, update, or remove projects displayed on the portfolio.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="admin-projects__card glass-card" appReveal>
          <div class="form-grid">
            <div class="form-field">
              <label for="title">Title</label>
              <input id="title" type="text" formControlName="title" />
            </div>
            <div class="form-field">
              <label for="imageUrl">Image URL</label>
              <input id="imageUrl" type="text" formControlName="imageUrl" />
            </div>
            <div class="form-field full">
              <label for="description">Description</label>
              <textarea id="description" rows="3" formControlName="description"></textarea>
            </div>
            <div class="form-field full">
              <label for="technologiesUsed">Technologies Used (comma separated)</label>
              <input id="technologiesUsed" type="text" formControlName="technologiesUsed" />
            </div>
            <div class="form-field">
              <label for="projectUrl">Project URL</label>
              <input id="projectUrl" type="text" formControlName="projectUrl" />
            </div>
            <div class="form-field">
              <label for="githubUrl">GitHub URL</label>
              <input id="githubUrl" type="text" formControlName="githubUrl" />
            </div>
          </div>

          <div class="admin-projects__actions">
            <button type="submit" class="btn btn--primary" [disabled]="saving() || form.invalid">
              <span *ngIf="!saving()">{{ editingId() ? 'Update Project' : 'Add Project' }}</span>
              <span *ngIf="saving()" class="spinner"></span>
            </button>
            <button type="button" class="btn btn--outline" (click)="resetForm()" [disabled]="saving()">
              Clear
            </button>
            <a routerLink="/admin/contacts" class="btn btn--outline">Manage Contacts</a>
            <a routerLink="/admin/books" class="btn btn--outline">Manage Books</a>
            <a routerLink="/admin/pictures" class="btn btn--outline">Manage Pictures</a>
            <a routerLink="/admin/bio" class="btn btn--outline">Back to Bio</a>
            <a routerLink="/" class="btn btn--outline">Back to Portfolio</a>
          </div>
        </form>

        <div class="admin-projects__list" appReveal>
          <div *ngIf="loading()" class="empty-state">Loading projects...</div>
          <div *ngIf="!loading() && projects().length === 0" class="empty-state">
            No projects found. Add your first project above.
          </div>

          <div *ngIf="!loading() && projects().length" class="projects-grid">
            <article *ngFor="let project of projects(); trackBy: trackById" class="project-card glass-card">
              <div class="project-card__info">
                <h3>{{ project.title }}</h3>
                <p class="project-card__desc">{{ project.description }}</p>
                <p class="project-card__tech">Tech: {{ project.technologiesUsed }}</p>
              </div>
              <div class="project-card__actions">
                <button class="btn btn--sm btn--outline" (click)="editProject(project)">Edit</button>
                <button class="btn btn--sm btn--primary" (click)="deleteProject(project)" [disabled]="saving()">
                  Delete
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./projects-admin.component.scss']
})
export class ProjectsAdminComponent implements OnInit {
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      technologiesUsed: ['', Validators.required],
      projectUrl: [''],
      githubUrl: ['']
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
    const payload = this.form.value as Project;
    const id = this.editingId();

    const request$ = id ? this.projectsService.update(id, payload) : this.projectsService.create(payload);
    request$.subscribe(res => {
      this.saving.set(false);
      if (res) {
        this.toast.show(id ? 'Project updated.' : 'Project added.', 'success');
        this.resetForm();
        this.refresh();
      } else {
        this.toast.show('Failed to save project.', 'error');
      }
    });
  }

  editProject(project: Project): void {
    if (!project.id) return;
    this.editingId.set(project.id);
    this.form.patchValue({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      technologiesUsed: project.technologiesUsed,
      projectUrl: project.projectUrl,
      githubUrl: project.githubUrl
    });
  }

  deleteProject(project: Project): void {
    if (!project.id) return;
    this.saving.set(true);
    this.projectsService.delete(project.id).subscribe(success => {
      this.saving.set(false);
      if (success) {
        this.toast.show('Project deleted.', 'success');
        this.refresh();
      } else {
        this.toast.show('Failed to delete project.', 'error');
      }
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      description: '',
      imageUrl: '',
      technologiesUsed: '',
      projectUrl: '',
      githubUrl: ''
    });
  }

  private refresh(): void {
    this.loading.set(true);
    this.projectsService.getAll().subscribe(data => {
      this.projects.set(data || []);
      this.loading.set(false);
    });
  }

  trackById(_: number, item: Project): number | undefined {
    return item.id;
  }
}
