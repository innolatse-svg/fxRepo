import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Default theme is 'dark' (FinTech flagship signature)
  theme = signal<ThemeMode>('dark');

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('forex_intel_theme') as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.theme.set(savedTheme);
      } else {
        // Check system preference if no saved preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme.set(prefersDark ? 'dark' : 'dark'); // Default to dark for Forex Intel
      }

      this.applyTheme(this.theme());

      // React to signal updates
      effect(() => {
        const current = this.theme();
        this.applyTheme(current);
        try {
          localStorage.setItem('forex_intel_theme', current);
        } catch {
          // Ignore localStorage errors (e.g. private mode)
        }
      });
    }
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  private applyTheme(mode: ThemeMode): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    const body = document.body;

    if (mode === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }
  }
}
