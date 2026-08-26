import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-signals-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto text-left">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">psychology</span>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Signaux & Algorithmes IA</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Recommandations de trading générées par convergence multi-piliers (Technique, Macro, News, IA).
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            {{ dashboardService.signals().length }} SIGNAUX DÉTECTÉS
          </span>
        </div>
      </div>

      <!-- Signals Detailed Feed -->
      <div class="space-y-4">
        @for (sig of dashboardService.signals(); track sig.id) {
          <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-lg font-black font-mono text-white">{{ sig.symbol }}</span>
                <span 
                  class="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase"
                  [class.bg-emerald-500/20]="sig.direction === 'BUY'"
                  [class.text-emerald-400]="sig.direction === 'BUY'"
                  [class.bg-rose-500/20]="sig.direction === 'SELL'"
                  [class.text-rose-400]="sig.direction === 'SELL'">
                  {{ sig.direction }} ({{ sig.timeframe }})
                </span>
                <span class="text-xs font-mono text-slate-400">{{ sig.timestamp }}</span>
              </div>
              <span class="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                Score : {{ sig.alignmentScore }}%
              </span>
            </div>

            <p class="text-xs text-slate-300">
              {{ sig.confluence.technical.detail }}
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#141419] border border-slate-800/80 text-xs font-mono">
              <div>
                <span class="text-slate-400 text-[10px]">Entrée conseillée</span>
                <div class="text-white font-bold">{{ sig.entryPrice }}</div>
              </div>
              <div>
                <span class="text-slate-400 text-[10px]">Stop Loss</span>
                <div class="text-rose-400 font-bold">{{ sig.stopLoss }}</div>
              </div>
              <div>
                <span class="text-slate-400 text-[10px]">Take Profit</span>
                <div class="text-emerald-400 font-bold">{{ sig.takeProfit }}</div>
              </div>
              <div>
                <span class="text-slate-400 text-[10px]">Ratio R:R</span>
                <div class="text-cyan-400 font-bold">{{ sig.riskRewardRatio }}</div>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="text-center pt-4">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>
    </div>
  `
})
export class SignalsComponent {
  dashboardService = inject(DashboardService);
}
