import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'portfolio_theme';
  private readonly _theme = signal<Theme>('dark');
  readonly theme = computed(() => this._theme());
  readonly isDark = computed(() => this._theme() === 'dark');

  initTheme(): void {
    this.setTheme('dark');
  }

  toggleTheme(): void {
    this.setTheme('dark');
  }

  private setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
