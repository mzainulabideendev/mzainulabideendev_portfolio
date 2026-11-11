import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { routeAnimations } from './shared/animations/route.animations';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    ScrollProgressComponent,
    ToastComponent
  ],
  template: `
    <app-loader *ngIf="isLoading"></app-loader>
    <app-scroll-progress></app-scroll-progress>
    <app-navbar></app-navbar>
    <main [@routeAnimations]="getRouteAnimationData()">
      <router-outlet #outlet="outlet"></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-toast></app-toast>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    main {
      min-height: 100vh;
    }
  `],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = true;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Simulate initial page load
    setTimeout(() => {
      this.isLoading = false;
    }, 2200);

    this.themeService.initTheme();
  }

  ngOnDestroy(): void {}

  getRouteAnimationData(): string {
    return '';
  }
}
