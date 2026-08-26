import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        // If there is no fragment in url, scroll smoothly/instantly to top
        if (!event.url.includes('#')) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      });
  }
}
