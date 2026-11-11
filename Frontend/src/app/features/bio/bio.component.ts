import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BioService } from '@core/services/bio.service';
import { Bio } from '@core/models';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { fadeUp } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent, RevealDirective],
  template: `
    <section id="about" class="section bio-section">
      <div class="container">
        <app-section-heading tag="About Me" title="Who I Am"></app-section-heading>

        <!-- Skeleton Loader -->
        <div *ngIf="loading()" class="bio-skeleton">
          <div class="bio-skeleton__image">
            <app-skeleton width="200px" height="200px" radius="50%"></app-skeleton>
          </div>
          <div class="bio-skeleton__text">
            <app-skeleton width="60%" height="28px"></app-skeleton>
            <app-skeleton width="40%" height="20px"></app-skeleton>
            <app-skeleton width="100%" height="16px"></app-skeleton>
            <app-skeleton width="90%" height="16px"></app-skeleton>
            <app-skeleton width="80%" height="16px"></app-skeleton>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading() && !bio()" class="empty-state" appReveal>
          <i class="fas fa-user-slash"></i>
          <p>Bio not found. Please create one first.</p>
        </div>

        <!-- Bio Content -->
        <div *ngIf="!loading() && bio()" class="bio-content" appReveal>
          <div class="bio-content__image-wrapper">
            <div class="glow-ring">
              <img [src]="bio()!.profileImageUrl" [alt]="bio()!.name" class="bio-content__image" />
            </div>
          </div>
          <div class="bio-content__info">
            <h3 class="bio-content__name">{{ bio()!.name }}</h3>
            <p class="bio-content__title">{{ bio()!.title }}</p>
            <p class="bio-content__desc">{{ bio()!.description }}</p>

            <div class="bio-content__details">
              <div class="detail-item" *ngIf="bio()!.email">
                <i class="fas fa-envelope"></i>
                <span>{{ bio()!.email }}</span>
              </div>
              <div class="detail-item" *ngIf="bio()!.phone">
                <i class="fas fa-phone"></i>
                <span>{{ bio()!.phone }}</span>
              </div>
            </div>

            <div class="bio-content__socials">
              <a *ngIf="bio()!.githubUrl" [href]="bio()!.githubUrl" target="_blank" class="social-link">
                <i class="fab fa-github"></i>
              </a>
              <a *ngIf="bio()!.linkedInUrl" [href]="bio()!.linkedInUrl" target="_blank" class="social-link">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a *ngIf="bio()!.twitterUrl" [href]="bio()!.twitterUrl" target="_blank" class="social-link">
                <i class="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./bio.component.scss'],
  animations: [fadeUp]
})
export class BioComponent implements OnInit {
  readonly bio = signal<Bio | null>(null);
  readonly loading = signal(true);

  constructor(private bioService: BioService) {}

  ngOnInit(): void {
    this.bioService.getBio().subscribe(data => {
      this.bio.set(data);
      this.loading.set(false);
    });
  }
}
