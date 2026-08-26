import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { OnboardingService } from '../../core/services/onboarding.service';
import { LogoComponent } from '../../shared/components/logo/logo';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-onboarding-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, LogoComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between bg-[#08080a] text-slate-200 relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      <!-- Subtle Atmospheric Ambient Glow -->
      <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/[0.04] blur-[140px] rounded-full pointer-events-none -z-10"></div>
      <div class="fixed bottom-0 right-10 w-[500px] h-[300px] bg-cyan-500/[0.03] blur-[140px] rounded-full pointer-events-none -z-10"></div>
      
      <!-- Grid Pattern Background -->
      <div class="fixed inset-0 bg-[linear-gradient(to_right,#14141a08_1px,transparent_1px),linear-gradient(to_bottom,#14141a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>

      <!-- Top Header Navigation & Stepper -->
      <header class="w-full border-b border-slate-800/80 bg-[#0a0a0b]/90 backdrop-blur-md sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <!-- Brand Logo -->
          <app-logo routerLink="/" badge="SETUP" size="md"></app-logo>

          <!-- Progress Stepper Indicator (Center/Right) -->
          <div class="flex items-center gap-3 sm:gap-6">
            
            <div class="text-right">
              <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Configuration de votre espace
              </div>
              <div class="text-xs font-bold text-white font-mono flex items-center justify-end gap-1.5">
                <span>Étape {{ currentStep() }} sur 6</span>
                <span class="hidden md:inline text-slate-400">&bull; {{ currentStepName() }}</span>
              </div>
            </div>

            <!-- Visual Bar Mini Gauge perfectly synced with step -->
            <div 
              class="w-16 sm:w-28 bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700/50 p-0.5" 
              role="progressbar" 
              [attr.aria-valuenow]="currentStep()" 
              aria-valuemin="1" 
              aria-valuemax="6" 
              [attr.aria-label]="'Progression onboarding : Étape ' + currentStep() + ' sur 6'">
              <div
                class="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                [style.width.%]="progressPercent()">
              </div>
            </div>

            <!-- Theme Toggle -->
            <app-theme-toggle [variant]="'compact'"></app-theme-toggle>

          </div>

        </div>
      </header>

      <!-- Main Step Container -->
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10">
        <router-outlet></router-outlet>
      </main>

      <!-- Minimalist Reassuring Footer -->
      <footer class="w-full border-t border-slate-800/80 bg-[#0a0a0b]/60 backdrop-blur-sm py-3.5 px-4 sm:px-8 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto">
        <div class="flex items-center gap-2">
          <span class="mat-icon text-emerald-400 text-sm">lock</span>
          <span>Préférences configurables à tout moment &bull; Vos fonds restent chez votre broker</span>
        </div>

        <div class="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Aide & Support : support&#64;forexintel.io</span>
        </div>
      </footer>

    </div>
  `,
  styles: ``
})
export class OnboardingLayoutComponent {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  private navEndUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects || e.url)
    ),
    { initialValue: this.router.url }
  );

  currentStep = computed(() => {
    const url = this.navEndUrl() || this.router.url;
    if (url.includes('/trading-preferences')) return 2;
    if (url.includes('/risk-management')) return 3;
    if (url.includes('/trading-accounts')) return 4;
    if (url.includes('/automation')) return 5;
    if (url.includes('/complete')) return 6;
    if (url.includes('/welcome')) return 1;
    return this.onboardingService.currentStep();
  });

  currentStepName = computed(() => {
    switch (this.currentStep()) {
      case 1: return 'Bienvenue';
      case 2: return 'Paires Forex';
      case 3: return 'Règles de Risque';
      case 4: return 'Comptes de Trading';
      case 5: return 'Automatisation';
      case 6: return 'Finalisation';
      default: return 'Configuration';
    }
  });

  progressPercent = computed(() => {
    return Math.round((this.currentStep() / 6) * 100);
  });
}
