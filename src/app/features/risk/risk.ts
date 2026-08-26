import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OnboardingService } from '../../core/services/onboarding.service';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-risk-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto text-left">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">shield</span>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Gestion du Risque & Coupe-Circuit</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Paramètres de protection du capital, disjoncteur journalier et limites par transaction.
          </p>
        </div>
        <a 
          routerLink="/app/settings"
          [queryParams]="{ tab: 'risk' }"
          class="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
          Modifier les règles
        </a>
      </div>

      <!-- Risk Matrix Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Risque max par trade</div>
          <div class="text-3xl font-black font-mono text-emerald-400">{{ riskPrefs().maxRiskPerTradePct }}%</div>
          <p class="text-[11px] text-slate-400">Dimensionnement automatique des lots</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Perte max par jour</div>
          <div class="text-3xl font-black font-mono text-cyan-400">{{ riskPrefs().maxDailyLossPct }}%</div>
          <p class="text-[11px] text-slate-400">Verrouillage automatique en cas d'atteinte</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Positions simultanées max</div>
          <div class="text-3xl font-black font-mono text-white">{{ riskPrefs().maxOpenPositions }}</div>
          <p class="text-[11px] text-slate-400">Plafond d'ordres ouverts en parallèle</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Exposition simultanée max</div>
          <div class="text-3xl font-black font-mono text-indigo-400">{{ riskPrefs().maxSimultaneousExposurePct }}%</div>
          <p class="text-[11px] text-slate-400">Garde-fou cumulatif de portefeuille</p>
        </div>
      </div>

      <!-- Circuit Breaker Status Banner -->
      <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <span class="mat-icon text-xl">verified</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Disjoncteur Algorithmique (Hard Stop)</h3>
              <p class="text-xs text-slate-400">Protection active en temps réel au niveau de la passerelle MT5</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            STATUT : NORMAL / SÉCURISÉ
          </span>
        </div>
      </div>

      <div class="text-center pt-4">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>
    </div>
  `
})
export class RiskComponent {
  onboardingService = inject(OnboardingService);
  dashboardService = inject(DashboardService);

  riskPrefs = computed(() => this.onboardingService.riskPreferences());
}
