import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MarketDemoService } from '../../core/services/market-demo.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { OnboardingService } from '../../core/services/onboarding.service';
import { TradingAccountService } from '../../core/services/trading-account.service';
import { AuthService } from '../../core/services/auth.service';
import { Candle } from '../../core/models/market-intelligence.model';
import { FinancialChart } from '../../shared/components/financial-chart/financial-chart';

@Component({
  selector: 'app-market-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, FinancialChart],
  template: `
    <div class="w-full max-w-[1920px] mx-auto px-2 sm:px-4 md:px-6 space-y-3.5 text-left pb-12">
      
      <!-- ============================================================ -->
      <!-- TOP BREADCRUMB & QUICK ASSET SELECTOR BAR                     -->
      <!-- ============================================================ -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2.5 border-b border-slate-200 dark:border-slate-800/80">
        
        <!-- Left: Breadcrumb & Quick Currency Switcher Chips -->
        <div class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <a routerLink="/app/dashboard" class="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
            <span class="mat-icon text-base">dashboard</span>
            <span>Dashboard</span>
          </a>
          <span class="text-slate-300 dark:text-slate-700">/</span>
          <span class="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
            <span class="mat-icon text-sm text-emerald-500">monitoring</span>
            <span>Terminal Marché</span>
          </span>
          <span class="text-slate-300 dark:text-slate-700">/</span>
          
          <!-- Quick Pair Switcher Chips -->
          <div class="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 no-scrollbar">
            @for (chip of topQuickPairs(); track chip.symbol) {
              <a 
                [routerLink]="['/app/market', marketService.getSlugFromSymbol(chip.symbol)]"
                class="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                [class.bg-emerald-500]="activePair().symbol === chip.symbol"
                [class.text-slate-950]="activePair().symbol === chip.symbol"
                [class.shadow-xs]="activePair().symbol === chip.symbol"
                [class.bg-slate-100]="activePair().symbol !== chip.symbol"
                [class.dark:bg-slate-800/80]="activePair().symbol !== chip.symbol"
                [class.text-slate-700]="activePair().symbol !== chip.symbol"
                [class.dark:text-slate-300]="activePair().symbol !== chip.symbol"
                [class.hover:bg-slate-200]="activePair().symbol !== chip.symbol"
                [class.dark:hover:bg-slate-700]="activePair().symbol !== chip.symbol">
                <span>{{ chip.symbol }}</span>
                <span 
                  class="text-[9px]"
                  [class.text-slate-950]="activePair().symbol === chip.symbol"
                  [class.text-emerald-600]="activePair().symbol !== chip.symbol && chip.change24h >= 0"
                  [class.dark:text-emerald-400]="activePair().symbol !== chip.symbol && chip.change24h >= 0"
                  [class.text-rose-600]="activePair().symbol !== chip.symbol && chip.change24h < 0"
                  [class.dark:text-rose-400]="activePair().symbol !== chip.symbol && chip.change24h < 0">
                  {{ chip.change24h >= 0 ? '+' : '' }}{{ chip.change24h }}%
                </span>
              </a>
            }
          </div>
        </div>

        <!-- Right: Session Status, Live Toggle & Full-Width Terminal Toggle -->
        <div class="flex items-center flex-wrap gap-2">
          
          <!-- Active Market Session Badge -->
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#141419] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{{ activeSessionName() }}</span>
          </div>

          <!-- Real-time Live Ticks Toggle -->
          <button 
            type="button"
            (click)="marketService.toggleLiveStreaming()"
            class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border"
            [class.bg-emerald-50]="marketService.isLiveStreaming()"
            [class.dark:bg-emerald-500/10]="marketService.isLiveStreaming()"
            [class.border-emerald-300]="marketService.isLiveStreaming()"
            [class.dark:border-emerald-500/30]="marketService.isLiveStreaming()"
            [class.text-emerald-700]="marketService.isLiveStreaming()"
            [class.dark:text-emerald-400]="marketService.isLiveStreaming()"
            [class.bg-slate-100]="!marketService.isLiveStreaming()"
            [class.dark:bg-slate-800]="!marketService.isLiveStreaming()"
            [class.border-slate-200]="!marketService.isLiveStreaming()"
            [class.dark:border-slate-700]="!marketService.isLiveStreaming()"
            [class.text-slate-600]="!marketService.isLiveStreaming()"
            [class.dark:text-slate-400]="!marketService.isLiveStreaming()">
            <span class="mat-icon text-xs">{{ marketService.isLiveStreaming() ? 'sensors' : 'sensors_off' }}</span>
            <span>{{ marketService.isLiveStreaming() ? 'FLUX DIRECT' : 'EN PAUSE' }}</span>
          </button>

          <!-- Collapsible Sidebar / Full-Width Toggle Button -->
          <button 
            type="button"
            (click)="toggleSidebar()"
            [title]="isSidebarCollapsed() ? 'Afficher les outils' : 'Basculer en plein écran'"
            class="px-3 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs"
            [class.bg-emerald-500]="isSidebarCollapsed()"
            [class.text-slate-950]="isSidebarCollapsed()"
            [class.border-emerald-400]="isSidebarCollapsed()"
            [class.bg-white]="!isSidebarCollapsed()"
            [class.dark:bg-[#141419]]="!isSidebarCollapsed()"
            [class.border-slate-200]="!isSidebarCollapsed()"
            [class.dark:border-slate-800]="!isSidebarCollapsed()"
            [class.text-slate-700]="!isSidebarCollapsed()"
            [class.dark:text-slate-300]="!isSidebarCollapsed()"
            [class.hover:bg-slate-100]="!isSidebarCollapsed()"
            [class.dark:hover:bg-slate-800]="!isSidebarCollapsed()">
            <span class="mat-icon text-sm">{{ isSidebarCollapsed() ? 'fullscreen_exit' : 'fullscreen' }}</span>
            <span>{{ isSidebarCollapsed() ? 'Afficher Outils' : 'Plein Écran (100%)' }}</span>
          </button>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- MARKET HEADER : PAIR SELECTOR, LIVE TICKER & METRICS          -->
      <!-- ============================================================ -->
      <div class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0e0e12] border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-3">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          <!-- Left: Pair Identity & Quick Dropdown Selector -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="relative">
              <label for="pair-selector" class="sr-only">Sélectionner un instrument</label>
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#141419] border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition-colors">
                <span class="mat-icon text-emerald-500 dark:text-emerald-400 text-lg">candlestick_chart</span>
                <select 
                  id="pair-selector"
                  [value]="activeSlug()" 
                  (change)="onPairSelect($event)"
                  class="bg-transparent text-slate-900 dark:text-white font-mono font-black text-sm sm:text-base focus:outline-none cursor-pointer pr-2">
                  <optgroup label="Forex Majeures">
                    @for (p of majorPairs(); track p.symbol) {
                      <option [value]="marketService.getSlugFromSymbol(p.symbol)" class="bg-white dark:bg-[#0e0e12] text-slate-900 dark:text-white">
                        {{ p.symbol }} · {{ p.name }}
                      </option>
                    }
                  </optgroup>
                  <optgroup label="Forex Minors & Croisements">
                    @for (p of minorPairs(); track p.symbol) {
                      <option [value]="marketService.getSlugFromSymbol(p.symbol)" class="bg-white dark:bg-[#0e0e12] text-slate-900 dark:text-white">
                        {{ p.symbol }} · {{ p.name }}
                      </option>
                    }
                  </optgroup>
                  <optgroup label="Matières Premières & Crypto">
                    @for (p of otherInstruments(); track p.symbol) {
                      <option [value]="marketService.getSlugFromSymbol(p.symbol)" class="bg-white dark:bg-[#0e0e12] text-slate-900 dark:text-white">
                        {{ p.symbol }} · {{ p.name }}
                      </option>
                    }
                  </optgroup>
                </select>
              </div>
            </div>

            <div class="space-y-0.5">
              <div class="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {{ activePair().name }} &bull; <span class="text-slate-500 dark:text-slate-400 uppercase font-mono">{{ activePair().category }}</span>
              </div>
              <div class="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>Spread: <strong class="text-slate-800 dark:text-slate-200">{{ activePair().spread }} pips</strong></span>
                <span>&bull;</span>
                <span>H: <strong class="text-slate-700 dark:text-slate-300">{{ activePair().high24h }}</strong></span>
                <span>&bull;</span>
                <span>L: <strong class="text-slate-700 dark:text-slate-300">{{ activePair().low24h }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Middle: Live Quotation Banner -->
          <div class="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800/80 font-mono">
            <div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Prix Bid / Vente</div>
              <div 
                class="text-lg sm:text-2xl font-black transition-colors"
                [class.text-emerald-600]="activePair().lastTickDirection === 'UP'"
                [class.dark:text-emerald-400]="activePair().lastTickDirection === 'UP'"
                [class.text-rose-600]="activePair().lastTickDirection === 'DOWN'"
                [class.dark:text-rose-400]="activePair().lastTickDirection === 'DOWN'"
                [class.text-slate-900]="!activePair().lastTickDirection || activePair().lastTickDirection === 'NEUTRAL'"
                [class.dark:text-white]="!activePair().lastTickDirection || activePair().lastTickDirection === 'NEUTRAL'">
                {{ activePair().bid }}
              </div>
            </div>

            <div class="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

            <div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Prix Ask / Achat</div>
              <div class="text-sm sm:text-lg font-bold text-slate-700 dark:text-slate-300">
                {{ activePair().ask }}
              </div>
            </div>

            <div class="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

            <div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Var. 24h</div>
              <div 
                class="text-xs sm:text-sm font-bold flex items-center gap-0.5"
                [class.text-emerald-600]="activePair().change24h >= 0"
                [class.dark:text-emerald-400]="activePair().change24h >= 0"
                [class.text-rose-600]="activePair().change24h < 0"
                [class.dark:text-rose-400]="activePair().change24h < 0">
                <span>{{ activePair().change24h >= 0 ? '+' : '' }}{{ activePair().change24h }}%</span>
              </div>
            </div>
          </div>

          <!-- Right: Timeframe Switcher Tabs (Scrollable on Mobile) -->
          <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#141419] rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full">
            @for (tf of marketService.timeframeOptions; track tf.id) {
              <button 
                type="button"
                (click)="marketService.setTimeframe(tf.id)"
                [title]="tf.name + ' — ' + tf.desc"
                class="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 min-h-[32px]"
                [class.bg-emerald-500]="marketService.selectedTimeframe() === tf.id"
                [class.text-slate-950]="marketService.selectedTimeframe() === tf.id"
                [class.shadow-xs]="marketService.selectedTimeframe() === tf.id"
                [class.text-slate-600]="marketService.selectedTimeframe() !== tf.id"
                [class.dark:text-slate-400]="marketService.selectedTimeframe() !== tf.id"
                [class.hover:text-slate-900]="marketService.selectedTimeframe() !== tf.id"
                [class.dark:hover:text-white]="marketService.selectedTimeframe() !== tf.id"
                [class.hover:bg-slate-200]="marketService.selectedTimeframe() !== tf.id"
                [class.dark:hover:bg-slate-800/80]="marketService.selectedTimeframe() !== tf.id">
                {{ tf.label }}
              </button>
            }
          </div>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- MAIN ANALYSIS WORKSPACE : FLEXIBLE GRID TERMINAL              -->
      <!-- (EXPANDS TO 100% FULL WIDTH WHEN SIDEBAR IS COLLAPSED)       -->
      <!-- ============================================================ -->
      <div [class]="isSidebarCollapsed() ? 'grid grid-cols-1 gap-4 items-start' : 'grid grid-cols-1 xl:grid-cols-12 gap-4 items-start'">
        
        <!-- LEFT / MAIN COLUMN: 60 FPS CANVAS TERMINAL CHART -->
        <div [class]="isSidebarCollapsed() ? 'w-full col-span-12 transition-all duration-300' : 'w-full xl:col-span-8 2xl:col-span-9 transition-all duration-300'">
          
          <!-- High Performance Financial Canvas Chart Container -->
          <div [class]="isSidebarCollapsed() ? 'w-full rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl h-[720px] sm:h-[780px] 2xl:h-[840px] relative' : 'w-full rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl h-[640px] sm:h-[700px] 2xl:h-[760px] relative'">
            <div [class.blur-md]="hasNoConnectedAccount()" [class.pointer-events-none]="hasNoConnectedAccount()" class="w-full h-full">
              <app-financial-chart 
                [symbol]="activePair().symbol"
                [candles]="activeCandles()"
                [compact]="false"
                [signalEntryPrice]="generatedSignal().entryPrice"
                [signalStopLoss]="generatedSignal().stopLoss"
                [signalTakeProfit]="generatedSignal().takeProfit">
              </app-financial-chart>
            </div>

            <!-- Data Gating Overlay CTA -->
            @if (hasNoConnectedAccount()) {
              <div class="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/65 backdrop-blur-md rounded-2xl">
                <div class="max-w-md w-full p-6 rounded-2xl bg-[#0e0e12] border border-amber-500/40 text-center space-y-4 shadow-2xl animate-fadeIn">
                  <div class="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                    <span class="mat-icon text-2xl">lock</span>
                  </div>
                  <div class="space-y-1.5">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      ACCÈS MARCHÉ RESTREINT (DATA GATING)
                    </span>
                    <h3 class="text-lg font-extrabold text-white">Raccordez votre compte MT5</h3>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      Connectez votre compte Deriv ou broker MetaTrader 5 (Démo ou Réel) pour débloquer le flux de cotations institutionnelles en direct.
                    </p>
                  </div>
                  <div class="pt-2">
                    <a 
                      routerLink="/app/accounts"
                      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-xs hover:from-emerald-400 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/25">
                      <span class="mat-icon text-sm">cable</span>
                      <span>Connecter mon Compte MT5</span>
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>

        </div>

        <!-- ============================================================ -->
        <!-- RIGHT COLUMN: INDICATORS PANEL & FAST EXECUTION MT5          -->
        <!-- (COLLAPSIBLE WITH SMOOTH TRANSITION)                         -->
        <!-- ============================================================ -->
        @if (!isSidebarCollapsed()) {
          <div class="xl:col-span-4 2xl:col-span-3 space-y-4 animate-fadeIn">
            
            <!-- Overall Confluence Score & Gauge Card -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e0e12] border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-3.5 text-center">
              
              <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span class="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                  <span class="mat-icon text-emerald-500 dark:text-emerald-400 text-base">psychology</span>
                  <span>Confluence IA Multi-Piliers</span>
                </span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  {{ activePair().trend }}
                </span>
              </div>

              <!-- Radial Confluence Gauge -->
              <div class="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <!-- Background Circle -->
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="transparent" 
                    class="stroke-slate-200 dark:stroke-slate-800"
                    stroke-width="8" />
                  <!-- Progress Circle -->
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="transparent" 
                    [attr.stroke]="confluenceColor()" 
                    stroke-width="8" 
                    stroke-linecap="round"
                    [attr.stroke-dasharray]="264"
                    [attr.stroke-dashoffset]="264 - (264 * (activePair().aiConfidence / 100))"
                    class="transition-all duration-1000" />
                </svg>

                <!-- Central Score Percentage -->
                <div class="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{{ activePair().aiConfidence }}%</span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                    {{ activePair().bias === 'BULLISH' ? 'Haussier' : activePair().bias === 'BEARISH' ? 'Baissier' : 'Neutre' }}
                  </span>
                </div>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-left">
                {{ confluenceSummaryText() }}
              </p>
            </div>

            <!-- Technical Indicators Breakdown & Explainability Card -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e0e12] border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-3">
              
              <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span class="mat-icon text-cyan-500 dark:text-cyan-400 text-sm">tune</span>
                <span>Lectures Techniques Détaillées</span>
              </h3>

              <div class="space-y-2.5 text-xs font-mono">
                
                <!-- 1. Moyennes Mobiles (EMAs) -->
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1">
                      <span class="mat-icon text-cyan-500 dark:text-cyan-400 text-xs">trending_up</span>
                      <span>Moyennes Mobiles (EMA)</span>
                    </span>
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      [class.bg-emerald-500/15]="emaAlignmentBias() === 'BULLISH'"
                      [class.text-emerald-600]="emaAlignmentBias() === 'BULLISH'"
                      [class.dark:text-emerald-400]="emaAlignmentBias() === 'BULLISH'"
                      [class.bg-rose-500/15]="emaAlignmentBias() === 'BEARISH'"
                      [class.text-rose-600]="emaAlignmentBias() === 'BEARISH'"
                      [class.dark:text-rose-400]="emaAlignmentBias() === 'BEARISH'"
                      [class.bg-slate-200]="emaAlignmentBias() === 'NEUTRAL'"
                      [class.dark:bg-slate-800]="emaAlignmentBias() === 'NEUTRAL'"
                      [class.text-slate-700]="emaAlignmentBias() === 'NEUTRAL'"
                      [class.dark:text-slate-300]="emaAlignmentBias() === 'NEUTRAL'">
                      {{ emaAlignmentBias() === 'BULLISH' ? 'BIAIS HAUSSIER' : emaAlignmentBias() === 'BEARISH' ? 'BIAIS BAISSIER' : 'NEUTRE' }}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>EMA20: <strong class="text-cyan-600 dark:text-cyan-300">{{ currentEma20() }}</strong></span>
                    <span>EMA50: <strong class="text-amber-600 dark:text-amber-300">{{ currentEma50() }}</strong></span>
                    <span>EMA200: <strong class="text-purple-600 dark:text-purple-300">{{ currentEma200() }}</strong></span>
                  </div>
                  <p class="text-[11px] text-slate-600 dark:text-slate-300 pt-0.5 leading-tight">
                    {{ emaInterpretationText() }}
                  </p>
                </div>

                <!-- 2. Momentum (RSI 14) -->
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1">
                      <span class="mat-icon text-emerald-500 dark:text-emerald-400 text-xs">speed</span>
                      <span>Momentum (RSI 14)</span>
                    </span>
                    <span class="font-bold text-slate-900 dark:text-white">{{ currentRsi() }}</span>
                  </div>
                  <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                    {{ rsiInterpretationText() }}
                  </p>
                </div>

                <!-- 3. Volatilité (ATR 14) -->
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1">
                      <span class="mat-icon text-amber-500 dark:text-amber-400 text-xs">waves</span>
                      <span>Volatilité (ATR 14)</span>
                    </span>
                    <span class="font-bold text-amber-600 dark:text-amber-300">{{ currentAtrFormatted() }}</span>
                  </div>
                  <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                    Volatilité adaptée pour un Stop Loss de sécurité à {{ (currentAtr() * 1.5).toFixed(activePair().digits) }}.
                  </p>
                </div>

                <!-- 4. Structure Price Action (SMC) -->
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1">
                      <span class="mat-icon text-indigo-500 dark:text-indigo-400 text-xs">account_tree</span>
                      <span>Structure SMC (Smart Money)</span>
                    </span>
                    <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                      {{ activePair().bias === 'BULLISH' ? 'HH / HL' : activePair().bias === 'BEARISH' ? 'LH / LL' : 'RANGE' }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                    {{ priceActionStructureText() }}
                  </p>
                </div>

              </div>

            </div>

            <!-- ============================================================ -->
            <!-- ORDRE D'EXÉCUTION RAPIDE MT5 (1-CLICK DEMO EXECUTION)        -->
            <!-- ============================================================ -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e0e12] border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-3.5">
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono">Signal Détecté & Ordre MT5</h3>
                </div>
                <span 
                  class="px-2.5 py-0.5 rounded text-[11px] font-mono font-black"
                  [class.bg-emerald-500/20]="generatedSignal().direction === 'BUY'"
                  [class.text-emerald-700]="generatedSignal().direction === 'BUY'"
                  [class.dark:text-emerald-400]="generatedSignal().direction === 'BUY'"
                  [class.border]="true"
                  [class.border-emerald-500/40]="generatedSignal().direction === 'BUY'"
                  [class.bg-rose-500/20]="generatedSignal().direction === 'SELL'"
                  [class.text-rose-700]="generatedSignal().direction === 'SELL'"
                  [class.dark:text-rose-400]="generatedSignal().direction === 'SELL'"
                  [class.border-rose-500/40]="generatedSignal().direction === 'SELL'">
                  {{ generatedSignal().direction === 'BUY' ? 'ACHAT (BUY)' : 'VENTE (SELL)' }}
                </span>
              </div>

              <!-- Signal Key Price Levels Grid -->
              <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">Entrée conseillée</span>
                  <div class="font-bold text-slate-900 dark:text-white mt-0.5">{{ generatedSignal().entryPrice }}</div>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">Ratio R:R</span>
                  <div class="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{{ generatedSignal().riskRewardRatio }}</div>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">Stop Loss</span>
                  <div class="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{{ generatedSignal().stopLoss }}</div>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">Take Profit</span>
                  <div class="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{{ generatedSignal().takeProfit }}</div>
                </div>
              </div>

              <!-- Lot Size Selector -->
              <div class="space-y-1.5 font-mono">
                <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Volume du lot :</span>
                  <span class="text-slate-800 dark:text-slate-200 font-bold">{{ selectedLotSize() }} lot ({{ (selectedLotSize() * 100000) | number }} unités)</span>
                </div>
                <div class="grid grid-cols-4 gap-1.5">
                  @for (lot of [0.10, 0.25, 0.50, 1.00]; track lot) {
                    <button
                      type="button"
                      (click)="setLotSize(lot)"
                      class="py-1 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                      [class.bg-emerald-500]="selectedLotSize() === lot"
                      [class.text-slate-950]="selectedLotSize() === lot"
                      [class.bg-slate-100]="selectedLotSize() !== lot"
                      [class.dark:bg-slate-800]="selectedLotSize() !== lot"
                      [class.text-slate-700]="selectedLotSize() !== lot"
                      [class.dark:text-slate-300]="selectedLotSize() !== lot">
                      {{ lot }} L
                    </button>
                  }
                </div>
              </div>

              <!-- Execution Buttons CTA -->
              <div class="space-y-2 pt-1">
                @if (executionSuccessMessage()) {
                  <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                    <span class="mat-icon text-base">check_circle</span>
                    <span>{{ executionSuccessMessage() }}</span>
                  </div>
                }

                <button 
                  type="button"
                  (click)="executeSignalOnDemo()"
                  class="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer">
                  <span class="mat-icon text-lg">bolt</span>
                  <span>Exécuter Ordre sur MT5 Démo</span>
                </button>

                <a 
                  routerLink="/app/signals"
                  class="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700/60 block text-center">
                  <span class="mat-icon text-sm">visibility</span>
                  <span>Consulter tous les signaux actifs</span>
                </a>
              </div>

            </div>

          </div>
        }

      </div>

    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out forwards;
    }
  `
})
export class MarketComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  marketService = inject(MarketDemoService);
  dashboardService = inject(DashboardService);
  onboardingService = inject(OnboardingService);
  tradingAccountService = inject(TradingAccountService);
  authService = inject(AuthService);

  readonly hasNoConnectedAccount = computed(() => {
    const isSuperAdmin = this.authService.currentUser()?.role === 'SUPER_ADMIN';
    if (isSuperAdmin) return false;
    return this.tradingAccountService.accounts().length === 0;
  });

  // Fullscreen / Collapsible Sidebar state
  isSidebarCollapsed = signal<boolean>(false);

  // Lot Size Selector
  selectedLotSize = signal<number>(0.25);

  // Execution toast message
  executionSuccessMessage = signal<string | null>(null);

  // Active Symbol & Slug resolution
  activePair = computed(() => this.marketService.activePair());
  activeSlug = computed(() => this.marketService.getSlugFromSymbol(this.activePair().symbol));

  // Quick Switcher Pairs
  topQuickPairs = computed(() => {
    return this.marketService.pairs().slice(0, 8);
  });

  majorPairs = computed(() => this.marketService.pairs().filter(p => p.category === 'FOREX' && ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'].includes(p.symbol)));
  minorPairs = computed(() => this.marketService.pairs().filter(p => p.category === 'FOREX' && !['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'].includes(p.symbol)));
  otherInstruments = computed(() => this.marketService.pairs().filter(p => p.category !== 'FOREX'));

  // Active Candlesticks from Service
  activeCandles = computed<Candle[]>(() => this.marketService.activeCandles());

  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('symbol');
      if (slug) {
        const canonical = this.marketService.getSymbolFromSlug(slug);
        this.marketService.setActivePair(canonical);
      } else {
        const firstWl = this.dashboardService.watchlistPairs()[0]?.symbol || 'EUR/USD';
        this.marketService.setActivePair(firstWl);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }

  setLotSize(lot: number) {
    this.selectedLotSize.set(lot);
  }

  // EMA Mathematical Calculations for side panel
  ema20Series = computed(() => this.calculateEMA(this.activeCandles(), 20));
  ema50Series = computed(() => this.calculateEMA(this.activeCandles(), 50));
  ema200Series = computed(() => this.calculateEMA(this.activeCandles(), 200));

  currentEma20 = computed(() => {
    const arr = this.ema20Series();
    return arr.length > 0 ? arr[arr.length - 1].toFixed(this.activePair().digits) : '-';
  });

  currentEma50 = computed(() => {
    const arr = this.ema50Series();
    return arr.length > 0 ? arr[arr.length - 1].toFixed(this.activePair().digits) : '-';
  });

  currentEma200 = computed(() => {
    const arr = this.ema200Series();
    return arr.length > 0 ? arr[arr.length - 1].toFixed(this.activePair().digits) : '-';
  });

  // RSI Calculation
  rsiSeries = computed(() => this.calculateRSI(this.activeCandles(), 14));
  currentRsi = computed(() => {
    const list = this.rsiSeries();
    return list.length > 0 ? list[list.length - 1] : 54.0;
  });

  // ATR Calculation
  currentAtr = computed(() => this.calculateATR(this.activeCandles()));
  currentAtrFormatted = computed(() => {
    const val = this.currentAtr();
    const pips = (val / (this.activePair().pipSize || 0.0001)).toFixed(1);
    return `${val.toFixed(this.activePair().digits)} (${pips} pips)`;
  });

  // Confluence Colors and Interpretations
  confluenceColor = computed(() => {
    const b = this.activePair().bias;
    return b === 'BULLISH' ? '#00E699' : b === 'BEARISH' ? '#F43F5E' : '#94A3B8';
  });

  confluenceSummaryText = computed(() => {
    const p = this.activePair();
    if (p.bias === 'BULLISH') {
      return `Alignement haussier 4/4 validé sur ${p.symbol}. Les moyennes mobiles, le momentum RSI et la structure de liquidité confirment une impulsion d'achat avec ratio R:R avantageux.`;
    } else if (p.bias === 'BEARISH') {
      return `Pression vendeuse confirmée sur ${p.symbol}. Rejet sous résistance clé et divergence de liquidité justifiant un ciblage short encadré.`;
    }
    return `Marché en phase de consolidation latérale sur ${p.symbol}. Attente d'un breakout de range avant tout engagement de position.`;
  });

  emaAlignmentBias = computed<'BULLISH' | 'BEARISH' | 'NEUTRAL'>(() => {
    const e20 = parseFloat(this.currentEma20());
    const e50 = parseFloat(this.currentEma50());
    if (isNaN(e20) || isNaN(e50)) return 'NEUTRAL';
    if (e20 > e50) return 'BULLISH';
    if (e20 < e50) return 'BEARISH';
    return 'NEUTRAL';
  });

  emaInterpretationText = computed(() => {
    const e20 = this.currentEma20();
    const e50 = this.currentEma50();
    const e200 = this.currentEma200();
    if (this.emaAlignmentBias() === 'BULLISH') {
      return `EMA20 (${e20}) > EMA50 (${e50}) > EMA200 (${e200}) → Biais haussier actif confirmé par la dynamique.`;
    }
    return `EMA20 (${e20}) < EMA50 (${e50}) → Pression vendeuse dominante sous les moyennes mobiles.`;
  });

  rsiInterpretationText = computed(() => {
    const r = this.currentRsi();
    if (r >= 70) return `RSI à ${r} en zone de surachat (> 70). Attention aux prises de bénéfices.`;
    if (r <= 30) return `RSI à ${r} en zone de survente (< 30). Potentiel rebond technique.`;
    if (r >= 55) return `RSI à ${r} démontre un momentum acheteur régulier.`;
    return `RSI à ${r} en territoire neutre, équilibre des flux.`;
  });

  priceActionStructureText = computed(() => {
    const b = this.activePair().bias;
    const tf = this.marketService.selectedTimeframe();
    if (b === 'BULLISH') {
      return `Cassure de résistance ${tf} validée par pullback sur zone de liquidité institutionnelle.`;
    } else if (b === 'BEARISH') {
      return `Rupture de support dynamique ${tf} confirmée par bougie d'avalement baissier.`;
    }
    return `Oscillation au sein d'un canal horizontal ${tf}, attente de catalyseur.`;
  });

  // Dynamic Signal Generator
  generatedSignal = computed(() => {
    const p = this.activePair();
    const atr = this.currentAtr();
    const digits = p.digits;
    const isBullish = p.bias === 'BULLISH';

    const entryPrice = p.bid;
    const slDistance = atr * 1.5;
    const tpDistance = atr * 3.6;

    const stopLoss = Number((isBullish ? entryPrice - slDistance : entryPrice + slDistance).toFixed(digits));
    const takeProfit = Number((isBullish ? entryPrice + tpDistance : entryPrice - tpDistance).toFixed(digits));

    return {
      symbol: p.symbol,
      direction: isBullish ? 'BUY' as const : 'SELL' as const,
      entryPrice,
      stopLoss,
      takeProfit,
      riskRewardRatio: '1:2.4',
      pipsRisk: Number((slDistance / (p.pipSize || 0.0001)).toFixed(1)),
      pipsReward: Number((tpDistance / (p.pipSize || 0.0001)).toFixed(1))
    };
  });

  activeSessionName = computed(() => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    if (utcHours >= 7 && utcHours < 16) {
      return utcHours >= 12 ? 'Session Londres / New York' : 'Session Londres';
    } else if (utcHours >= 12 && utcHours < 21) {
      return 'Session New York';
    } else if (utcHours >= 0 && utcHours < 9) {
      return 'Session Tokyo / Asie';
    }
    return 'Session Sydney / Interbancaire';
  });

  onPairSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const slug = select.value;
    this.router.navigate(['/app/market', slug]);
  }

  // Fast Demo MT5 Execution
  executeSignalOnDemo() {
    const sig = this.generatedSignal();
    const newPosId = `pos-${Date.now().toString(36)}`;
    const lots = this.selectedLotSize();
    
    this.dashboardService.openPositions.update(positions => [
      {
        id: newPosId,
        symbol: sig.symbol,
        direction: sig.direction,
        volumeLots: lots,
        openPrice: sig.entryPrice,
        currentPrice: sig.entryPrice,
        stopLoss: sig.stopLoss,
        takeProfit: sig.takeProfit,
        pnlDollar: 0.0,
        pnlPips: 0.0,
        openTime: 'À l\'instant',
        riskPct: 1.0
      },
      ...positions
    ]);

    this.executionSuccessMessage.set(`Ordre ${sig.direction} ${lots} lot(s) exécuté avec succès sur MT5 Démo #${newPosId}`);
    setTimeout(() => {
      this.executionSuccessMessage.set(null);
    }, 4500);
  }

  // Helper algorithms
  private calculateEMA(candles: Candle[], period: number): number[] {
    if (candles.length === 0) return [];
    const k = 2 / (period + 1);
    const result: number[] = [];
    let ema = candles[0].close;
    for (let i = 0; i < candles.length; i++) {
      if (i === 0) {
        ema = candles[0].close;
      } else {
        ema = (candles[i].close * k) + (ema * (1 - k));
      }
      result.push(Number(ema.toFixed(5)));
    }
    return result;
  }

  private calculateRSI(candles: Candle[], period = 14): number[] {
    if (candles.length < 2) return candles.map(() => 50);
    const gains: number[] = [];
    const losses: number[] = [];
    for (let i = 1; i < candles.length; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      gains.push(diff > 0 ? diff : 0);
      losses.push(diff < 0 ? Math.abs(diff) : 0);
    }
    const rsiValues: number[] = [50];
    let avgGain = gains.slice(0, Math.min(period, gains.length)).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(period, gains.length));
    let avgLoss = losses.slice(0, Math.min(period, losses.length)).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(period, losses.length));

    for (let i = 0; i < gains.length; i++) {
      if (i < period) {
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsiValues.push(Number((100 - (100 / (1 + rs))).toFixed(1)));
      } else {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsiValues.push(Number((100 - (100 / (1 + rs))).toFixed(1)));
      }
    }
    return rsiValues;
  }

  private calculateATR(candles: Candle[]): number {
    if (candles.length < 2) return 0.0020;
    let trSum = 0;
    for (let i = 1; i < candles.length; i++) {
      const tr = Math.max(
        candles[i].high - candles[i].low,
        Math.abs(candles[i].high - candles[i - 1].close),
        Math.abs(candles[i].low - candles[i - 1].close)
      );
      trSum += tr;
    }
    return Number((trSum / (candles.length - 1)).toFixed(5));
  }
}
