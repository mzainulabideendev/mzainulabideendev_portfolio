import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PicturesService } from '@core/services/pictures.service';
import { Picture } from '@core/models';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { fadeIn } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent, RevealDirective],
  template: `
    <section id="gallery" class="section gallery-section">
      <div class="container">
        <app-section-heading tag="Gallery" title="My Visual Work"></app-section-heading>

        <!-- Category Tabs -->
        <div *ngIf="!loading()" class="gallery-tabs">
          <button
            *ngFor="let cat of categories()"
            class="gallery-tab"
            [class.active]="activeCategory() === cat"
            (click)="filterByCategory(cat)">
            {{ cat }}
          </button>
        </div>

        <!-- Skeleton -->
        <div *ngIf="loading()" class="gallery-masonry">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="gallery-item gallery-item--skeleton">
            <app-skeleton width="100%" height="250px" radius="12px"></app-skeleton>
          </div>
        </div>

        <!-- Gallery Grid -->
        <div *ngIf="!loading()" class="gallery-masonry">
          <div *ngFor="let pic of visiblePictures(); trackBy: trackById"
               class="gallery-item" @fadeIn appReveal>
            <img [src]="pic.imageUrl" [alt]="pic.title || 'Gallery image'" loading="lazy" />
            <div class="gallery-item__overlay">
              <p>{{ pic.title }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!loading() && filteredPictures().length > previewLimit" class="section-actions">
          <button class="btn btn--outline" (click)="toggleShowAllPictures()">
            {{ showAllPictures() ? 'View Less' : 'View All Pictures' }}
          </button>
        </div>

        <div *ngIf="!loading() && filteredPictures().length === 0" class="empty-state" appReveal>
          <i class="fas fa-images"></i>
          <p>No pictures available yet.</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./gallery.component.scss'],
  animations: [fadeIn]
})
export class GalleryComponent implements OnInit {
  readonly allPictures = signal<Picture[]>([]);
  readonly loading = signal(true);
  readonly activeCategory = signal('All');
  readonly showAllPictures = signal(false);
  readonly previewLimit = 10;

  readonly categories = computed(() => {
    const cats = [...new Set(this.allPictures().map((p: Picture) => p.category).filter(Boolean))];
    return ['All', ...cats];
  });

  readonly filteredPictures = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'All') return this.allPictures();
    return this.allPictures().filter((p: Picture) => p.category === cat);
  });

  readonly visiblePictures = computed(() => {
    if (this.showAllPictures()) {
      return this.filteredPictures();
    }
    return this.filteredPictures().slice(0, this.previewLimit);
  });

  constructor(private picturesService: PicturesService) {}

  ngOnInit(): void {
    this.picturesService.getAll().subscribe(data => {
      this.allPictures.set(data);
      this.loading.set(false);
    });
  }

  filterByCategory(cat: string): void {
    this.activeCategory.set(cat);
    this.showAllPictures.set(false);
  }

  trackById(_: number, item: Picture): number | undefined {
    return item.id;
  }

  toggleShowAllPictures(): void {
    this.showAllPictures.update(value => !value);
  }
}
