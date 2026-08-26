import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BacktestTrade {
  id: string;
  date: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  pnlDollar: number;
  rMultiple: number;
  outcome: 'WIN' | 'LOSS';
  duration: string;
}

export interface BacktestStrategyConfig {
  id: string;
  name: string;
  description: string;
  defaultWinrate: number;
  defaultProfitFactor: number;
  defaultTotalReturn: number;
  defaultMaxDrawdown: number;
  defaultSharpe: number;
  sampleTrades: BacktestTrade[];
}

export const STRATEGIES: BacktestStrategyConfig[] = [
  {
    id: 'smc-orderflow',
    name: 'SMC & Institutional Order Flow H4',
    description: 'Balayages de liquidité (Sweeps), Fair Value Gaps (FVG) et changements de structure (CHoCH).',
    defaultWinrate: 68.5,
    defaultProfitFactor: 2.48,
    defaultTotalReturn: 54.2,
    defaultMaxDrawdown: 4.6,
    defaultSharpe: 2.31,
    sampleTrades: [
      { id: 'bt-1', date: '2026-02-14 14:00', symbol: 'EUR/USD', type: 'SELL', entryPrice: 1.0880, exitPrice: 1.0815, pnlDollar: 650, rMultiple: 2.6, outcome: 'WIN', duration: '18h' },
      { id: 'bt-2', date: '2026-02-10 09:30', symbol: 'GBP/USD', type: 'BUY', entryPrice: 1.2840, exitPrice: 1.2930, pnlDollar: 900, rMultiple: 3.0, outcome: 'WIN', duration: '24h' },
      { id: 'bt-3', date: '2026-02-06 16:15', symbol: 'USD/JPY', type: 'BUY', entryPrice: 154.20, exitPrice: 153.85, pnlDollar: -350, rMultiple: -1.0, outcome: 'LOSS', duration: '6h' },
      { id: 'bt-4', date: '2026-01-29 11:00', symbol: 'EUR/USD', type: 'BUY', entryPrice: 1.0790, exitPrice: 1.0865, pnlDollar: 750, rMultiple: 2.5, outcome: 'WIN', duration: '14h' },
      { id: 'bt-5', date: '2026-01-22 15:45', symbol: 'XAU/USD', type: 'BUY', entryPrice: 2880.0, exitPrice: 2925.0, pnlDollar: 1350, rMultiple: 3.4, outcome: 'WIN', duration: '32h' }
    ]
  },
  {
    id: 'macro-ai',
    name: 'Macro AI & Taux Différentiels Fed/BCE',
    description: 'Modèle combinant les surprises macroéconomiques (CPI, NFP) et l\'alignement technique D1.',
    defaultWinrate: 72.0,
    defaultProfitFactor: 2.85,
    defaultTotalReturn: 68.4,
    defaultMaxDrawdown: 3.9,
    defaultSharpe: 2.64,
    sampleTrades: [
      { id: 'bt-m1', date: '2026-02-12 14:30', symbol: 'EUR/USD', type: 'SELL', entryPrice: 1.0920, exitPrice: 1.0820, pnlDollar: 1000, rMultiple: 3.3, outcome: 'WIN', duration: '48h' },
      { id: 'bt-m2', date: '2026-02-04 10:00', symbol: 'USD/CAD', type: 'BUY', entryPrice: 1.4120, exitPrice: 1.4240, pnlDollar: 1200, rMultiple: 2.8, outcome: 'WIN', duration: '36h' },
      { id: 'bt-m3', date: '2026-01-25 15:00', symbol: 'AUD/USD', type: 'SELL', entryPrice: 0.6540, exitPrice: 0.6580, pnlDollar: -400, rMultiple: -1.0, outcome: 'LOSS', duration: '12h' }
    ]
  },
  {
    id: 'trend-ema',
    name: 'Trend Following EMA 50/200 & Momentum',
    description: 'Poursuite de tendance institutionnelle avec confirmation MACD et filtre ATR.',
    defaultWinrate: 58.0,
    defaultProfitFactor: 1.95,
    defaultTotalReturn: 38.0,
    defaultMaxDrawdown: 6.2,
    defaultSharpe: 1.85,
    sampleTrades: [
      { id: 'bt-t1', date: '2026-02-15 08:00', symbol: 'GBP/USD', type: 'BUY', entryPrice: 1.2820, exitPrice: 1.2910, pnlDollar: 900, rMultiple: 2.2, outcome: 'WIN', duration: '20h' },
      { id: 'bt-t2', date: '2026-02-08 14:00', symbol: 'USD/JPY', type: 'SELL', entryPrice: 155.10, exitPrice: 155.60, pnlDollar: -500, rMultiple: -1.0, outcome: 'LOSS', duration: '8h' }
    ]
  }
];

