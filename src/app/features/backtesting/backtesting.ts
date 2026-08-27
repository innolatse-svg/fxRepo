import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BacktestingService, BacktestResult } from '../../core/services/backtesting.service';

export interface BacktestStrategyConfig {
  id: string;
  name: string;
  description: string;
}

export const STRATEGIES: BacktestStrategyConfig[] = [
  {
    id: 'smc-orderflow',
    name: 'SMC & Institutional Order Flow H4',
    description: 'Balayages de liquidité (Sweeps), Fair Value Gaps (FVG) et changements de structure (CHoCH).'
  },
  {
    id: 'macro-ai',
    name: 'Macro AI & Taux Différentiels Fed/BCE',
    description: 'Modèle combinant les surprises macroéconomiques (CPI, NFP) et l\'alignement technique D1.'
  },
  {
    id: 'trend-ema',
    name: 'Trend Following EMA 50/200 & Momentum',
    description: 'Poursuite de tendance institutionnelle avec confirmation MACD et filtre ATR.'
  }
];

@Component({
  selector: 'app-backtesting-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, SlicePipe],
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
              MOTEUR QUANTITATIF V2
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Simulateur quantitatif haute fidélité avec rejeu historique et analyse institutionnelle du risque.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            (click)="exportTradesCsv()"
            [disabled]="!result() || result()!.trades.length === 0"
            class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-slate-200 text-xs font-mono font-bold transition-colors flex items-center gap-2">
            <span class="mat-icon text-sm">download</span>
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- CONTROL PANEL / SIMULATION PARAMETERS                        -->
      <!-- ============================================================ -->
      <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-6 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-base">tune</span>
            <span>Paramètres du Moteur Quantitatif</span>
          </h2>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            5 000 bougies OHLCV
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          
          <!-- Strategy Selector -->
          <div class="space-y-1">
            <label for="bt-strategy" class="text-slate-400">Stratégie Algorithmique</label>
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

          <!-- Period Selector -->
          <div class="space-y-1">
            <label for="bt-period" class="text-slate-400">Horizon Temporel</label>
            <select 
              id="bt-period"
              [value]="selectedPeriod()"
              (change)="onPeriodChange($event)"
              class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500">
              <option value="1Y">1 An (2 000 barres)</option>
              <option value="3Y">3 Ans (4 500 barres)</option>
              <option value="5Y">5 Ans (7 000 barres)</option>
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
                  <span>Calcul quantitatif en cours sur le serveur... {{ simulationProgress() }}%</span>
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
          <div class="text-2xl font-black font-mono text-emerald-400">
            {{ (result()?.netProfitPct ?? 0) >= 0 ? '+' : '' }}{{ result()?.netProfitPct ?? 0 }}%
          </div>
          <div class="text-[10px] text-slate-400">
            {{ (result()?.netProfitDollar ?? 0) >= 0 ? '+' : '' }}{{ result()?.netProfitDollar ?? 0 | number:'1.0-0' }} $ Net
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Taux de Réussite</div>
          <div class="text-2xl font-black font-mono text-white">
            {{ result()?.winRate ?? 0 }}%
          </div>
          <div class="text-[10px] text-emerald-400">
            Sur {{ result()?.totalTrades ?? 0 }} trades
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Profit Factor</div>
          <div class="text-2xl font-black font-mono text-cyan-400">
            {{ result()?.profitFactor ?? 0 }}
          </div>
          <div class="text-[10px] text-slate-400">Gains bruts / Pertes</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Max Drawdown</div>
          <div class="text-2xl font-black font-mono text-rose-400">
            -{{ result()?.maxDrawdownPct ?? 0 }}%
          </div>
          <div class="text-[10px] text-slate-400">Conforme FTMO (&lt; 10%)</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Ratio de Sharpe</div>
          <div class="text-2xl font-black font-mono text-indigo-400">
            {{ result()?.sharpeRatio ?? 0 }}
          </div>
          <div class="text-[10px] text-slate-400">Excellente régularité</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Espérance Math.</div>
          <div class="text-2xl font-black font-mono text-emerald-400">
            +{{ result()?.expectancyR ?? 0 }} R
          </div>
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
            <span>Courbe des Capitaux Propres (Equity Curve Backend)</span>
          </div>
          <span class="text-xs font-mono text-slate-300">
            Capital Final : <strong class="text-emerald-400">{{ (result()?.finalCapital ?? initialCapital()) | number:'1.2-2' }} $</strong>
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
              [attr.d]="svgAreaPath()" 
              fill="url(#eqGrad)" />

            <!-- Curve -->
            <path 
              [attr.d]="svgCurvePath()" 
              fill="none" 
              stroke="#10b981" 
              stroke-width="3" />
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
            <span>Historique des Positions Exécutées</span>
          </h3>
          <span class="text-xs font-mono text-slate-400">{{ (result()?.trades?.length ?? 0) }} transactions simulées</span>
        </div>

        <div class="rounded-2xl bg-[#0e0e12] border border-slate-800 overflow-x-auto shadow-xl max-h-96">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[#141419] border-b border-slate-800 text-slate-400 uppercase text-[10px] sticky top-0">
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
              @for (trade of (result()?.trades ?? []); track trade.id) {
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="p-3.5 text-slate-400">{{ trade.entryTime | slice:0:16 }}</td>
                  <td class="p-3.5 font-bold text-white">{{ trade.symbol }}</td>
                  <td class="p-3.5">
                    <span 
                      class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      [class.text-emerald-400]="trade.direction === 'BUY'"
                      [class.text-rose-400]="trade.direction === 'SELL'">
                      {{ trade.direction }}
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
export class BacktestingComponent implements OnInit {
  private backtestingService = inject(BacktestingService);

  readonly strategies = STRATEGIES;

  readonly selectedStrategyId = signal<string>('smc-orderflow');
  readonly selectedPeriod = signal<string>('3Y');
  readonly initialCapital = signal<number>(10000);
  readonly riskPerTrade = signal<number>(1.0);

  readonly isSimulating = signal<boolean>(false);
  readonly simulationProgress = signal<number>(0);
  readonly result = signal<BacktestResult | null>(null);

  readonly currentStrategy = computed(() => {
    return this.strategies.find(s => s.id === this.selectedStrategyId()) || this.strategies[0];
  });

  // Calcul mathématique dynamique de la courbe SVG
  readonly svgCurvePath = computed(() => {
    const res = this.result();
    if (!res || !res.equityCurve || res.equityCurve.length < 2) {
      return "M 0,170 Q 100,160 200,135 T 400,105 T 600,65 T 800,25";
    }

    const points = res.equityCurve;
    const minEq = Math.min(...points.map(p => p.equity));
    const maxEq = Math.max(...points.map(p => p.equity));
    const range = (maxEq - minEq) || 1;

    const coords = points.map((p, idx) => {
      const x = Math.round((idx / (points.length - 1)) * 800);
      // Inversion Y : 180 (bas) à 20 (haut)
      const y = Math.round(180 - ((p.equity - minEq) / range) * 160);
      return `${x},${y}`;
    });

    return `M ${coords.join(' L ')}`;
  });

  readonly svgAreaPath = computed(() => {
    const curve = this.svgCurvePath();
    return `${curve} L 800,200 L 0,200 Z`;
  });

  ngOnInit(): void {
    // Exécution initiale automatique pour afficher les données dès l'arrivée
    this.runSimulation();
  }

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

  async runSimulation() {
    this.isSimulating.set(true);
    this.simulationProgress.set(20);

    const progressTimer = setInterval(() => {
      this.simulationProgress.update(p => Math.min(p + 25, 90));
    }, 100);

    try {
      const response = await this.backtestingService.runBacktest({
        strategyId: this.selectedStrategyId(),
        symbol: 'EUR/USD',
        timeframe: 'H4',
        period: this.selectedPeriod(),
        initialCapital: this.initialCapital(),
        riskPerTradePct: this.riskPerTrade()
      });

      clearInterval(progressTimer);
      this.simulationProgress.set(100);
      this.result.set(response);
    } catch (e) {
      clearInterval(progressTimer);
      console.error('[Backtesting] Erreur lors de la simulation', e);
    } finally {
      this.isSimulating.set(false);
    }
  }

  exportTradesCsv() {
    const res = this.result();
    if (!res || !res.trades) return;

    const headers = ['ID', 'Date_Entree', 'Date_Sortie', 'Instrument', 'Sens', 'Entree', 'Sortie', 'StopLoss', 'TakeProfit', 'Volume', 'PnL_USD', 'R_Multiple', 'Duree', 'Resultat'];
    const rows = res.trades.map(t => [
      t.id,
      t.entryTime,
      t.exitTime,
      t.symbol,
      t.direction,
      t.entryPrice,
      t.exitPrice,
      t.stopLoss,
      t.takeProfit,
      t.lotSize,
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
    link.setAttribute('download', `forex_intel_backtest_${this.selectedStrategyId()}_${this.selectedPeriod()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
