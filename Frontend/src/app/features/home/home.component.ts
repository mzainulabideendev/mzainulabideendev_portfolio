import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { BioComponent } from '../bio/bio.component';
import { ProjectsComponent } from '../projects/projects.component';
import { BlogsComponent } from '../blogs/blogs.component';
import { CertificationsComponent } from '../certifications/certifications.component';
import { BooksComponent } from '../books/books.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { ContactComponent } from '../contact/contact.component';
import { GithubShowcaseComponent } from '../github-showcase/github-showcase.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    BioComponent,
    ProjectsComponent,
    BlogsComponent,
    CertificationsComponent,
    BooksComponent,
    GalleryComponent,
    GithubShowcaseComponent,
    TimelineComponent,
    ContactComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-bio></app-bio>
    <app-projects></app-projects>
    <app-blogs></app-blogs>
    <app-certifications></app-certifications>
    <app-books></app-books>
    <app-gallery></app-gallery>
    <app-github-showcase></app-github-showcase>
    <app-timeline></app-timeline>
    <app-contact></app-contact>
  `,
  styles: [`:host { display: block; }`]
})
export class HomeComponent {}
