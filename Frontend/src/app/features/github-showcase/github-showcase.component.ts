import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubRepo } from '@core/models';
import { GithubService } from '@core/services/github.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-github-showcase',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent],
  template: `
    <section id="github" class="section github-section">
      <div class="container">
        <app-section-heading
          tag="GitHub"
          title="GitHub & Open Source"
        ></app-section-heading>

        <div *ngIf="loading()" class="github-loading">
          <app-skeleton width="100%" height="220px" radius="16px"></app-skeleton>
          <app-skeleton width="100%" height="260px" radius="16px"></app-skeleton>
        </div>

        <div *ngIf="!loading()" class="github-layout">
          <article class="glass-card graph-card">
            <div class="card-header">
              <h3>Commit Contribution Graph</h3>
              <div class="header-meta">
                <span class="commit-total">Total Public Commits: {{ totalCommits() }}</span>
                <a [href]="githubProfile" target="_blank" rel="noopener" class="profile-link">
                  <i class="fab fa-github"></i>
                  {{ username }}
                </a>
              </div>
            </div>

            <img
              class="contribution-graph"
              [src]="activeGraphUrl()"
              alt="GitHub Contribution Graph"
              loading="lazy"
              (error)="onGraphError()"
            />
          </article>

          <article class="glass-card repos-card">
            <div class="card-header">
              <h3>🚀 Open Source Projects</h3>
              <span class="repo-count">{{ repos().length }} repos</span>
            </div>

            <div *ngIf="repos().length > 0; else noRepos" class="repos-grid">
              <a
                *ngFor="let repo of visibleRepos(); trackBy: trackByRepoId"
                class="repo-item"
                [href]="repo.html_url"
                target="_blank"
                rel="noopener"
              >
                <div class="repo-item__top">
                  <h4>{{ repo.name }}</h4>
                  <i class="fas fa-arrow-up-right-from-square"></i>
                </div>
                <p>{{ repo.description || 'No description available.' }}</p>
                <div class="repo-meta">
                  <span><i class="fas fa-star"></i> {{ repo.stargazers_count }}</span>
                  <span><i class="fas fa-code-fork"></i> {{ repo.forks_count }}</span>
                  <span *ngIf="repo.language"><i class="fas fa-screwdriver-wrench"></i> {{ repo.language }}</span>
                </div>
              </a>
            </div>

            <div *ngIf="repos().length > previewLimit" class="section-actions">
              <button class="btn btn--outline" (click)="toggleShowAllRepos()">
                {{ showAllRepos() ? 'View Less' : 'View All Repositories' }}
              </button>
            </div>

            <ng-template #noRepos>
              <p class="empty-copy">No repositories available.</p>
            </ng-template>
          </article>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./github-showcase.component.scss']
})
export class GithubShowcaseComponent implements OnInit {
  readonly repos = signal<GithubRepo[]>([]);
  readonly loading = signal(true);
  readonly totalCommits = signal(0);
  readonly showAllRepos = signal(false);

  readonly previewLimit = 10;

  readonly username = 'ZainulabdeenOfficial';
  readonly githubProfile = `https://github.com/${this.username}`;
  readonly activeGraphUrl = signal(`https://ghchart.rshah.org/409ba5/${this.username}`);

  readonly visibleRepos = computed(() => {
    if (this.showAllRepos()) {
      return this.repos();
    }
    return this.repos().slice(0, this.previewLimit);
  });

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    forkJoin({
      repos: this.githubService.getRepositories(),
      totalCommits: this.githubService.getRecentPublicCommitTotal(365)
    }).subscribe(data => {
      this.repos.set(data.repos);
      this.totalCommits.set(data.totalCommits);
      this.loading.set(false);
    });
  }

  onGraphError(): void {
    if (this.activeGraphUrl() !== `https://ghchart.rshah.org/${this.username}`) {
      this.activeGraphUrl.set(`https://ghchart.rshah.org/${this.username}`);
    }
  }

  toggleShowAllRepos(): void {
    this.showAllRepos.update(value => !value);
  }

  trackByRepoId(_: number, repo: GithubRepo): number {
    return repo.id;
  }
}
