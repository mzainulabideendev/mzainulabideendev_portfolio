import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '@core/services/projects.service';
import { Project } from '@core/models';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { staggerFadeUp } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent, RevealDirective],
  template: `
    <section id="projects" class="section projects-section">
      <div class="container">
        <app-section-heading tag="My Work" title="Featured Projects"></app-section-heading>

        <!-- Skeleton -->
        <div *ngIf="loading()" class="projects-grid">
          <div *ngFor="let i of [1,2,3]" class="project-card project-card--skeleton">
            <app-skeleton width="100%" height="200px" radius="12px 12px 0 0"></app-skeleton>
            <div class="project-card__body">
              <app-skeleton width="70%" height="22px"></app-skeleton>
              <app-skeleton width="100%" height="14px"></app-skeleton>
              <app-skeleton width="90%" height="14px"></app-skeleton>
            </div>
          </div>
        </div>

        <!-- Projects -->
        <div *ngIf="!loading()" class="projects-grid" [@staggerFadeUp]="visibleProjects().length">
          <div *ngFor="let project of visibleProjects(); trackBy: trackById" class="project-card glass-card" appReveal [revealDelay]="50">
            <div class="project-card__image-wrapper">
              <img [src]="project.imageUrl" [alt]="project.title" class="project-card__image" loading="lazy" />
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">{{ project.title }}</h3>
              <p class="project-card__desc">{{ project.description }}</p>
              <div class="project-card__techs">
                <span *ngFor="let tech of parseTech(project.technologiesUsed)" class="tech-badge">{{ tech }}</span>
              </div>
              <div class="project-card__links">
                <a *ngIf="project.projectUrl" [href]="project.projectUrl" target="_blank" class="btn btn--sm btn--primary">
                  <i class="fas fa-external-link-alt"></i> Live
                </a>
                <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank" class="btn btn--sm btn--outline">
                  <i class="fab fa-github"></i> Code
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading() && projects().length > previewLimit" class="section-actions">
          <button class="btn btn--outline" (click)="toggleShowAllProjects()">
            {{ showAllProjects() ? 'View Less' : 'View All Projects' }}
          </button>
        </div>

        <div *ngIf="!loading() && projects().length === 0" class="empty-state" appReveal>
          <i class="fas fa-folder-open"></i>
          <p>No projects available yet.</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./projects.component.scss'],
  animations: [staggerFadeUp]
})
export class ProjectsComponent implements OnInit {
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly showAllProjects = signal(false);
  readonly previewLimit = 10;

  readonly visibleProjects = computed(() => {
    if (this.showAllProjects()) {
      return this.projects();
    }
    return this.projects().slice(0, this.previewLimit);
  });

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getAll().subscribe(data => {
      this.projects.set(data);
      this.loading.set(false);
    });
  }

  trackById(_: number, item: Project): number | undefined {
    return item.id;
  }

  parseTech(value: string | null | undefined): string[] {
    if (!value) return [];
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }

  toggleShowAllProjects(): void {
    this.showAllProjects.update(value => !value);
  }
}
