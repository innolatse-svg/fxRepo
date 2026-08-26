import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer';
import { LogoComponent } from '../../shared/components/logo/logo';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-legal-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, LogoComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#0a0a0b] text-slate-200">
      
      <!-- ============================================================ -->
      <!-- SOBER LEGAL HEADER                                           -->
      <!-- ============================================================ -->
      <header class="sticky top-0 z-40 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-slate-800 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 sm:h-18">
            
            <!-- Left: Logo & Wordmark + Discreet Back Button -->
            <div class="flex items-center gap-6">
              <app-logo 
                routerLink="/" 
                size="md" 
                badge="LÉGAL" 
                badgeVariant="neutral">
              </app-logo>

              <div class="hidden md:block h-5 w-[1px] bg-slate-800"></div>

              <!-- Back to Home Link -->
              <a
                routerLink="/"
                class="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:underline">
                <span>←</span>
                <span>Retour à l'accueil</span>
              </a>
            </div>

            <!-- Right: Document Switcher Tabs, Theme Toggle & Mobile Back Link -->
            <div class="flex items-center gap-2 sm:gap-3">
              <app-theme-toggle [variant]="'compact'"></app-theme-toggle>

              <a
                routerLink="/"
                class="md:hidden inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-1.5 px-2 rounded">
                <span>←</span>
                <span>Accueil</span>
              </a>

              <nav class="flex items-center p-1 rounded-lg bg-[#141417] border border-slate-800 text-xs" aria-label="Navigation des documents légaux">
                <a
                  routerLink="/legal/terms"
                  routerLinkActive="bg-slate-800 text-white font-bold shadow-sm"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200 transition-all text-xs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 whitespace-nowrap">
                  Conditions
                </a>
                <a
                  routerLink="/legal/privacy"
                  routerLinkActive="bg-slate-800 text-white font-bold shadow-sm"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200 transition-all text-xs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 whitespace-nowrap">
                  Confidentialité
                </a>
              </nav>
            </div>

          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- Standard Platform Footer with Full Legal Disclaimer -->
      <app-footer></app-footer>
    </div>
  `,
  styles: ``
})
export class LegalLayoutComponent {}