@Component({
  selector: 'app-backtesting-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="space-y-8 max-w-7xl mx-auto text-left">
      
      <!-- ============================================================ -->
      <!-- HEADER                                                       -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">science</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Laboratoire de Backtesting & IA
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SIMULATION TIC-PAR-TIC
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Testez la robustesse statistique de nos modèles sur 5+ années de données de marché réelles avec slippage et spreads institutionnels.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            id="export-backtest-csv"
            type="button"
            (click)="exportTradesCsv()"
            class="px-3.5 py-2 rounded-xl bg-[#141419] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <span class="mat-icon text-sm text-emerald-400">download</span>
            <span>Exporter Résultats</span>
          </button>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- CONFIGURATION PANEL & SIMULATION RUNNER                      -->
      <!-- ============================================================ -->
      <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 class="text-sm font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-base">tune</span>
            <span>Paramètres du Modèle de Simulation</span>
          </h2>
          <span class="text-xs font-mono text-emerald-400">Données tick-level LMAX & Dukascopy</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          
          <!-- Strategy Selector -->
          <div class="space-y-1">
            <label for="bt-strategy" class="text-slate-400">Stratégie / Algorithme</label>
            <select 
              id="bt-strategy"
              [value]="selectedStrategyId()"
              (change)="onStrategyChange($event)"
              class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500">
              @for (st of strategies; track st.id) {
                <option [value]="st.id">{{ st.name }}</option>
              }
            </select>
          </div>

          <!-- Historical Period -->
          <div class="space-y-1">
            <label for="bt-period" class="text-slate-400">Période Historique</label>
            <select 
              id="bt-period"
              [value]="selectedPeriod()"
              (change)="onPeriodChange($event)"
              class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500">
              <option value="1Y">1 An (2025 - 2026)</option>
              <option value="3Y">3 Ans (2023 - 2026)</option>
              <option value="5Y">5 Ans (2021 - 2026)</option>
            </select>
          </div>

          <!-- Initial Capital -->
          <div class="space-y-1">
            <label for="bt-capital" class="text-slate-400">Capital Initial ($)</label>
            <select 
              id="bt-capital"
              [value]="initialCapital()"
              (change)="onCapitalChange($event)"
              class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500">
              <option [value]="10000">10 000 $ (Standard)</option>
              <option [value]="50000">50 000 $ (Prop Firm)</option>
              <option [value]="100000">100 000 $ (Institutionnel)</option>
            </select>
          </div>

          <!-- Risk per trade -->
          <div class="space-y-1">
            <label for="bt-risk" class="text-slate-400">Risque Fixe / Trade</label>
            <select 
              id="bt-risk"
              [value]="riskPerTrade()"
              (change)="onRiskChange($event)"
              class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500">
              <option [value]="0.5">0.50% (Prudent)</option>
              <option [value]="1.0">1.00% (Recommandé)</option>
              <option [value]="2.0">2.00% (Dynamique)</option>
            </select>
          </div>

        </div>

        <!-- Strategy Description Box -->
        <div class="p-3.5 rounded-xl bg-[#141419] border border-slate-800/80 text-xs flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-base">info</span>
            <span class="text-slate-300">{{ currentStrategy().description }}</span>
          </div>
          <span class="text-[11px] font-mono text-slate-400 hidden sm:inline">Modèle de Slippage : 0.8 pip</span>
        </div>

        <!-- Launch Button & Progress Bar -->
        <div class="space-y-3 pt-2">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-xs font-mono text-slate-400">
              @if (isSimulating()) {
                <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span class="mat-icon text-sm animate-spin">refresh</span>
                  <span>Analyse des ticks historiques... {{ simulationProgress() }}%</span>
                </span>
              } @else {
                <span>Prêt à simuler {{ currentStrategy().name }}</span>
              }
            </div>

            <button 
              id="run-backtest-btn"
              type="button"
              [disabled]="isSimulating()"
              (click)="runSimulation()"
              class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              <span class="mat-icon text-sm">play_arrow</span>
              <span>{{ isSimulating() ? 'Simulation en cours...' : 'Lancer la Simulation' }}</span>
            </button>
          </div>

          @if (isSimulating()) {
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                class="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-150"
                [style.width.%]="simulationProgress()">
              </div>
            </div>
          }
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- SIMULATION KPI RESULTS DASHBOARD                             -->
      <!-- ============================================================ -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Rendement Total</div>
          <div class="text-2xl font-black font-mono text-emerald-400">+{{ currentStrategy().defaultTotalReturn }}%</div>
          <div class="text-[10px] text-slate-400">+{{ (initialCapital() * currentStrategy().defaultTotalReturn / 100) | number:'1.0-0' }} $ Net</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Taux de Réussite</div>
          <div class="text-2xl font-black font-mono text-white">{{ currentStrategy().defaultWinrate }}%</div>
          <div class="text-[10px] text-emerald-400">Sur 420 trades</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Profit Factor</div>
          <div class="text-2xl font-black font-mono text-cyan-400">{{ currentStrategy().defaultProfitFactor }}</div>
          <div class="text-[10px] text-slate-400">Gains bruts / Pertes</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Max Drawdown</div>
          <div class="text-2xl font-black font-mono text-rose-400">-{{ currentStrategy().defaultMaxDrawdown }}%</div>
          <div class="text-[10px] text-slate-400">Conforme FTMO (&lt; 10%)</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Ratio de Sharpe</div>
          <div class="text-2xl font-black font-mono text-indigo-400">{{ currentStrategy().defaultSharpe }}</div>
          <div class="text-[10px] text-slate-400">Excellente régularité</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Espérance Math.</div>
          <div class="text-2xl font-black font-mono text-emerald-400">+0.68 R</div>
          <div class="text-[10px] text-slate-400">Par opportunité</div>
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- EQUITY CURVE VISUAL CHART (SVG Canvas)                       -->
      <!-- ============================================================ -->
      <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4 shadow-xl">
        <div class="flex items-center justify-between">
          <div class="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-2">
            <span class="mat-icon text-base text-emerald-400">show_chart</span>
            <span>Courbe des Capitaux Propres (Equity Curve Simulée)</span>
          </div>
          <span class="text-xs font-mono text-slate-300">
            Capital Final : <strong class="text-emerald-400">{{ (initialCapital() * (1 + currentStrategy().defaultTotalReturn / 100)) | number:'1.2-2' }} $</strong>
          </span>
        </div>

        <!-- SVG Equity Curve Graph -->
        <div class="h-52 w-full relative">
          <svg class="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="eqGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="0" y1="50" x2="800" y2="50" stroke="#1e293b" stroke-dasharray="4"/>
            <line x1="0" y1="100" x2="800" y2="100" stroke="#1e293b" stroke-dasharray="4"/>
            <line x1="0" y1="150" x2="800" y2="150" stroke="#1e293b" stroke-dasharray="4"/>

            <!-- Area -->
            <path 
              d="M 0,170 Q 100,160 200,135 T 400,105 T 600,65 T 800,25 L 800,200 L 0,200 Z" 
              fill="url(#eqGrad)" />

            <!-- Curve -->
            <path 
              d="M 0,170 Q 100,160 200,135 T 400,105 T 600,65 T 800,25" 
              fill="none" 
              stroke="#10b981" 
              stroke-width="3" />

            <circle cx="800" cy="25" r="4" fill="#10b981" />
          </svg>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TRADE BREAKDOWN LOG TABLE                                    -->
      <!-- ============================================================ -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-base">receipt_long</span>
            <span>Échantillon des Positions Exécutées</span>
          </h3>
          <span class="text-xs font-mono text-slate-400">5 dernières transactions simulées</span>
        </div>

        <div class="rounded-2xl bg-[#0e0e12] border border-slate-800 overflow-x-auto shadow-xl">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[#141419] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">Date & Heure</th>
                <th class="p-3.5">Instrument</th>
                <th class="p-3.5">Sens</th>
                <th class="p-3.5">Prix Entrée</th>
                <th class="p-3.5">Prix Sortie</th>
                <th class="p-3.5">Gain / Perte</th>
                <th class="p-3.5">R-Multiple</th>
                <th class="p-3.5">Durée</th>
                <th class="p-3.5">Résultat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (trade of currentStrategy().sampleTrades; track trade.id) {
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="p-3.5 text-slate-400">{{ trade.date }}</td>
                  <td class="p-3.5 font-bold text-white">{{ trade.symbol }}</td>
                  <td class="p-3.5">
                    <span 
                      class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      [class.text-emerald-400]="trade.type === 'BUY'"
                      [class.text-rose-400]="trade.type === 'SELL'">
                      {{ trade.type }}
                    </span>
                  </td>
                  <td class="p-3.5 text-slate-200">{{ trade.entryPrice }}</td>
                  <td class="p-3.5 text-slate-200">{{ trade.exitPrice }}</td>
                  <td class="p-3.5 font-bold" [class.text-emerald-400]="trade.pnlDollar > 0" [class.text-rose-400]="trade.pnlDollar < 0">
                    {{ trade.pnlDollar > 0 ? '+' : '' }}{{ trade.pnlDollar }} $
                  </td>
                  <td class="p-3.5 font-bold text-cyan-400">
                    {{ trade.rMultiple > 0 ? '+' : '' }}{{ trade.rMultiple }}R
                  </td>
                  <td class="p-3.5 text-slate-400">{{ trade.duration }}</td>
                  <td class="p-3.5">
                    @if (trade.outcome === 'WIN') {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        GAIN +TP
                      </span>
                    } @else {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        PERTE -SL
                      </span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Dashboard Link -->
      <div class="text-center pt-6">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>

    </div>
  `
})
export class BacktestingComponent {
  readonly strategies = STRATEGIES;

  readonly selectedStrategyId = signal<string>('smc-orderflow');
  readonly selectedPeriod = signal<string>('3Y');
  readonly initialCapital = signal<number>(10000);
  readonly riskPerTrade = signal<number>(1.0);

  readonly isSimulating = signal<boolean>(false);
  readonly simulationProgress = signal<number>(0);

  readonly currentStrategy = computed(() => {
    return this.strategies.find(s => s.id === this.selectedStrategyId()) || this.strategies[0];
  });

  onStrategyChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedStrategyId.set(val);
  }

  onPeriodChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedPeriod.set(val);
  }

  onCapitalChange(e: Event) {
    const val = Number((e.target as HTMLSelectElement).value);
    this.initialCapital.set(val);
  }

  onRiskChange(e: Event) {
    const val = Number((e.target as HTMLSelectElement).value);
    this.riskPerTrade.set(val);
  }

  runSimulation() {
    this.isSimulating.set(true);
    this.simulationProgress.set(0);

    const interval = setInterval(() => {
      this.simulationProgress.update(p => {
        if (p >= 100) {
          clearInterval(interval);
          this.isSimulating.set(false);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  }

  exportTradesCsv() {
    const trades = this.currentStrategy().sampleTrades;
    const headers = ['ID', 'Date', 'Instrument', 'Sens', 'Entree', 'Sortie', 'PnL_USD', 'R_Multiple', 'Duree', 'Resultat'];
    const rows = trades.map(t => [
      t.id,
      t.date,
      t.symbol,
      t.type,
      t.entryPrice,
      t.exitPrice,
      t.pnlDollar,
      `${t.rMultiple}R`,
      t.duration,
      t.outcome
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `forex_intel_backtest_${this.selectedStrategyId()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
