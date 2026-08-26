import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-onboarding-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="w-full max-w-3xl mx-auto py-4">
      
      <!-- Welcome Main Card -->
      <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        <!-- Top Glow Accent -->
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <!-- Header -->
        <div class="space-y-3 text-left mb-8">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            INITIALISATION DE VOTRE ESPACE
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Bienvenue sur Forex Intel
          </h1>
          
          <p class="text-base text-slate-300 leading-relaxed max-w-2xl">
            Configurons votre espace pour que la plateforme puisse respecter vos préférences et vos règles de trading dès votre première session.
          </p>
        </div>

        <!-- Progress Roadmap Cards Grid -->
        <div class="space-y-3 mb-8">
          <div class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold text-left">
            Étapes de configuration rapide (2 minutes)
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            
            <!-- Step 1 -->
            <div class="p-3.5 rounded-xl bg-[#131317] border border-slate-800 flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div class="space-y-0.5">
                <div class="text-xs font-bold text-white">Vos instruments autorisés</div>
                <div class="text-[11px] text-slate-400">Sélectionnez les paires Forex à surveiller (EUR/USD, GBP/USD...).</div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="p-3.5 rounded-xl bg-[#131317] border border-slate-800 flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div class="space-y-0.5">
                <div class="text-xs font-bold text-white">Vos règles de risque</div>
                <div class="text-[11px] text-slate-400">Définissez vos limites de risque par trade et perte quotidienne maximale.</div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="p-3.5 rounded-xl bg-[#131317] border border-slate-800 flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div class="space-y-0.5">
                <div class="text-xs font-bold text-white">Vos comptes de trading</div>
                <div class="text-[11px] text-slate-400">Préparez vos comptes de courtage MT5 (étape optionnelle).</div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="p-3.5 rounded-xl bg-[#131317] border border-slate-800 flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div class="space-y-0.5">
                <div class="text-xs font-bold text-white">Niveau d'automatisation</div>
                <div class="text-[11px] text-slate-400">Choisissez entre analyse pure, signaux assistés et confirmation manuelle.</div>
              </div>
            </div>

          </div>
        </div>

        <!-- Reassurance Notice -->
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-slate-300 flex items-center gap-3 mb-8 text-left">
          <span class="mat-icon text-emerald-400 text-lg flex-shrink-0">tune</span>
          <span>Ces préférences constituent vos paramètres par défaut. <strong>Vous pourrez les ajuster à tout moment</strong> dans vos paramètres généraux.</span>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div class="text-xs text-slate-400 font-mono">
            Temps estimé : <strong>~2 minutes</strong>
          </div>

          <app-button
            variant="primary"
            size="lg"
            (btnClick)="startSetup()">
            Commencer la configuration →
          </app-button>
        </div>

      </div>

    </div>
  `,
  styles: ``
})
export class OnboardingWelcomeComponent implements OnInit {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  ngOnInit() {
    this.onboardingService.setStep(1);
  }

  startSetup() {
    this.onboardingService.setStep(2);
    this.router.navigate(['/onboarding/trading-preferences']);
  }
}
