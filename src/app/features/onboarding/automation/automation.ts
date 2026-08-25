import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTOMATION_LEVELS, OnboardingService } from '../../../core/services/onboarding.service';
import { AutomationLevel } from '../../../core/models/onboarding.model';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-onboarding-automation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-4">
      
      <!-- Main Card -->
      <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        <!-- Top Glow Accent -->
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <!-- Header -->
        <div class="space-y-2 text-left mb-8">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <span>Étape 5 &bull; Niveaux de Contrôle & Supervision</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choisissez votre niveau de contrôle
          </h1>
          
          <p class="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Vous gardez la maîtrise absolue. Déterminez si la plateforme doit agir comme un simple tableau de bord analytique ou générer des signaux assistés.
          </p>
        </div>

        <!-- AUTOMATION LEVELS LIST -->
        <div class="space-y-3 mb-8 text-left">
          @for (item of levels; track item.level) {
            <button
              type="button"
              (click)="selectLevel(item.level)"
              class="w-full p-4 rounded-xl border text-left transition-all duration-150 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              [class.bg-emerald-500-08]="selectedLevel() === item.level"
              [class.border-emerald-500-50]="selectedLevel() === item.level"
              [class.bg-[#121216]]="selectedLevel() !== item.level"
              [class.border-slate-800]="selectedLevel() !== item.level"
              [class.hover:border-slate-700]="selectedLevel() !== item.level">
              
              <div class="space-y-1.5 flex-1">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                    [class.bg-emerald-500-20]="item.level === 1 || item.level === 2 || item.level === 3"
                    [class.text-emerald-400]="item.level === 1 || item.level === 2 || item.level === 3"
                    [class.bg-amber-500-15]="item.level === 4 || item.level === 5"
                    [class.text-amber-400]="item.level === 4 || item.level === 5">
                    {{ item.badge }}
                  </span>

                  <h2 class="text-sm font-bold text-white tracking-tight">
                    {{ item.title }}
                  </h2>

                  @if (!item.isAvailableNow) {
                    <span class="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {{ item.statusNote }}
                    </span>
                  }
                </div>

                <p class="text-xs text-slate-400 leading-relaxed">
                  {{ item.description }}
                </p>

                <div class="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                  <span class="mat-icon text-slate-400 text-xs">tune</span>
                  <span>Mode : {{ item.executionMode }}</span>
                </div>
              </div>

              <!-- Radio / Check Indicator -->
              <div class="flex-shrink-0 flex items-center justify-end">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center border transition-colors"
                  [class.bg-emerald-500]="selectedLevel() === item.level"
                  [class.border-emerald-400]="selectedLevel() === item.level"
                  [class.text-black]="selectedLevel() === item.level"
                  [class.border-slate-700]="selectedLevel() !== item.level"
                  [class.bg-slate-800]="selectedLevel() !== item.level">
                  @if (selectedLevel() === item.level) {
                    <span class="mat-icon text-sm font-bold">check</span>
                  }
                </div>
              </div>

            </button>
          }
        </div>

        <!-- MANUAL CONFIRMATION SWITCH (CRITICAL PIECE) -->
        <div class="p-5 rounded-xl bg-[#131317] border border-slate-800 space-y-3 mb-8 text-left">
          <div class="flex items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="mat-icon text-emerald-400 text-base">touch_app</span>
                <span class="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Confirmation manuelle avant exécution
                </span>
                <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-mono font-bold">
                  RECOMMANDÉ
                </span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                Lorsque cette option est activée, aucune position ne peut être prise sans votre validation explicite d'un simple clic sur le terminal.
              </p>
            </div>

            <!-- Toggle Switch -->
            <button
              type="button"
              (click)="toggleManualConfirmation()"
              class="w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              [class.bg-emerald-500]="manualConfirmation()"
              [class.bg-slate-700]="!manualConfirmation()"
              [attr.aria-checked]="manualConfirmation()"
              role="switch">
              <span
                class="w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-out shadow-md"
                [class.translate-x-6]="manualConfirmation()"
                [class.translate-x-0]="!manualConfirmation()">
              </span>
            </button>
          </div>
        </div>

        <!-- VISUAL DECISION PIPELINE -->
        <div class="p-4 rounded-xl bg-[#101014] border border-slate-800/80 mb-8 text-left space-y-2">
          <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Pipeline de décision garanti
          </div>
          
          <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-300">
            <span class="px-2 py-1 bg-[#181820] rounded border border-slate-800 text-slate-300">1. ANALYSE DU MARCHÉ</span>
            <span class="text-emerald-500">→</span>
            <span class="px-2 py-1 bg-[#181820] rounded border border-slate-800 text-slate-300">2. SIGNAL VALIDÉ</span>
            <span class="text-emerald-500">→</span>
            <span class="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/30 text-emerald-300 font-bold">3. VOS RÈGLES DE RISQUE</span>
            <span class="text-emerald-500">→</span>
            <span class="px-2 py-1 bg-[#181820] rounded border border-slate-800 text-slate-300">4. RISK ENGINE</span>
            <span class="text-emerald-500">→</span>
            <span class="px-2 py-1 bg-[#181820] rounded border border-slate-800 text-slate-300">5. CONFIRMATION</span>
            <span class="text-emerald-500">→</span>
            <span class="px-2 py-1 bg-slate-800 rounded text-slate-400">6. EXÉCUTION BROKER</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            (click)="goBack()"
            class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            ← Étape précédente
          </button>

          <app-button
            variant="primary"
            size="lg"
            (btnClick)="continue()">
            Finaliser la configuration →
          </app-button>
        </div>

      </div>

    </div>
  `,
  styles: `
    .bg-emerald-500-08 {
      background-color: rgba(16, 185, 129, 0.06);
    }
    .border-emerald-500-50 {
      border-color: rgba(16, 185, 129, 0.5);
    }
    .bg-emerald-500-20 {
      background-color: rgba(16, 185, 129, 0.15);
    }
    .bg-amber-500-15 {
      background-color: rgba(245, 158, 11, 0.12);
    }
  `
})
export class OnboardingAutomationComponent {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  levels = AUTOMATION_LEVELS;

  selectedLevel = computed(() => {
    return this.onboardingService.automationPreferences().selectedLevel;
  });

  manualConfirmation = computed(() => {
    return this.onboardingService.automationPreferences().manualConfirmationRequired;
  });

  selectLevel(level: AutomationLevel) {
    this.onboardingService.setAutomationPreferences({ selectedLevel: level });
  }

  toggleManualConfirmation() {
    this.onboardingService.setAutomationPreferences({
      manualConfirmationRequired: !this.manualConfirmation()
    });
  }

  goBack() {
    this.router.navigate(['/onboarding/trading-accounts']);
  }

  continue() {
    this.onboardingService.setStep(6);
    this.router.navigate(['/onboarding/complete']);
  }
}
