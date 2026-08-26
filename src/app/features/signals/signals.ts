import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { MarketDemoService } from '../../core/services/market-demo.service';
import { FinancialChart } from '../../shared/components/financial-chart/financial-chart';
import { Candle } from '../../core/models/market-intelligence.model';

export type SignalFilterDirection = 'ALL' | 'BUY' | 'SELL';
export type SignalFilterStatus = 'ALL' | 'PENDING_CONFIRMATION' | 'EXECUTED_DEMO' | 'CANCELLED' | 'CLOSED_PROFIT';
export type SignalViewMode = 'GRID' | 'TABLE';

@Component({
  selector: 'app-signals-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FinancialChart],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto text-left">
      
      <!-- ============================================================ -->
      <!-- HEADER & TOP ACTIONS                                         -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">psychology</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Signaux & Algorithmes IA</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              4 PILIERS DE CONFLUENCE
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Recommandations multi-sources filtrées par le Risk Engine et calibrées selon vos paramètres de capital.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            id="export-signals-csv-btn"
            type="button"
            (click)="exportToCsv()"
            class="px-3.5 py-2 rounded-xl bg-[#141419] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <span class="mat-icon text-sm text-emerald-400">download</span>
            <span>Exporter CSV</span>
          </button>

          <a 
            routerLink="/app/dashboard"
            class="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1">
            <span class="mat-icon text-sm">dashboard</span>
            <span>Dashboard</span>
          </a>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- STATS SUMMARY TILES                                          -->
      <!-- ============================================================ -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Signaux Actifs</div>
          <div class="text-2xl font-black font-mono text-white">{{ activeSignalsCount() }}</div>
          <div class="text-[10px] text-emerald-400">En attente de validation</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Taux de Réussite IA</div>
          <div class="text-2xl font-black font-mono text-emerald-400">71.4%</div>
          <div class="text-[10px] text-slate-400">Sur 3 450+ configurations</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Ratio R:R Moyen</div>
          <div class="text-2xl font-black font-mono text-cyan-400">1:2.35</div>
          <div class="text-[10px] text-slate-400">Espérance mathématique positive</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Filtre Volatilité</div>
          <div class="text-2xl font-black font-mono text-indigo-400">ACTIF</div>
          <div class="text-[10px] text-slate-400">Protection news ±15 min</div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- REACTIVE FILTERS & VIEW MODE TOOLBAR                         -->
      <!-- ============================================================ -->
      <div class="p-4 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <!-- Search & Pair Dropdown -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="relative min-w-[200px]">
              <span class="mat-icon absolute left-3 top-2.5 text-slate-400 text-base">search</span>
              <input 
                id="search-signals-input"
                type="text" 
                placeholder="Rechercher paire, structure..."
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                class="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
            </div>

            <!-- Pair Filter -->
            <select 
              id="filter-pair-select"
              [value]="selectedPairFilter()"
              (change)="onPairFilterChange($event)"
              class="px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono">
              <option value="ALL">Toutes les paires</option>
              @for (pair of availablePairs; track pair) {
                <option [value]="pair">{{ pair }}</option>
              }
            </select>

            <!-- Direction Filter -->
            <div class="flex items-center rounded-xl bg-[#141419] border border-slate-800 p-0.5 text-xs font-mono">
              <button 
                type="button"
                (click)="selectedDirection.set('ALL')"
                [class.bg-emerald-500]="selectedDirection() === 'ALL'"
                [class.text-black]="selectedDirection() === 'ALL'"
                [class.font-bold]="selectedDirection() === 'ALL'"
                class="px-2.5 py-1 rounded-lg text-slate-300 transition-colors">
                Tous
              </button>
              <button 
                type="button"
                (click)="selectedDirection.set('BUY')"
                [class.bg-emerald-500]="selectedDirection() === 'BUY'"
                [class.text-black]="selectedDirection() === 'BUY'"
                [class.font-bold]="selectedDirection() === 'BUY'"
                class="px-2.5 py-1 rounded-lg text-emerald-400 transition-colors">
                BUY
              </button>
              <button 
                type="button"
                (click)="selectedDirection.set('SELL')"
                [class.bg-rose-500]="selectedDirection() === 'SELL'"
                [class.text-white]="selectedDirection() === 'SELL'"
                [class.font-bold]="selectedDirection() === 'SELL'"
                class="px-2.5 py-1 rounded-lg text-rose-400 transition-colors">
                SELL
              </button>
            </div>

            <!-- Status Filter -->
            <select 
              id="filter-status-select"
              [value]="selectedStatus()"
              (change)="onStatusFilterChange($event)"
              class="px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono">
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING_CONFIRMATION">En attente</option>
              <option value="EXECUTED_DEMO">Exécuté Démo</option>
              <option value="CLOSED_PROFIT">Clôturé Profit</option>
              <option value="CANCELLED">Rejeté / Annulé</option>
            </select>
          </div>

          <!-- Confluence Slider & View Switcher -->
          <div class="flex items-center gap-4">
            
            <!-- Confluence Slider -->
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-mono text-slate-400 whitespace-nowrap">Confluence Min :</span>
              <span class="text-xs font-mono font-bold text-emerald-400 min-w-[36px]">{{ minConfluenceScore() }}%</span>
              <input 
                id="confluence-slider"
                type="range" 
                min="50" 
                max="95" 
                step="5"
                [value]="minConfluenceScore()"
                (input)="onConfluenceSliderChange($event)"
                class="w-24 accent-emerald-500 cursor-pointer" />
            </div>

            <!-- View Toggle -->
            <div class="flex items-center rounded-xl bg-[#141419] border border-slate-800 p-0.5">
              <button 
                type="button"
                (click)="viewMode.set('GRID')"
                [class.bg-slate-800]="viewMode() === 'GRID'"
                [class.text-white]="viewMode() === 'GRID'"
                class="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Vue Cartes">
                <span class="mat-icon text-base">grid_view</span>
              </button>
              <button 
                type="button"
                (click)="viewMode.set('TABLE')"
                [class.bg-slate-800]="viewMode() === 'TABLE'"
                [class.text-white]="viewMode() === 'TABLE'"
                class="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Vue Tableau">
                <span class="mat-icon text-base">table_rows</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SIGNALS FEED: CARDS VIEW OR TABLE VIEW                        -->
      <!-- ============================================================ -->
      @if (filteredSignals().length === 0) {
        <div class="p-12 rounded-2xl bg-[#0e0e12] border border-slate-800 text-center space-y-3">
          <span class="mat-icon text-4xl text-slate-400">filter_alt_off</span>
          <h3 class="text-base font-bold text-white">Aucun signal ne correspond aux filtres</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            Ajustez le seuil de confluence ou sélectionnez "Toutes les paires" pour afficher les opportunités historiques.
          </p>
          <button 
            type="button"
            (click)="resetFilters()"
            class="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            Réinitialiser les filtres
          </button>
        </div>
      } @else if (viewMode() === 'GRID') {
        
        <!-- GRID VIEW OF SIGNALS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          @for (sig of filteredSignals(); track sig.id) {
            <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800/90 shadow-xl space-y-4 hover:border-slate-700 transition-all text-left">
              
              <!-- Signal Card Header -->
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

                <span class="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Confluence : {{ sig.alignmentScore }}%
                </span>
              </div>

              <!-- Signal Title & Summary -->
              <div>
                <h4 class="text-sm font-bold text-slate-200">{{ sig.confluence.technical.title }}</h4>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  {{ sig.confluence.technical.detail }}
                </p>
              </div>

              <!-- Price Matrix Box -->
              <div class="grid grid-cols-4 gap-2 p-3 rounded-xl bg-[#141419] border border-slate-800/80 text-xs font-mono text-center">
                <div>
                  <span class="text-slate-400 text-[10px]">Entrée</span>
                  <div class="text-white font-bold mt-0.5">{{ sig.entryPrice }}</div>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px]">Stop Loss</span>
                  <div class="text-rose-400 font-bold mt-0.5">{{ sig.stopLoss }}</div>
                  <div class="text-[9px] text-slate-400">-{{ sig.pipsRisk }}p</div>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px]">Take Profit</span>
                  <div class="text-emerald-400 font-bold mt-0.5">{{ sig.takeProfit }}</div>
                  <div class="text-[9px] text-slate-400">+{{ sig.pipsReward }}p</div>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px]">Ratio R:R</span>
                  <div class="text-cyan-400 font-bold mt-0.5">{{ sig.riskRewardRatio }}</div>
                </div>
              </div>

              <!-- 4-Pillar Preview Chips -->
              <div class="flex flex-wrap gap-2 text-[11px] font-mono">
                <span class="px-2 py-0.5 rounded bg-[#181822] text-slate-300 border border-slate-800 flex items-center gap-1">
                  <span class="mat-icon text-xs text-emerald-400">timeline</span>
                  <span>{{ sig.confluence.technical.bias }}</span>
                </span>
                <span class="px-2 py-0.5 rounded bg-[#181822] text-slate-300 border border-slate-800 flex items-center gap-1">
                  <span class="mat-icon text-xs text-cyan-400">account_balance</span>
                  <span>Macro USD</span>
                </span>
                <span class="px-2 py-0.5 rounded bg-[#181822] text-slate-300 border border-slate-800 flex items-center gap-1">
                  <span class="mat-icon text-xs text-amber-400">event_available</span>
                  <span>News OK</span>
                </span>
                <span class="px-2 py-0.5 rounded bg-[#181822] text-slate-300 border border-slate-800 flex items-center gap-1">
                  <span class="mat-icon text-xs text-indigo-400">psychology</span>
                  <span>Prob {{ sig.confluence.ai.winrateEstimate }}%</span>
                </span>
              </div>

              <!-- Bottom Actions Bar -->
              <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div>
                  @if (sig.status === 'PENDING_CONFIRMATION') {
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      EN ATTENTE
                    </span>
                  } @else if (sig.status === 'EXECUTED_DEMO') {
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      EXÉCUTÉ DÉMO
                    </span>
                  } @else if (sig.status === 'CLOSED_PROFIT') {
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      CLÔTURÉ +TP
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                      ANNULÉ
                    </span>
                  }
                </div>

                <div class="flex items-center gap-2">
                  <button 
                    type="button"
                    (click)="dashboardService.openExplainabilityDrawer(sig)"
                    class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1">
                    <span class="mat-icon text-xs text-emerald-400">visibility</span>
                    <span>Détails & Analyse</span>
                  </button>

                  @if (sig.status === 'PENDING_CONFIRMATION') {
                    <button 
                      type="button"
                      (click)="dashboardService.confirmSignalExecution(sig.id)"
                      class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs transition-colors flex items-center gap-1 shadow-sm">
                      <span class="mat-icon text-xs">play_arrow</span>
                      <span>Exécuter</span>
                    </button>
                  }
                </div>
              </div>

            </div>
          }
        </div>

      } @else {

        <!-- TABLE VIEW OF SIGNALS -->
        <div class="rounded-2xl bg-[#0e0e12] border border-slate-800 overflow-x-auto shadow-xl">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[#141419] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">Paire</th>
                <th class="p-3.5">Direction</th>
                <th class="p-3.5">Score</th>
                <th class="p-3.5">Entrée</th>
                <th class="p-3.5">Stop Loss</th>
                <th class="p-3.5">Take Profit</th>
                <th class="p-3.5">Ratio R:R</th>
                <th class="p-3.5">Statut</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (sig of filteredSignals(); track sig.id) {
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="p-3.5 font-bold text-white">{{ sig.symbol }}</td>
                  <td class="p-3.5">
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      [class.bg-emerald-500/20]="sig.direction === 'BUY'"
                      [class.text-emerald-400]="sig.direction === 'BUY'"
                      [class.bg-rose-500/20]="sig.direction === 'SELL'"
                      [class.text-rose-400]="sig.direction === 'SELL'">
                      {{ sig.direction }} ({{ sig.timeframe }})
                    </span>
                  </td>
                  <td class="p-3.5 font-bold text-emerald-400">{{ sig.alignmentScore }}%</td>
                  <td class="p-3.5 text-slate-200">{{ sig.entryPrice }}</td>
                  <td class="p-3.5 text-rose-400">{{ sig.stopLoss }}</td>
                  <td class="p-3.5 text-emerald-400">{{ sig.takeProfit }}</td>
                  <td class="p-3.5 text-cyan-400 font-bold">{{ sig.riskRewardRatio }}</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {{ sig.status }}
                    </span>
                  </td>
                  <td class="p-3.5 text-right">
                    <button 
                      type="button"
                      (click)="dashboardService.openExplainabilityDrawer(sig)"
                      class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold transition-colors">
                      Examiner
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

      }

      <!-- Bottom Dashboard Link -->
      <div class="text-center pt-6">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>

    </div>

    <!-- ============================================================ -->
    <!-- SLIDE-OVER DRAWER : SIGNAL EXPLAINABILITY                    -->
    <!-- ============================================================ -->
    @if (dashboardService.activeExplainSignal(); as sig) {
      <div class="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
        
        <!-- Backdrop -->
        <button 
          type="button"
          aria-label="Fermer le panneau"
          class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity w-full h-full border-0 cursor-default"
          (click)="dashboardService.closeExplainabilityDrawer()">
        </button>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div class="w-full sm:w-screen max-w-xl bg-[#0e0e12] border-l border-slate-800 shadow-2xl p-4 sm:p-8 flex flex-col justify-between overflow-y-auto text-left">
            
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

              <!-- Price Matrix Grid -->
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

              <!-- Mini Chart Preview -->
              <div class="p-3 rounded-xl bg-[#0B0E14] border border-slate-800/90 space-y-2">
                <div class="flex items-center justify-between text-[11px] font-mono">
                  <span class="text-slate-400 font-bold flex items-center gap-1">
                    <span class="mat-icon text-sm text-emerald-400">show_chart</span>
                    <span>Structure Graphique ({{ sig.symbol }})</span>
                  </span>
                  <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    SL / TP / Entry calculés
                  </span>
                </div>
                <div class="h-44 w-full rounded-lg overflow-hidden border border-slate-800">
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

              <!-- 4-Pillar Confluence Breakdown -->
              <div class="space-y-3">
                <div class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <span class="mat-icon text-emerald-400 text-sm">hub</span>
                  <span>Décomposition des 4 Piliers d'Analyse</span>
                </div>

                <!-- 1. Technical -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-white flex items-center gap-1.5">
                      <span class="mat-icon text-emerald-400 text-sm">timeline</span>
                      <span>Analyse Technique</span>
                    </span>
                    <span class="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      {{ sig.confluence.technical.bias }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300">{{ sig.confluence.technical.detail }}</p>
                </div>

                <!-- 2. Macro -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-white flex items-center gap-1.5">
                      <span class="mat-icon text-cyan-400 text-sm">account_balance</span>
                      <span>Macroéconomie & Taux</span>
                    </span>
                    <span class="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {{ sig.confluence.macro.interestRateDiff }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300">{{ sig.confluence.macro.detail }}</p>
                </div>

                <!-- 3. News -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-white flex items-center gap-1.5">
                      <span class="mat-icon text-amber-400 text-sm">event_available</span>
                      <span>Calendrier & Volatilité</span>
                    </span>
                    <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      FENÊTRE PROPRE (+{{ sig.confluence.news.nextEventInMinutes }} min)
                    </span>
                  </div>
                  <p class="text-xs text-slate-300">{{ sig.confluence.news.detail }}</p>
                </div>

                <!-- 4. AI -->
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-white flex items-center gap-1.5">
                      <span class="mat-icon text-indigo-400 text-sm">psychology</span>
                      <span>Backtests & Modèle IA</span>
                    </span>
                    <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Probabilité : {{ sig.confluence.ai.winrateEstimate }}%
                    </span>
                  </div>
                  <p class="text-xs text-slate-300">
                    Sur un échantillon de <strong>{{ sig.confluence.ai.historicalSampleSize }} configurations</strong> similaires, ce modèle enregistre un taux de TP de {{ sig.confluence.ai.winrateEstimate }}%.
                  </p>
                </div>

              </div>

            </div>

            <!-- Drawer Bottom Actions -->
            <div class="pt-6 border-t border-slate-800 space-y-3 mt-6">
              @if (sig.status === 'PENDING_CONFIRMATION') {
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    (click)="dashboardService.dismissSignal(sig.id)"
                    class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
                    Rejeter
                  </button>
                  <button 
                    type="button"
                    (click)="dashboardService.confirmSignalExecution(sig.id)"
                    class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20">
                    <span class="mat-icon text-sm">check_circle</span>
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
            </div>

          </div>
        </div>

      </div>
    }
  `
})
export class SignalsComponent {
  dashboardService = inject(DashboardService);
  marketDemoService = inject(MarketDemoService);

  readonly availablePairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD', 'AUD/USD', 'XAU/USD', 'BTC/USD'];

  // Reactive Filters
  readonly searchQuery = signal<string>('');
  readonly selectedPairFilter = signal<string>('ALL');
  readonly selectedDirection = signal<SignalFilterDirection>('ALL');
  readonly selectedStatus = signal<SignalFilterStatus>('ALL');
  readonly minConfluenceScore = signal<number>(65);
  readonly viewMode = signal<SignalViewMode>('GRID');

  // Computed active count
  readonly activeSignalsCount = computed(() => {
    return this.dashboardService.signals().filter(s => s.status === 'PENDING_CONFIRMATION').length;
  });

  // Filtered Signals List
  readonly filteredSignals = computed(() => {
    const all = this.dashboardService.signals();
    const query = this.searchQuery().toLowerCase().trim();
    const pair = this.selectedPairFilter();
    const dir = this.selectedDirection();
    const status = this.selectedStatus();
    const minScore = this.minConfluenceScore();

    return all.filter(s => {
      // Pair match
      if (pair !== 'ALL' && s.symbol !== pair) return false;
      // Direction match
      if (dir !== 'ALL' && s.direction !== dir) return false;
      // Status match
      if (status !== 'ALL' && s.status !== status) return false;
      // Confluence score match
      if (s.alignmentScore < minScore) return false;
      // Query text match
      if (query) {
        const text = `${s.symbol} ${s.direction} ${s.confluence.technical.title} ${s.confluence.technical.detail}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  });

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  onPairFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedPairFilter.set(val);
  }

  onStatusFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as SignalFilterStatus;
    this.selectedStatus.set(val);
  }

  onConfluenceSliderChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.minConfluenceScore.set(val);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedPairFilter.set('ALL');
    this.selectedDirection.set('ALL');
    this.selectedStatus.set('ALL');
    this.minConfluenceScore.set(65);
  }

  getCandlesForSymbol(symbol: string): Candle[] {
    const store = this.marketDemoService.candleStore();
    const tf = this.marketDemoService.selectedTimeframe();
    if (store[symbol] && store[symbol]![tf] && store[symbol]![tf]!.length > 0) {
      return store[symbol]![tf]!;
    }
    const pair = this.marketDemoService.pairs().find(p => p.symbol === symbol);
    const bid = pair ? pair.bid : 1.085;
    const digits = pair ? pair.digits : (symbol.includes('JPY') ? 3 : 5);
    const bias = pair ? pair.bias : 'BULLISH';
    return this.marketDemoService.generateCandleSeries(symbol, tf, bid, digits, bias, 48);
  }

  exportToCsv() {
    const signals = this.filteredSignals();
    const headers = ['ID', 'Paire', 'Direction', 'Timeframe', 'Score', 'Prix_Entree', 'Stop_Loss', 'Take_Profit', 'Ratio_RR', 'Statut', 'Date'];
    const rows = signals.map(s => [
      s.id,
      s.symbol,
      s.direction,
      s.timeframe,
      `${s.alignmentScore}%`,
      s.entryPrice,
      s.stopLoss,
      s.takeProfit,
      s.riskRewardRatio,
      s.status,
      s.timestamp
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `forex_intel_signaux_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
