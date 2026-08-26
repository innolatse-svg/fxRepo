import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MockDbInspectorComponent } from './shared/components/mock-db-inspector/mock-db-inspector';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, MockDbInspectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          // If there is no fragment in url, scroll smoothly/instantly to top
          if (!event.url.includes('#')) {
            try {
              if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }
              if (typeof document !== 'undefined') {
                if (document.documentElement && typeof document.documentElement.scrollTo === 'function') {
                  document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                } else if (document.documentElement) {
                  document.documentElement.scrollTop = 0;
                }
                if (document.body && typeof document.body.scrollTo === 'function') {
                  document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                } else if (document.body) {
                  document.body.scrollTop = 0;
                }
              }
            } catch {
              // Ignore scroll errors in SSR / test environments
            }
          }
        });
    }
  }
}
