import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '@core/services/projects.service';
import { Project } from '@core/models';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

interface TimelineItem {
  dateLabel: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, RevealDirective],
  template: `
    <section id="timeline" class="section timeline-section">
      <div class="container">
        <app-section-heading tag="Journey" title="My Timeline"></app-section-heading>

        <div class="timeline">
          <div class="timeline__line"></div>
          <div
            *ngFor="let item of items(); let i = index; let odd = odd"
            class="timeline__item"
            [class.timeline__item--right]="odd"
            appReveal
            [revealDelay]="i * 120">
            <div class="timeline__dot">
              <i [class]="item.icon"></i>
            </div>
            <div class="timeline__card glass-card">
              <span class="timeline__year">{{ item.dateLabel }}</span>
              <h3 class="timeline__title">{{ item.title }}</h3>
              <p class="timeline__desc">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!loading() && items().length === 0" class="empty-state" appReveal>
          <i class="fas fa-folder-open"></i>
          <p>No projects available yet.</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  readonly items = signal<TimelineItem[]>([]);
  readonly loading = signal(true);

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getAll().subscribe(data => {
      const latest = [...data]
        .sort((a, b) => this.getSortTime(b) - this.getSortTime(a))
        .slice(0, 3)
        .map(project => this.mapProjectToTimeline(project));

      this.items.set(latest);
      this.loading.set(false);
    });
  }

  private mapProjectToTimeline(project: Project): TimelineItem {
    return {
      dateLabel: this.formatProjectDate(project),
      title: project.title,
      description: project.description,
      icon: 'fas fa-diagram-project'
    };
  }

  private getSortTime(project: Project): number {
    const value = project.updatedAt || project.createdAt;
    const time = value ? new Date(value).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }

  private formatProjectDate(project: Project): string {
    const value = project.updatedAt || project.createdAt;
    if (!value) return 'Recent';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Recent';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
