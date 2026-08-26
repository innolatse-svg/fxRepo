import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-onboarding-risk-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-4">
      
      <!-- Main Card -->
      <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        <!-- Top Glow Accent -->
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <!-- Header -->
        <div class="space-y-2 text-left mb-8">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <span>Étape 3 &bull; Moteur de Contrôle de Risque</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Définissez vos règles de risque
          </h1>
          
          <p class="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Vos règles constituent les limites infranchissables que le système et le moteur d'exécution devront respecter en permanence.
          </p>
        </div>

        <!-- Risk Form -->
        <form [formGroup]="riskForm" class="space-y-6 text-left">
          
          <!-- GRID OF RISK PARAMETERS -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- 1. RISQUE MAX PAR TRADE -->
            <div class="p-5 rounded-xl bg-[#121216] border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label for="risk-per-trade" class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Risque max. par trade
                </label>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                  {{ riskForm.get('maxRiskPerTradePct')?.value }} %
                </span>
              </div>

              <!-- Quick Presets -->
              <div class="flex items-center gap-2">
                @for (preset of [0.5, 1.0, 1.5, 2.0]; track preset) {
                  <button
                    type="button"
                    (click)="setPreset('maxRiskPerTradePct', preset)"
                    class="px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors"
                    [class.bg-emerald-500]="riskForm.get('maxRiskPerTradePct')?.value === preset"
                    [class.text-black]="riskForm.get('maxRiskPerTradePct')?.value === preset"
                    [class.bg-[#191920]]="riskForm.get('maxRiskPerTradePct')?.value !== preset"
                    [class.text-slate-300]="riskForm.get('maxRiskPerTradePct')?.value !== preset">
                    {{ preset }}%
                  </button>
                }
              </div>

              <!-- Slider Input -->
              <input
                id="risk-per-trade"
                type="range"
                min="0.25"
                max="3.0"
                step="0.25"
                formControlName="maxRiskPerTradePct"
                class="w-full accent-emerald-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
              />

              <p class="text-[11px] text-slate-400 leading-snug">
                Le Risk Engine calculera la taille de lot exacte selon la distance de Stop Loss pour ne jamais excéder ce pourcentage de capital.
              </p>
            </div>

            <!-- 2. PERTE MAXIMALE QUOTIDIENNE -->
            <div class="p-5 rounded-xl bg-[#121216] border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label for="max-daily-loss" class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Perte maximale quotidienne
                </label>
                <span class="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
                  {{ riskForm.get('maxDailyLossPct')?.value }} %
                </span>
              </div>

              <!-- Quick Presets -->
              <div class="flex items-center gap-2">
                @for (preset of [2.0, 3.0, 4.0, 5.0]; track preset) {
                  <button
                    type="button"
                    (click)="setPreset('maxDailyLossPct', preset)"
                    class="px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors"
                    [class.bg-cyan-500]="riskForm.get('maxDailyLossPct')?.value === preset"
                    [class.text-black]="riskForm.get('maxDailyLossPct')?.value === preset"
                    [class.bg-[#191920]]="riskForm.get('maxDailyLossPct')?.value !== preset"
                    [class.text-slate-300]="riskForm.get('maxDailyLossPct')?.value !== preset">
                    {{ preset }}%
                  </button>
                }
              </div>

              <!-- Slider Input -->
              <input
                id="max-daily-loss"
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                formControlName="maxDailyLossPct"
                class="w-full accent-cyan-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
              />

              <p class="text-[11px] text-slate-400 leading-snug">
                Verrouillage automatique : le système bloque toute nouvelle prise de position si les pertes cumulées du jour atteignent ce palier.
              </p>
            </div>

            <!-- 3. NOMBRE MAXIMAL DE POSITIONS OUVERTES -->
            <div class="p-5 rounded-xl bg-[#121216] border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label for="max-open-pos" class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Positions simultanées max.
                </label>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                  {{ riskForm.get('maxOpenPositions')?.value }} trade(s)
                </span>
              </div>

              <div class="flex items-center gap-2">
                @for (preset of [1, 2, 3, 5]; track preset) {
                  <button
                    type="button"
                    (click)="setPreset('maxOpenPositions', preset)"
                    class="px-3 py-1 rounded text-xs font-mono font-semibold transition-colors"
                    [class.bg-emerald-500]="riskForm.get('maxOpenPositions')?.value === preset"
                    [class.text-black]="riskForm.get('maxOpenPositions')?.value === preset"
                    [class.bg-[#191920]]="riskForm.get('maxOpenPositions')?.value !== preset"
                    [class.text-slate-300]="riskForm.get('maxOpenPositions')?.value !== preset">
                    {{ preset }}
                  </button>
                }
              </div>

              <input
                id="max-open-pos"
                type="range"
                min="1"
                max="8"
                step="1"
                formControlName="maxOpenPositions"
                class="w-full accent-emerald-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
              />

              <p class="text-[11px] text-slate-400 leading-snug">
                Limite le nombre d'opportunités actives simultanées pour protéger votre marge disponible et éviter la sur-exposition.
              </p>
            </div>

            <!-- 4. EXPOSITION MAXIMALE TOTALE -->
            <div class="p-5 rounded-xl bg-[#121216] border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label for="max-exposure" class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Exposition globale cumulée
                </label>
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-xs">
                  {{ riskForm.get('maxSimultaneousExposurePct')?.value }} %
                </span>
              </div>

              <div class="flex items-center gap-2">
                @for (preset of [3.0, 5.0, 6.0, 8.0]; track preset) {
                  <button
                    type="button"
                    (click)="setPreset('maxSimultaneousExposurePct', preset)"
                    class="px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors"
                    [class.bg-indigo-500]="riskForm.get('maxSimultaneousExposurePct')?.value === preset"
                    [class.text-white]="riskForm.get('maxSimultaneousExposurePct')?.value === preset"
                    [class.bg-[#191920]]="riskForm.get('maxSimultaneousExposurePct')?.value !== preset"
                    [class.text-slate-300]="riskForm.get('maxSimultaneousExposurePct')?.value !== preset">
                    {{ preset }}%
                  </button>
                }
              </div>

              <input
                id="max-exposure"
                type="range"
                min="2.0"
                max="12.0"
                step="1.0"
                formControlName="maxSimultaneousExposurePct"
                class="w-full accent-indigo-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
              />

              <p class="text-[11px] text-slate-400 leading-snug">
                Plafond absolu de risque agrégé si toutes les positions ouvertes devaient toucher simultanément leur Stop Loss.
              </p>
            </div>

          </div>

          <!-- TRUST & SAFETY ENGINE NOTICE -->
          <div class="p-4 rounded-xl bg-[#131317] border border-emerald-500/30 text-xs text-slate-300 flex items-start gap-3">
            <span class="mat-icon text-emerald-400 text-lg flex-shrink-0 mt-0.5">verified_user</span>
            <div class="space-y-1">
              <div class="font-bold text-white uppercase font-mono text-[11px]">
                Garantie de non-contournement
              </div>
              <p class="text-slate-300 leading-relaxed">
                Le moteur d'automatisation et de signaux <strong>ne contournera jamais vos règles de risque</strong>. Ces plafonds constituent une contrainte stricte appliquée avant toute validation d'ordre.
              </p>
            </div>
          </div>

        </form>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800">
          <button
            type="button"
            (click)="goBack()"
            class="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-800 bg-[#121216] sm:bg-transparent sm:border-transparent text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-center">
            ← Étape précédente
          </button>

          <app-button
            variant="primary"
            size="lg"
            (btnClick)="continue()">
            Continuer : Comptes de trading →
          </app-button>
        </div>

      </div>

    </div>
  `,
  styles: ``
})
export class OnboardingRiskManagementComponent implements OnInit {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  riskForm = new FormGroup({
    maxRiskPerTradePct: new FormControl<number>(1.0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.1), Validators.max(5.0)]
    }),
    maxDailyLossPct: new FormControl<number>(3.0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.5), Validators.max(15.0)]
    }),
    maxOpenPositions: new FormControl<number>(3, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(10)]
    }),
    maxSimultaneousExposurePct: new FormControl<number>(6.0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1.0), Validators.max(25.0)]
    })
  });

  ngOnInit() {
    this.onboardingService.setStep(3);
    const saved = this.onboardingService.riskPreferences();
    this.riskForm.patchValue({
      maxRiskPerTradePct: saved.maxRiskPerTradePct,
      maxDailyLossPct: saved.maxDailyLossPct,
      maxOpenPositions: saved.maxOpenPositions,
      maxSimultaneousExposurePct: saved.maxSimultaneousExposurePct
    });
  }

  setPreset(fieldName: keyof typeof this.riskForm.controls, val: number) {
    this.riskForm.get(fieldName)?.setValue(val);
  }

  goBack() {
    this.router.navigate(['/onboarding/trading-preferences']);
  }

  continue() {
    if (this.riskForm.invalid) return;

    const val = this.riskForm.getRawValue();
    this.onboardingService.setRiskPreferences({
      maxRiskPerTradePct: val.maxRiskPerTradePct,
      maxDailyLossPct: val.maxDailyLossPct,
      maxOpenPositions: val.maxOpenPositions,
      maxSimultaneousExposurePct: val.maxSimultaneousExposurePct
    });

    this.onboardingService.setStep(4);
    this.router.navigate(['/onboarding/trading-accounts']);
  }
}
