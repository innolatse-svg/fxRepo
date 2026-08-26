import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-backtesting-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto text-left">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">science</span>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Laboratoire de Backtesting</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Simulation de stratégies multi-facteurs sur données historiques Forex (5 ans de ticks M1/M15).
          </p>
        </div>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Stratégie par défaut</div>
          <div class="text-lg font-bold text-white">Trend Confluence v2.4</div>
          <p class="text-[11px] text-emerald-400">Winrate historique : 68.4%</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Profit Factor moyen</div>
          <div class="text-lg font-bold font-mono text-cyan-400">2.14</div>
          <p class="text-[11px] text-slate-400">Sur 2 400+ transactions</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Max Drawdown</div>
          <div class="text-lg font-bold font-mono text-indigo-400">4.8%</div>
          <p class="text-[11px] text-slate-400">Conforme aux règles de prop firm</p>
        </div>
      </div>

      <div class="p-8 rounded-2xl bg-[#0e0e12] border border-slate-800 text-center space-y-3">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
          <span class="mat-icon text-2xl">tune</span>
        </div>
        <h3 class="text-base font-bold text-white">Moteur de Monte Carlo & Optimisation</h3>
        <p class="text-xs text-slate-400 max-w-md mx-auto">
          Le configurateur de tests personnalisés avec export CSV/PDF est disponible dans ce module.
        </p>
        <a routerLink="/app/dashboard" class="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline pt-2">
          ← Retourner au Dashboard principal
        </a>
      </div>
    </div>
  `
})
export class BacktestingComponent {}
