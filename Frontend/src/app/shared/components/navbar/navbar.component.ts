import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="navbar__container">
        <a routerLink="/" class="navbar__logo">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">Portfolio</span>
          <span class="logo-bracket">/&gt;</span>
        </a>

        <ul class="navbar__links" [class.open]="menuOpen()">
          <li><a (click)="scrollTo('hero')" class="nav-link">Home</a></li>
          <li><a (click)="scrollTo('about')" class="nav-link">About</a></li>
          <li><a (click)="scrollTo('projects')" class="nav-link">Projects</a></li>
          <li><a (click)="scrollTo('blogs')" class="nav-link">Blogs</a></li>
          <li><a (click)="scrollTo('certifications')" class="nav-link">Certifications</a></li>
          <li><a (click)="scrollTo('books')" class="nav-link">Books</a></li>
          <li><a (click)="scrollTo('gallery')" class="nav-link">Gallery</a></li>
          <li><a (click)="scrollTo('github')" class="nav-link">GitHub</a></li>
          <li><a (click)="scrollTo('contact')" class="nav-link">Contact</a></li>
          <li *ngIf="isAuthed()">
            <a routerLink="/admin/bio" class="nav-link">Admin Bio</a>
          </li>
          <li *ngIf="isAuthed()">
            <a routerLink="/admin/books" class="nav-link">Admin Books</a>
          </li>
          <li *ngIf="isAuthed()">
            <a routerLink="/admin/contacts" class="nav-link">Admin Contacts</a>
          </li>
          <li *ngIf="isAuthed()">
            <a routerLink="/admin/projects" class="nav-link">Admin Projects</a>
          </li>
          <li *ngIf="isAuthed()">
            <a routerLink="/admin/pictures" class="nav-link">Admin Pictures</a>
          </li>
        </ul>

        <div class="navbar__actions">
          <button *ngIf="isAuthed()" class="nav-btn logout-btn" (click)="authService.logout()">
            Logout
          </button>

          <button class="hamburger" [class.active]="menuOpen()" (click)="toggleMenu()" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  readonly isScrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly isAuthed = this.authService.isAuthenticated;

  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  scrollTo(id: string): void {
    this.menuOpen.set(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleMenu(): void {
    this.menuOpen.update((v: boolean) => !v);
  }
}
