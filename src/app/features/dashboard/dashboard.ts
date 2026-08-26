import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { OnboardingService, AUTOMATION_LEVELS } from '../../core/services/onboarding.service';
import { MarketDemoService } from '../../core/services/market-demo.service';
import { FinancialChart } from '../../shared/components/financial-chart/financial-chart';
import { Candle } from '../../core/models/market-intelligence.model';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, FinancialChart],
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      
      <!-- ============================================================ -->
      <!-- TOP BANNER: WELCOME & ORCHESTRATION STATUS                    -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div class="space-y-1 text-left">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tableau de bord de pilotage
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ORCHESTRATION ACTIVE
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400">
            Supervision en temps réel des signaux, des règles de risque et des comptes MT5 connectés.
          </p>
        </div>

        <!-- Quick Automation Mode Badge -->
        <div class="flex items-center gap-3 self-start md:self-auto">
          <div class="px-3 py-2 rounded-xl bg-[#121217] border border-slate-800 text-left text-xs font-mono">
            <div class="text-[10px] text-slate-400">Mode d'exécution :</div>
            <div class="font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Niveau {{ autoPrefs().selectedLevel }} · {{ currentLevelName() }}</span>
            </div>
          </div>

          <a 
            routerLink="/app/settings"
            [queryParams]="{ tab: 'automation' }" 
            class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1">
            <span class="mat-icon text-sm">tune</span>
            <span class="hidden sm:inline">Ajuster</span>
          </a>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- ZONE 1 : BANDEAU DE STATUT & RISK ENGINE EN DIRECT            -->
      <!-- ============================================================ -->
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" class="sr-only">Métriques clés du Risk Engine</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Card 1: Capital & Daily Profit -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40 text-left group hover:border-slate-700 transition-colors">
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></div>
            
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span class="font-mono uppercase tracking-wider text-[11px]">Capital & Équité</span>
              <span class="mat-icon text-emerald-400 text-lg">account_balance_wallet</span>
            </div>

            <div class="text-2xl font-black font-mono text-white tracking-tight">
              {{ metrics().accountEquity | number:'1.2-2' }} $
            </div>

            <div class="mt-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Profit jour :</span>
              <span class="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +{{ metrics().dailyProfitDollar | number:'1.2-2' }} $ (+{{ metrics().dailyProfitPct | number:'1.2-2' }}%)
              </span>
            </div>
          </div>

          <!-- Card 2: Risk Exposure Gauge -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40 text-left group hover:border-slate-700 transition-colors">
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
            
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span class="font-mono uppercase tracking-wider text-[11px]">Jauge d'exposition</span>
              <span class="mat-icon text-cyan-400 text-lg">speed</span>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black font-mono text-white tracking-tight">
                {{ metrics().currentExposurePct }}%
              </span>
              <span class="text-xs font-mono text-slate-400">
                / max {{ metrics().maxExposureLimitPct }}%
              </span>
            </div>

            <!-- Visual Progress Bar -->
            <div class="mt-3 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div 
                class="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                [style.width.%]="(metrics().currentExposurePct / metrics().maxExposureLimitPct) * 100">
              </div>
            </div>

            <div class="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Risque / trade : {{ riskPrefs().maxRiskPerTradePct }}%</span>
              <span class="text-cyan-400 font-bold">Sécurisé</span>
            </div>
          </div>

          <!-- Card 3: Max Daily Loss Consumed -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40 text-left group hover:border-slate-700 transition-colors">
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent"></div>
            
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span class="font-mono uppercase tracking-wider text-[11px]">Perte Max Journalière</span>
              <span class="mat-icon text-indigo-400 text-lg">shield</span>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                {{ metrics().consumedDailyLossPct }}%
              </span>
              <span class="text-xs font-mono text-slate-400">
                / limite {{ metrics().maxDailyLossLimitPct }}%
              </span>
            </div>

            <!-- Visual Progress Bar -->
            <div class="mt-3 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div 
                class="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                [style.width.%]="(metrics().consumedDailyLossPct / metrics().maxDailyLossLimitPct) * 100">
              </div>
            </div>

            <div class="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Marge restante :</span>
              <span class="text-emerald-400 font-bold font-mono">
                {{ (metrics().maxDailyLossLimitPct - metrics().consumedDailyLossPct) | number:'1.1-1' }}%
              </span>
            </div>
          </div>

          <!-- Card 4: Open Positions & Circuit Breaker -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40 text-left group hover:border-slate-700 transition-colors">
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500 to-transparent"></div>
            
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span class="font-mono uppercase tracking-wider text-[11px]">Positions & Disjoncteur</span>
              <span class="mat-icon text-amber-400 text-lg">memory</span>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black font-mono text-white tracking-tight">
                {{ metrics().openPositionsCount }}
              </span>
              <span class="text-xs font-mono text-slate-400">
                / {{ metrics().maxPositionsLimit }} max
              </span>
            </div>

            <div class="mt-3 flex items-center justify-between text-xs">
              <span class="text-slate-400">Coupe-circuit :</span>
              @if (dashboardService.emergencyStopActive()) {
                <span class="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  ARRÊT D'URGENCE
                </span>
              } @else {
                <span class="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  NORMAL / ACTIF
                </span>
              }
            </div>

            <div class="mt-2 text-[11px] text-slate-400">
              Garde-fous hard stop inviolables
            </div>
          </div>

        </div>
      </section>

      <!-- ============================================================ -->
      <!-- ZONE 2 : WATCHLIST DYNAMIQUE (PAIRES ONBOARDING)              -->
      <!-- ============================================================ -->
      <section class="space-y-4 text-left" aria-labelledby="watchlist-heading">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="watchlist-heading" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-xl">candlestick_chart</span>
              <span>Watchlist Personnalisée (Vos Paires Autorisées)</span>
            </h2>
            <p class="text-xs text-slate-400">
              Sélectionnées lors de votre onboarding. Cliquez sur une paire pour charger son analyse technique.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-mono">
              {{ dashboardService.watchlistPairs().length }} instruments configurés
            </span>
            <a 
              routerLink="/app/settings"
              [queryParams]="{ tab: 'pairs' }"
              class="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-colors">
              + Gérer les paires
            </a>
          </div>
        </div>

        <!-- Watchlist Cards / Table Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (pair of dashboardService.watchlistPairs(); track pair.symbol) {
            <a
              [routerLink]="['/app/market', marketDemoService.getSlugFromSymbol(pair.symbol)]"
              (click)="dashboardService.selectWatchlistPair(pair.symbol)"
              class="p-4 rounded-2xl bg-[#0e0e12] border border-slate-800 hover:border-emerald-500/50 hover:bg-[#121620] hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer relative overflow-hidden group text-left w-full block hover:-translate-y-0.5"
              [class.border-emerald-500]="activeWatchlistPairSymbol() === pair.symbol"
              [class.bg-[#121620]]="activeWatchlistPairSymbol() === pair.symbol">
              
              <!-- Top Glow Bar on Hover -->
              <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <!-- Pair Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-black font-mono text-white group-hover:text-emerald-400 transition-colors">
                    {{ pair.symbol }}
                  </span>
                  @if (activeWatchlistPairSymbol() === pair.symbol) {
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  }
                </div>

                <!-- Recommendation Badge -->
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase"
                  [class.bg-emerald-500/15]="pair.recommendation === 'BUY'"
                  [class.text-emerald-400]="pair.recommendation === 'BUY'"
                  [class.border-emerald-500/30]="pair.recommendation === 'BUY'"
                  [class.bg-rose-500/15]="pair.recommendation === 'SELL'"
                  [class.text-rose-400]="pair.recommendation === 'SELL'"
                  [class.border-rose-500/30]="pair.recommendation === 'SELL'"
                  [class.bg-slate-800]="pair.recommendation === 'WAIT'"
                  [class.text-slate-300]="pair.recommendation === 'WAIT'">
                  {{ pair.recommendation }}
                </span>
              </div>

              <!-- Price & Variation -->
              <div class="flex items-baseline justify-between font-mono">
                <div class="text-lg font-bold text-white tracking-tight">
                  {{ pair.bid }}
                </div>
                <div 
                  class="text-xs font-bold flex items-center gap-0.5"
                  [class.text-emerald-400]="pair.change24h >= 0"
                  [class.text-rose-400]="pair.change24h < 0">
                  <span>{{ pair.change24h >= 0 ? '+' : '' }}{{ pair.change24h }}%</span>
                </div>
              </div>

              <!-- Technical & News Details -->
              <div class="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>
                  <span class="text-slate-400">Spread : </span>
                  <span class="text-slate-200 font-bold">{{ pair.spread }} pips</span>
                </div>
                <div>
                  <span class="text-slate-400">Biais H4 : </span>
                  <span 
                    class="font-bold"
                    [class.text-emerald-400]="pair.timeframeBias === 'BULLISH'"
                    [class.text-rose-400]="pair.timeframeBias === 'BEARISH'"
                    [class.text-slate-300]="pair.timeframeBias === 'NEUTRAL'">
                    {{ pair.timeframeBias }}
                  </span>
                </div>
              </div>

              <!-- Sparkline Indicator & Confidence -->
              <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/40">
                <span>Filtre News : 
                  <strong class="text-emerald-400">{{ pair.newsFilterStatus === 'OK' ? 'Validé' : 'Surveillance' }}</strong>
                </span>
                <span>Confiance: <strong class="text-white">{{ pair.confidence }}%</strong></span>
              </div>

              <!-- CTA Badge: Voir l'analyse ➔ -->
              <div class="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span class="flex items-center gap-1">
                  <span class="mat-icon text-xs">analytics</span>
                  <span>Ouvrir le terminal</span>
                </span>
                <span class="mat-icon text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>

            </a>
          }
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- ZONE 3 : FLUX DE SIGNAUX RÉCENTS & EXPLICABILITÉ              -->
      <!-- ============================================================ -->
      <section class="space-y-4 text-left" aria-labelledby="signals-heading">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="signals-heading" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-xl">psychology</span>
              <span>Flux de Signaux & Intelligence Explicable</span>
            </h2>
            <p class="text-xs text-slate-400">
              Détections algorithmiques multi-piliers conformes à vos paramètres de risque.
            </p>
          </div>

          <div class="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Moteur d'analyse actif</span>
          </div>
        </div>

        <!-- Signal Cards List -->
        <div class="space-y-3">
          @for (sig of dashboardService.signals(); track sig.id) {
            <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800/90 shadow-lg shadow-black/30 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <!-- Left: Signal Meta & Pair -->
              <div class="flex items-start gap-4">
                <!-- Direction Badge Icon -->
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md"
                  [class.bg-emerald-500/10]="sig.direction === 'BUY'"
                  [class.text-emerald-400]="sig.direction === 'BUY'"
                  [class.border]="true"
                  [class.border-emerald-500/30]="sig.direction === 'BUY'"
                  [class.bg-rose-500/10]="sig.direction === 'SELL'"
                  [class.text-rose-400]="sig.direction === 'SELL'"
                  [class.border-rose-500/30]="sig.direction === 'SELL'">
                  <span class="mat-icon text-2xl">{{ sig.direction === 'BUY' ? 'trending_up' : 'trending_down' }}</span>
                </div>

                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-base font-black font-mono text-white">{{ sig.symbol }}</span>
                    
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-mono font-black"
                      [class.bg-emerald-500/20]="sig.direction === 'BUY'"
                      [class.text-emerald-400]="sig.direction === 'BUY'"
                      [class.bg-rose-500/20]="sig.direction === 'SELL'"
                      [class.text-rose-400]="sig.direction === 'SELL'">
                      {{ sig.direction }} ({{ sig.timeframe }})
                    </span>

                    <span class="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold">
                      Score: {{ sig.alignmentScore }}%
                    </span>
                  </div>

                  <p class="text-xs text-slate-300 font-medium">
                    {{ sig.confluence.technical.title }}
                  </p>

                  <div class="text-[11px] text-slate-400 font-mono">
                    Détecté : {{ sig.timestamp }} &bull; Probabilité estimée : <span class="text-emerald-400 font-bold">{{ sig.confluence.ai.winrateEstimate }}%</span>
                  </div>
                </div>
              </div>

              <!-- Middle: Price Levels Grid (Entry / SL / TP / RR) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#141419] border border-slate-800/80 text-xs font-mono">
                <div>
                  <div class="text-slate-400 text-[10px]">Entrée</div>
                  <div class="font-bold text-white mt-0.5">{{ sig.entryPrice }}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Stop Loss</div>
                  <div class="font-bold text-rose-400 mt-0.5">{{ sig.stopLoss }}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Take Profit</div>
                  <div class="font-bold text-emerald-400 mt-0.5">{{ sig.takeProfit }}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Ratio R:R</div>
                  <div class="font-bold text-cyan-400 mt-0.5">{{ sig.riskRewardRatio }}</div>
                </div>
              </div>

              <!-- Right: Status & Actions -->
              <div class="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 flex-shrink-0">
                
                <!-- Status Badge -->
                @if (sig.status === 'PENDING_CONFIRMATION') {
                  <span class="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    ATTENTE CONFIRMATION
                  </span>
                } @else if (sig.status === 'EXECUTED_DEMO') {
                  <span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    EXÉCUTÉ EN DÉMO
                  </span>
                }

                <!-- Explainability Button CTA -->
                <button 
                  type="button"
                  (click)="dashboardService.openExplainabilityDrawer(sig)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700/60 shadow-sm cursor-pointer">
                  <span class="mat-icon text-base text-emerald-400">visibility</span>
                  <span>Comprendre le signal</span>
                </button>

              </div>

            </div>
          }
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- ZONE 4 : COMPTES MT5 CONNECTÉS & AUTOMATISATION              -->
      <!-- ============================================================ -->
      <section class="space-y-4 text-left" aria-labelledby="accounts-heading">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="accounts-heading" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-xl">account_balance</span>
              <span>Comptes MT5 & Exécution Contrôlée</span>
            </h2>
            <p class="text-xs text-slate-400">
              Gestionnaire de passerelle broker avec disjoncteur inviolable.
            </p>
          </div>

          <a 
            routerLink="/app/settings"
            [queryParams]="{ tab: 'accounts' }"
            class="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-colors self-start sm:self-auto">
            + Ajouter un compte MT5
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          @for (acc of onboardingService.tradingAccounts(); track acc.id) {
            <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800/90 shadow-md flex flex-col justify-between space-y-4">
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {{ acc.accountType }}
                  </span>
                  <span class="text-xs font-mono text-slate-400">Serveur: {{ acc.server }}</span>
                </div>

                <h3 class="text-base font-bold text-white">
                  {{ acc.brokerName }}
                </h3>

                <div class="text-xs font-mono text-slate-400">
                  Numéro de compte : <strong class="text-slate-200">#{{ acc.accountNumber }}</strong>
                </div>

                <div class="text-sm font-bold font-mono text-emerald-400 pt-1">
                  Solde simulé : {{ acc.balanceDemo || 10000 | number:'1.2-2' }} {{ acc.currency }}
                </div>
              </div>

              <!-- Automation Toggle Switch -->
              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div class="text-xs font-medium text-slate-300">
                  Routage automatique :
                </div>

                <button 
                  type="button"
                  (click)="toggleAccountExecution(acc.id)"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  [class.bg-emerald-500]="acc.activeForExecution"
                  [class.bg-slate-700]="!acc.activeForExecution"
                  role="switch"
                  [attr.aria-checked]="acc.activeForExecution">
                  <span 
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    [class.translate-x-5]="acc.activeForExecution"
                    [class.translate-x-0]="!acc.activeForExecution">
                  </span>
                </button>
              </div>

            </div>
          }

          <!-- Reassurance Guardrail Card -->
          <div class="p-5 rounded-2xl bg-[#0c0c10] border border-slate-800/80 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <span class="mat-icon text-xl">security</span>
              </div>
              <h3 class="text-sm font-bold text-white">
                Fonds conservés chez votre courtier
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                FOREX INTEL agit comme un copilote analytique et une passerelle de contrôle. Vos capitaux restent à 100% sécurisés chez vos brokers régulés.
              </p>
            </div>

            <div class="p-2.5 rounded-lg bg-[#141419] border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
              <span class="mat-icon text-sm">verified_user</span>
              <span>Risk Engine inviolable actif</span>
            </div>
          </div>

        </div>

      </section>

    </div>

    <!-- ============================================================ -->
    <!-- SLIDE-OVER DRAWER : SIGNAL EXPLAINABILITY (EXPLICABILITÉ)     -->
    <!-- ============================================================ -->
    @if (dashboardService.activeExplainSignal(); as sig) {
      <div class="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
        
        <!-- Backdrop -->
        <button 
          type="button"
          aria-label="Fermer le panneau explicatif"
          class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity w-full h-full border-0 cursor-default"
          (click)="dashboardService.closeExplainabilityDrawer()">
        </button>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div class="w-full sm:w-screen max-w-xl bg-[#0e0e12] border-l border-slate-800 shadow-2xl shadow-black p-4 sm:p-8 flex flex-col justify-between overflow-y-auto text-left">
            
            <!-- DRAWER HEADER -->
            <div class="space-y-6">
              
              <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    [class.bg-emerald-500/15]="sig.direction === 'BUY'"
                    [class.text-emerald-400]="sig.direction === 'BUY'"
                    [class.bg-rose-500/15]="sig.direction === 'SELL'"
                    [class.text-rose-400]="sig.direction === 'SELL'">
                    <span class="mat-icon text-xl">{{ sig.direction === 'BUY' ? 'trending_up' : 'trending_down' }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-xl font-extrabold font-mono text-white">{{ sig.symbol }}</h3>
                      <span class="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-slate-800 text-slate-300">
                        {{ sig.direction }} &bull; {{ sig.timeframe }}
                      </span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">Score de confluence globale : <strong class="text-emerald-400">{{ sig.alignmentScore }}%</strong></span>
                  </div>
                </div>

                <button 
                  type="button"
                  (click)="dashboardService.closeExplainabilityDrawer()"
                  class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <span class="mat-icon text-xl">close</span>
                </button>
              </div>

              <!-- PRICE MATRIX -->
              <div class="grid grid-cols-4 gap-2 p-3.5 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-center">
                <div>
                  <div class="text-slate-400 text-[10px]">Entrée</div>
                  <div class="font-bold text-white text-sm mt-0.5">{{ sig.entryPrice }}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Stop Loss</div>
                  <div class="font-bold text-rose-400 text-sm mt-0.5">{{ sig.stopLoss }}</div>
                  <div class="text-[10px] text-slate-400">-{{ sig.pipsRisk }} pips</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Take Profit</div>
                  <div class="font-bold text-emerald-400 text-sm mt-0.5">{{ sig.takeProfit }}</div>
                  <div class="text-[10px] text-slate-400">+{{ sig.pipsReward }} pips</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Ratio R:R</div>
                  <div class="font-bold text-cyan-400 text-sm mt-0.5">{{ sig.riskRewardRatio }}</div>
                </div>
              </div>

              <!-- VISUAL CANDLESTICK CONTEXT FOR SIGNAL -->
              <div class="p-3 rounded-xl bg-[#0B0E14] border border-slate-800/90 space-y-2">
                <div class="flex items-center justify-between text-[11px] font-mono">
                  <span class="text-slate-400 font-bold flex items-center gap-1">
                    <span class="mat-icon text-sm text-emerald-400">show_chart</span>
                    <span>Structure & Niveaux Clés ({{ sig.symbol }})</span>
                  </span>
                  <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    SL / TP / Entry alignés
                  </span>
                </div>
                <div class="h-48 w-full rounded-lg overflow-hidden border border-slate-800">
                  <app-financial-chart 
                    [symbol]="sig.symbol"
                    [candles]="getCandlesForSymbol(sig.symbol)"
                    [compact]="true"
                    [signalEntryPrice]="sig.entryPrice"
                    [signalStopLoss]="sig.stopLoss"
                    [signalTakeProfit]="sig.takeProfit">
                  </app-financial-chart>
                </div>
              </div>

              <!-- 4-PILLAR CONFLUENCE BREAKDOWN -->
              <div class="space-y-4">
                <div class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <span class="mat-icon text-emerald-400 text-sm">hub</span>
                  <span>Décomposition des 4 Piliers d'Analyse</span>
                </div>

                <!-- 1. Technical Pillar -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800/90 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="mat-icon text-emerald-400 text-base">timeline</span>
                      <span class="text-xs font-bold text-white">Pilier Technique</span>
                    </div>
                    <span class="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      {{ sig.confluence.technical.bias }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    {{ sig.confluence.technical.detail }}
                  </p>
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    @for (ind of sig.confluence.technical.indicators; track ind) {
                      <span class="px-2 py-0.5 rounded bg-[#181822] text-[10px] font-mono text-slate-300 border border-slate-800">
                        {{ ind }}
                      </span>
                    }
                  </div>
                </div>

                <!-- 2. Macro Pillar -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800/90 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="mat-icon text-cyan-400 text-base">account_balance</span>
                      <span class="text-xs font-bold text-white">Pilier Macroéconomique</span>
                    </div>
                    <span class="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {{ sig.confluence.macro.interestRateDiff }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    {{ sig.confluence.macro.detail }}
                  </p>
                </div>

                <!-- 3. News Pillar -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800/90 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="mat-icon text-amber-400 text-base">event_available</span>
                      <span class="text-xs font-bold text-white">Pilier Calendrier & News</span>
                    </div>
                    <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      FENÊTRE PROPRE (+{{ sig.confluence.news.nextEventInMinutes }} min)
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    {{ sig.confluence.news.detail }}
                  </p>
                </div>

                <!-- 4. AI Pillar -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800/90 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="mat-icon text-indigo-400 text-base">psychology</span>
                      <span class="text-xs font-bold text-white">Intelligence Artificielle & Backtests</span>
                    </div>
                    <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Probabilité : {{ sig.confluence.ai.winrateEstimate }}%
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    Sur un historique de <strong>{{ sig.confluence.ai.historicalSampleSize }} configurations similaires</strong>, le ratio d'atteinte du Take Profit avant Stop Loss ressort à {{ sig.confluence.ai.winrateEstimate }}%.
                  </p>
                </div>

              </div>

            </div>

            <!-- DRAWER FOOTER ACTIONS -->
            <div class="pt-6 border-t border-slate-800 space-y-3 mt-6">
              
              @if (sig.status === 'PENDING_CONFIRMATION') {
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    (click)="dashboardService.dismissSignal(sig.id)"
                    class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
                    Ignorer le signal
                  </button>

                  <button 
                    type="button"
                    (click)="dashboardService.confirmSignalExecution(sig.id)"
                    class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5">
                    <span class="mat-icon text-base">check_circle</span>
                    <span>Exécuter en Démo</span>
                  </button>
                </div>
              } @else {
                <button 
                  type="button"
                  (click)="dashboardService.closeExplainabilityDrawer()"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors">
                  Fermer
                </button>
              }

              <div class="text-[10px] text-center text-slate-400 font-mono">
                Exécution sandbox protégée par vos seuils de risque onboarding
              </div>

            </div>

          </div>
        </div>

      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class DashboardComponent {
  dashboardService = inject(DashboardService);
  onboardingService = inject(OnboardingService);
  marketDemoService = inject(MarketDemoService);

  metrics = computed(() => this.dashboardService.metrics());
  riskPrefs = computed(() => this.onboardingService.riskPreferences());
  autoPrefs = computed(() => this.onboardingService.automationPreferences());

  activeWatchlistPairSymbol = computed(() => {
    return this.dashboardService.selectedWatchlistPair() || 'EUR/USD';
  });

  currentLevelName = computed(() => {
    const lvl = this.autoPrefs().selectedLevel;
    const found = AUTOMATION_LEVELS.find(l => l.level === lvl);
    return found ? found.title : 'Analyse Uniquement';
  });

  getCandlesForSymbol(symbol: string): Candle[] {
    const store = this.marketDemoService.candleStore();
    const tf = this.marketDemoService.selectedTimeframe();
    if (store[symbol] && store[symbol]![tf] && store[symbol]![tf]!.length > 0) {
      return store[symbol]![tf]!;
    }
    const pair = this.marketDemoService.pairs().find(p => p.symbol === symbol);
    const bid = pair ? pair.bid : 1.085;
    const digits = pair ? pair.digits : (symbol.includes('JPY') ? 3 : (symbol.includes('XAU') || symbol.includes('BTC') || symbol.includes('US30') ? 2 : 5));
    const bias = pair ? pair.bias : 'BULLISH';
    return this.marketDemoService.generateCandleSeries(symbol, tf, bid, digits, bias, 48);
  }

  toggleAccountExecution(accId: string) {
    this.onboardingService.state.update(current => ({
      ...current,
      tradingAccounts: current.tradingAccounts.map(a => 
        a.id === accId ? { ...a, activeForExecution: !a.activeForExecution } : a
      )
    }));
  }
}
