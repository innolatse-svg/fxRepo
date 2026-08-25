import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTOMATION_LEVELS, OnboardingService } from '../../../core/services/onboarding.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-onboarding-complete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="w-full max-w-3xl mx-auto py-4">
      
      <!-- Main Card -->
      <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        <!-- Top Glow Accent -->
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <!-- Success Icon & Header -->
        <div class="space-y-3 text-left mb-8">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <span class="mat-icon text-2xl">check_circle</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Votre espace est configuré
          </h1>
          
          <p class="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Vos préférences initiales et vos règles de gestion de risque ont été enregistrées avec succès dans cette démonstration frontend.
          </p>
        </div>

        <!-- COMPREHENSIVE RECAP CARD -->
        <div class="space-y-4 mb-8 text-left">
          <div class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Récapitulatif de votre profil
          </div>

          <div class="p-5 rounded-xl bg-[#121216] border border-slate-800 space-y-4">
            
            <!-- Forex Pairs -->
            <div class="space-y-1.5 pb-3 border-b border-slate-800/80">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-400">Paires Forex autorisées ({{ tradingPrefs().authorizedForexPairs.length }}) :</span>
                <button
                  type="button"
                  (click)="goToStep(2)"
                  class="text-[11px] text-emerald-400 hover:underline">
                  Modifier
                </button>
              </div>
              <div class="flex flex-wrap gap-1.5">
                @for (pair of tradingPrefs().authorizedForexPairs; track pair) {
                  <span class="px-2 py-0.5 rounded bg-[#191922] border border-slate-700/60 text-xs font-mono font-bold text-white">
                    {{ pair }}
                  </span>
                }
              </div>
            </div>

            <!-- Risk Rules Matrix -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 pb-3 border-b border-slate-800/80 text-xs">
              <div>
                <div class="text-slate-400 text-[11px]">Risque / trade</div>
                <div class="font-mono font-bold text-emerald-400 text-sm mt-0.5">{{ riskPrefs().maxRiskPerTradePct }} %</div>
              </div>
              <div>
                <div class="text-slate-400 text-[11px]">Perte max / jour</div>
                <div class="font-mono font-bold text-cyan-400 text-sm mt-0.5">{{ riskPrefs().maxDailyLossPct }} %</div>
              </div>
              <div>
                <div class="text-slate-400 text-[11px]">Positions max</div>
                <div class="font-mono font-bold text-white text-sm mt-0.5">{{ riskPrefs().maxOpenPositions }} simultanées</div>
              </div>
              <div>
                <div class="text-slate-400 text-[11px]">Exposition max</div>
                <div class="font-mono font-bold text-indigo-400 text-sm mt-0.5">{{ riskPrefs().maxSimultaneousExposurePct }} %</div>
              </div>
            </div>

            <!-- Automation & Mode -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="space-y-0.5">
                <div class="text-slate-400 text-[11px]">Niveau de contrôle sélectionné :</div>
                <div class="font-bold text-white font-mono flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                    NIVEAU {{ autoPrefs().selectedLevel }}
                  </span>
                  <span>{{ currentLevelName() }}</span>
                </div>
              </div>

              <div class="text-left sm:text-right space-y-0.5">
                <div class="text-slate-400 text-[11px]">Confirmation manuelle :</div>
                <div class="font-mono font-bold" [class.text-emerald-400]="autoPrefs().manualConfirmationRequired" [class.text-amber-400]="!autoPrefs().manualConfirmationRequired">
                  {{ autoPrefs().manualConfirmationRequired ? 'ACTIVÉE (Recommandé)' : 'DÉSACTIVÉE' }}
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- REASSURANCE NOTE -->
        <div class="p-3.5 rounded-xl bg-[#131317] border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5 mb-8 text-left">
          <span class="mat-icon text-slate-400 text-base flex-shrink-0">tune</span>
          <span>Tous ces réglages pourront être ajustés ultérieurement à tout moment dans les <strong>Paramètres de votre espace</strong>.</span>
        </div>

        <!-- MAIN ACTION CTA -->
        <div class="space-y-3">
          <app-button
            variant="primary"
            size="lg"
            [fullWidth]="true"
            (btnClick)="openCompletionModal()">
            Accéder à mon espace →
          </app-button>

          <a routerLink="/" class="block text-center text-xs text-slate-400 hover:text-white transition-colors py-1">
            Retourner à l'accueil
          </a>
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- COMPLETION FEEDBACK MODAL (Roadmap / Next Steps Graceful Info) -->
      <!-- ============================================================ -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-left shadow-2xl shadow-black space-y-5">
            
            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <span class="mat-icon text-xl">rocket_launch</span>
            </div>

            <div class="space-y-2">
              <h2 class="text-xl font-bold text-white tracking-tight">
                Configuration frontend validée !
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Toutes vos préférences d'onboarding ont été enregistrées avec succès dans l'état de démonstration.
              </p>
              <p class="text-xs text-slate-400 leading-relaxed">
                Le <strong>Dashboard métier</strong> et l'<strong>interface de pilotage</strong> seront créés dans la prochaine étape de développement frontend.
              </p>
            </div>

            <div class="p-3 rounded-lg bg-[#141418] border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div class="text-slate-300 font-bold">État actuel de la plateforme :</div>
              <div>&bull; Landing Page : Validée</div>
              <div>&bull; Authentification (Login, Register, Forgot/Reset) : Complète</div>
              <div>&bull; Onboarding Wizard (6 étapes) : Validé</div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 rounded-lg bg-[#141418] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Revoir mes préférences
              </button>

              <a routerLink="/" (click)="closeModal()">
                <app-button variant="primary" size="md">
                  Retour à l'accueil
                </app-button>
              </a>
            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: ``
})
export class OnboardingCompleteComponent {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  showModal = signal<boolean>(false);

  tradingPrefs = computed(() => this.onboardingService.tradingPreferences());
  riskPrefs = computed(() => this.onboardingService.riskPreferences());
  autoPrefs = computed(() => this.onboardingService.automationPreferences());

  currentLevelName = computed(() => {
    const lvl = this.autoPrefs().selectedLevel;
    const found = AUTOMATION_LEVELS.find(l => l.level === lvl);
    return found ? found.title : 'Analyse Uniquement';
  });

  goToStep(step: number) {
    this.onboardingService.setStep(step);
    if (step === 2) this.router.navigate(['/onboarding/trading-preferences']);
    if (step === 3) this.router.navigate(['/onboarding/risk-management']);
    if (step === 4) this.router.navigate(['/onboarding/trading-accounts']);
    if (step === 5) this.router.navigate(['/onboarding/automation']);
  }

  openCompletionModal() {
    this.onboardingService.completeOnboarding();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
