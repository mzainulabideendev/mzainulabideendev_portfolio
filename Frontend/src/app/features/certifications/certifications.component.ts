import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { staggerFadeUp } from '@shared/animations/shared.animations';

interface Certification {
  title: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
  thumbnailUrl?: string;
  assetUrl?: string;
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, RevealDirective],
  template: `
    <section id="certifications" class="section certifications-section">
      <div class="container">
        <app-section-heading tag="Credentials" title="Certifications"></app-section-heading>
        <p class="certifications__recipient" appReveal>
          Issued to <span>{{ recipientName }}</span>
        </p>

        <div class="certifications-grid" [@staggerFadeUp]="certifications.length">
          <article *ngFor="let cert of certifications; trackBy: trackByTitle"
                   class="cert-card glass-card" appReveal>
            <div class="cert-card__thumb" [class.has-image]="!!cert.thumbnailUrl">
              <img *ngIf="cert.thumbnailUrl" [src]="cert.thumbnailUrl" [alt]="cert.title" loading="lazy" />
              <div *ngIf="!cert.thumbnailUrl" class="cert-card__placeholder">
                <span>{{ getPlaceholderLabel(cert) }}</span>
              </div>
            </div>

            <div class="cert-card__body">
              <div class="cert-card__meta">
                <span class="cert-card__issuer">{{ cert.issuer }}</span>
                <span class="cert-card__date">{{ cert.issued }}</span>
              </div>
              <h3 class="cert-card__title">{{ cert.title }}</h3>
              <p *ngIf="cert.credentialId" class="cert-card__id">
                Credential ID: {{ cert.credentialId }}
              </p>

              <div *ngIf="cert.skills?.length" class="cert-card__skills">
                <span *ngFor="let skill of cert.skills" class="skill-chip">{{ skill }}</span>
              </div>

              <div class="cert-card__actions">
                <a *ngIf="cert.credentialUrl" [href]="cert.credentialUrl" target="_blank" rel="noopener"
                   class="btn btn--sm btn--outline">
                  Show credential
                </a>
                <a *ngIf="cert.assetUrl" [href]="cert.assetUrl" target="_blank" rel="noopener"
                   class="btn btn--sm btn--primary">
                  View file
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./certifications.component.scss'],
  animations: [staggerFadeUp]
})
export class CertificationsComponent {
  readonly recipientName = 'Muhammad Zain Ul Abideen';

  readonly certifications: Certification[] = [
    {
      title: 'SQL (Advanced)',
      issuer: 'HackerRank',
      issued: 'Feb 2025',
      credentialId: '935b1e5405da',
      credentialUrl: 'https://www.hackerrank.com/certificates/iframe/935b1e5405da',
      skills: ['MySQL'],
      thumbnailUrl: 'https://i.postimg.cc/qhJNWFJW/image-1771174962677.png',
      assetUrl: 'https://i.postimg.cc/qhJNWFJW/image-1771174962677.png'
    },
    {
      title: 'Angular for Beginners: From Basics to Advanced Projects',
      issuer: 'Udemy',
      issued: 'Feb 2025',
      credentialId: 'UC-080598d8-d085-4705-8608-57b3928db124',
      credentialUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-080598d8-d085-4705-8608-57b3928db124.jpg?v=1738604109000',
      skills: ['Angular 19'],
      thumbnailUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-080598d8-d085-4705-8608-57b3928db124.jpg?v=1738604109000',
      assetUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-080598d8-d085-4705-8608-57b3928db124.jpg?v=1738604109000'
    },
    {
      title: 'C# : Basics to Professional Level C Sharp',
      issuer: 'Udemy',
      issued: 'Jan 2025',
      credentialId: 'UC-1bb4209d-afd7-4492-b96b-91fb040598e5',
      credentialUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-1bb4209d-afd7-4492-b96b-91fb040598e5.jpg',
      skills: ['C#'],
      thumbnailUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-1bb4209d-afd7-4492-b96b-91fb040598e5.jpg',
      assetUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-1bb4209d-afd7-4492-b96b-91fb040598e5.jpg'
    },
    {
      title: 'AI Fundamentals',
      issuer: 'DataCamp',
      issued: 'Oct 2024',
      credentialId: 'AIF0026135327872',
      credentialUrl: 'https://www.datacamp.com/skill-verification/AIF0026135327872',
      thumbnailUrl: 'https://i.postimg.cc/r0VD7Hyc/image-1771175111108.png',
      assetUrl: 'https://i.postimg.cc/r0VD7Hyc/image-1771175111108.png'
    }
  ];

  getPlaceholderLabel(cert: Certification): string {
    if (cert.assetUrl?.toLowerCase().endsWith('.pdf')) return 'PDF';
    return 'CERT';
  }

  trackByTitle(_: number, item: Certification): string {
    return item.title;
  }
}
