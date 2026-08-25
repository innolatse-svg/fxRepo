import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-landing-final-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, RouterLink],
  template: `
    <section class="py-16 lg:py-24 bg-[#0a0a0b] border-t border-slate-800 relative overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        <div class="inline-flex">
          <span class="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            PASSEZ À L'INTELLIGENCE DE MARCHÉ
          </span>
        </div>

        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">
          Votre trading mérite plus<br />
          <span class="text-emerald-400">
            qu'une simple intuition.
          </span>
        </h2>

        <p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Centralisez votre analyse, verrouillez vos règles de risque et construisez une approche de trading Forex structurée avec la puissance de l'analyse multi-piliers.
        </p>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a routerLink="/auth/register" class="w-full sm:w-auto">
            <app-button variant="primary" size="lg" [fullWidth]="true" iconRight="arrow_forward">
              COMMENCER GRATUITEMENT
            </app-button>
          </a>
        </div>

        <div class="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400 uppercase tracking-wider">
          <span class="flex items-center gap-1.5 text-slate-300">
            <span class="mat-icon text-emerald-400 text-sm">verified</span>
            15 jours d'essai gratuit
          </span>
          <span class="text-slate-700">•</span>
          <span class="flex items-center gap-1.5 text-slate-300">
            <span class="mat-icon text-emerald-400 text-sm">credit_card_off</span>
            Sans carte bancaire
          </span>
          <span class="text-slate-700">•</span>
          <span class="flex items-center gap-1.5 text-slate-300">
            <span class="mat-icon text-emerald-400 text-sm">hub</span>
            Comptes DEMO brokers supportés
          </span>
        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class FinalCtaComponent {}
