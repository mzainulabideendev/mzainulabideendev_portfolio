import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsService } from '@core/services/blogs.service';
import { Blog } from '@core/models';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { staggerFadeUp } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent, RevealDirective],
  template: `
    <section id="blogs" class="section blogs-section">
      <div class="container">
        <app-section-heading tag="Writing" title="My Blogs"></app-section-heading>

        <div *ngIf="loading()" class="blogs-grid">
          <div *ngFor="let i of [1,2,3]" class="blog-card blog-card--skeleton">
            <app-skeleton width="100%" height="180px" radius="12px 12px 0 0"></app-skeleton>
            <div class="blog-card__body">
              <app-skeleton width="40%" height="14px"></app-skeleton>
              <app-skeleton width="100%" height="20px"></app-skeleton>
            </div>
          </div>
        </div>

        <div *ngIf="!loading()" class="blogs-grid" [@staggerFadeUp]="blogs().length">
          <a *ngFor="let blog of blogs(); trackBy: trackById"
             class="blog-card glass-card"
             [href]="blog.url"
             target="_blank"
             rel="noopener noreferrer"
             appReveal>
            <div class="blog-card__image-wrapper">
              <img *ngIf="blog.coverImageUrl; else noImage"
                   [src]="blog.coverImageUrl"
                   [alt]="blog.title"
                   class="blog-card__image"
                   loading="lazy" />
              <ng-template #noImage>
                <div class="blog-card__image blog-card__image--placeholder">
                  <i class="fas fa-pen-nib"></i>
                </div>
              </ng-template>
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">{{ blog.tag }}</span>
              <h3 class="blog-card__title">{{ blog.title }}</h3>
            </div>
          </a>
        </div>

        <div *ngIf="!loading() && blogs().length === 0" class="empty-state" appReveal>
          <i class="fas fa-newspaper"></i>
          <p>No blogs available yet.</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./blogs.component.scss'],
  animations: [staggerFadeUp]
})
export class BlogsComponent implements OnInit {
  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal(true);

  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.blogsService.getAll().subscribe(data => {
      this.blogs.set(data);
      this.loading.set(false);
    });
  }

  trackById(_: number, item: Blog): number {
    return item.id;
  }
}
