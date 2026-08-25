import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketDemoService } from '../../../../core/services/market-demo.service';
import { Candle } from '../../../../core/models/market-intelligence.model';

export interface RenderedCandle {
  candle: Candle;
  index: number;
  cx: number;
  wickTopY: number;
  wickBottomY: number;
  bodyY: number;
  bodyHeight: number;
  bodyWidth: number;
  isBullish: boolean;
  volY: number;
  volHeight: number;
  changePct: number;
  timeLabel: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
}

@Component({
  selector: 'app-landing-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section id="hero-section" class="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-grid-pattern bg-[#0a0a0b]">
      <!-- Atmospheric Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] glow-ambient-emerald pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header Text Block -->
        <div class="text-center max-w-4xl mx-auto space-y-5">
          <!-- Category / Badge -->
          <div class="inline-flex items-center gap-2">
            <span class="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold tracking-wider uppercase border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Plateforme d'Intelligence de Marché dédiée au Forex
              <span class="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">Forex-First</span>
            </span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white tracking-tight">
            Comprenez le marché.<br />
            <span class="text-emerald-500">Contrôlez le risque.</span><br />
            Tradez avec intelligence.
          </h1>

          <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            Centralisez l'analyse technique, macroéconomique et les événements de marché en temps réel. Définissez vos propres règles de risque et gardez la maîtrise totale de vos décisions de trading sans biais émotionnel.
          </p>

          <!-- CTAs -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/auth/register" class="w-full sm:w-auto">
              <button type="button" class="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors cursor-pointer shadow-lg shadow-white/5">
                Démarrer l'essai gratuit (15j)
              </button>
            </a>
            <a href="#product-preview" class="w-full sm:w-auto">
              <button class="w-full sm:w-auto border border-slate-700 text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer">
                Explorer l'aperçu de la plateforme
              </button>
            </a>
          </div>

          <!-- Guarantees Notice -->
          <div class="pt-1 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              <span>15 Jours d'essai gratuit</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              <span>Sans carte bancaire</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              <span>Vos fonds restent chez votre broker</span>
            </div>
          </div>

          <!-- High Impact Benefit Equation Block -->
          <div class="mt-8 p-3.5 sm:p-4 rounded-xl bg-[#141417]/90 border border-slate-800 backdrop-blur max-w-4xl mx-auto shadow-xl">
            <div class="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2.5">
              L'Équation d'une Décision Structurée
            </div>
            <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-xs font-mono">
              <span class="px-2.5 py-1 rounded bg-[#1c1c22] text-slate-200 border border-slate-700 font-semibold">Sources Centralisées</span>
              <span class="text-emerald-400 font-bold text-sm">+</span>
              <span class="px-2.5 py-1 rounded bg-[#1c1c22] text-slate-200 border border-slate-700 font-semibold">Analyse Structurée</span>
              <span class="text-emerald-400 font-bold text-sm">+</span>
              <span class="px-2.5 py-1 rounded bg-[#1c1c22] text-slate-200 border border-slate-700 font-semibold">Vos Propres Règles</span>
              <span class="text-emerald-400 font-bold text-sm">+</span>
              <span class="px-2.5 py-1 rounded bg-[#1c1c22] text-slate-200 border border-slate-700 font-semibold">Risk Engine</span>
              <span class="text-emerald-400 font-bold text-sm">=</span>
              <span class="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm">
                Décisions Plus Structurées
              </span>
            </div>
          </div>
        </div>

        <!-- Hero Product Visual (High Density Cockpit Terminal) -->
        <div id="product-preview" class="mt-12 lg:mt-16">
          <div class="relative w-full max-w-5xl mx-auto bg-[#141417] border border-slate-800 rounded-xl shadow-2xl shadow-black flex flex-col overflow-hidden">
            
            <!-- Window Topbar -->
            <div class="h-11 border-b border-slate-800 px-4 flex items-center justify-between bg-[#141417] gap-2">
              <div class="flex items-center gap-1.5 shrink-0">
                <div class="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                <span class="text-xs font-mono text-slate-300 tracking-wider uppercase ml-2 hidden md:inline">
                  Terminal Pro — <span class="text-emerald-400 font-semibold">Aperçu de la Plateforme (Données Démo)</span>
                </span>
              </div>

              <!-- Pair Selector Tabs (Forex First + Extension Previews) -->
              <div class="flex items-center gap-1 bg-[#0a0a0b] p-0.5 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar max-w-full">
                @for (pair of marketService.pairs(); track pair.symbol) {
                  <button 
                    type="button"
                    (click)="selectPair(pair.symbol)"
                    [class]="marketService.activePairSymbol() === pair.symbol 
                      ? 'bg-[#1e1e24] text-emerald-400 font-bold border border-slate-700 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'"
                    class="px-2.5 py-1 text-xs font-mono rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1">
                    @if (pair.category === 'COMMODITY') {
                      <span class="text-amber-400 text-[10px]">★ Or (Aperçu)</span>
                    } @else if (pair.category === 'CRYPTO') {
                      <span class="text-indigo-400 text-[10px]">₿ Crypto (Aperçu)</span>
                    }
                    {{ pair.symbol }}
                  </button>
                }
              </div>

              <!-- Live Stream Control -->
              <div class="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  (click)="marketService.toggleLiveStreaming()"
                  [class]="marketService.isLiveStreaming() 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-800/40 text-slate-400 border-slate-700'"
                  class="px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wider border flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Activer/Désactiver la simulation de flux">
                  <span class="w-1.5 h-1.5 rounded-full" [class]="marketService.isLiveStreaming() ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'"></span>
                  <span>{{ marketService.isLiveStreaming() ? 'SIMULATION FLUX' : 'PAUSE' }}</span>
                </button>
              </div>
            </div>

            <!-- Terminal Main Grid -->
            <div class="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-[#0d0d0f]">
              
              <!-- Left Chart Section (8 Cols) -->
              <div class="lg:col-span-8 space-y-5">
                
                <!-- Quote Header with Reactive Real-Time Data -->
                <div class="flex flex-wrap items-end justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <div class="flex items-center gap-2 mb-0.5">
                      <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                        {{ activePair().symbol }}
                      </span>
                      <span class="text-xs text-slate-400 font-sans">
                        {{ activePair().name }}
                      </span>
                      <span class="text-[10px] px-1.5 py-0.2 rounded bg-[#1e1e24] text-slate-400 font-mono border border-slate-800">
                        {{ activePair().category === 'FOREX' ? 'FOREX MAJEUR' : "APERÇU D'EXTENSION" }}
                      </span>
                    </div>
                    
                    <div class="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tighter flex items-center gap-3">
                      <span [class.text-emerald-400]="activePair().lastTickDirection === 'UP'" 
                            [class.text-rose-400]="activePair().lastTickDirection === 'DOWN'"
                            class="transition-colors">
                        {{ activePair().bid }}
                      </span>
                      
                      <span [class]="activePair().change24h >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'" 
                            class="text-xs font-semibold font-mono px-2 py-0.5 rounded border">
                        {{ activePair().change24h >= 0 ? '+' : '' }}{{ activePair().change24h }}% 24h
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-4 text-right">
                    <div>
                      <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spread</div>
                      <div class="text-xs text-slate-200 font-mono font-bold">{{ activePair().spread }} {{ activePair().category === 'FOREX' ? 'pips' : 'pts' }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ask (Achat)</div>
                      <div class="text-xs text-slate-200 font-mono font-bold">{{ activePair().ask }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Biais Marché</div>
                      <div [class]="activePair().bias === 'BULLISH' ? 'text-emerald-400' : activePair().bias === 'BEARISH' ? 'text-rose-400' : 'text-amber-400'" 
                           class="text-xs font-bold uppercase tracking-wider font-mono">
                        {{ activePair().trend.replace('_', ' ') }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- High Density Japanese Candlestick Chart (Chandelier Japonais & Données Réelles) -->
                <div class="h-64 sm:h-72 relative border border-slate-800/90 rounded-lg bg-[#0d0d10] p-2.5 flex flex-col justify-between select-none">
                  
                  <!-- Top Candlestick Toolbar & OHLC Metric Strip -->
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 text-[11px] font-mono">
                    
                    <!-- Left: Timeframe & Indicators Legend -->
                    <div class="flex items-center gap-2">
                      <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px] uppercase">
                        Bougies Japonaises
                      </span>
                      
                      <div class="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
                        <span class="flex items-center gap-1">
                          <span class="w-2 h-0.5 bg-cyan-400 inline-block"></span>
                          <span class="text-cyan-300 font-semibold">EMA 20</span>
                        </span>
                        <span class="flex items-center gap-1">
                          <span class="w-2 h-0.5 bg-amber-400 inline-block"></span>
                          <span class="text-amber-300 font-semibold">EMA 50</span>
                        </span>
                      </div>
                    </div>

                    <!-- Right: Active/Hovered Candle OHLCV Display -->
                    <div class="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
                      <span class="text-slate-400 font-semibold hidden md:inline">{{ activeDisplayCandle()?.timeLabel }}</span>
                      <span><strong class="text-slate-400 font-normal">O:</strong> <span class="text-slate-200">{{ activeDisplayCandle()?.open }}</span></span>
                      <span><strong class="text-slate-400 font-normal">H:</strong> <span class="text-emerald-400">{{ activeDisplayCandle()?.high }}</span></span>
                      <span><strong class="text-slate-400 font-normal">L:</strong> <span class="text-rose-400">{{ activeDisplayCandle()?.low }}</span></span>
                      <span><strong class="text-slate-400 font-normal">C:</strong> <span [class]="(activeDisplayCandle()?.close || 0) >= (activeDisplayCandle()?.open || 0) ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'">{{ activeDisplayCandle()?.close }}</span></span>
                      <span [class]="(activeDisplayCandle()?.close || 0) >= (activeDisplayCandle()?.open || 0) ? 'text-emerald-400' : 'text-rose-400'" class="font-bold hidden sm:inline">
                        {{ displayCandleVariation() }}
                      </span>
                    </div>
                  </div>

                  <!-- SVG Japanese Candlestick Chart Stage -->
                  <div class="relative flex-1 w-full mt-1">
                    
                    <svg class="w-full h-full" viewBox="0 0 540 185" preserveAspectRatio="none">
                      <defs>
                        <!-- Glow filters for live price -->
                        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      <!-- Background Grid Lines (Horizontal Price Levels) -->
                      @for (tick of priceAxisTicks(); track tick.price) {
                        <line x1="10" [attr.y1]="tick.y" x2="475" [attr.y2]="tick.y" stroke="#1c1c22" stroke-dasharray="2 3" stroke-width="1" />
                        <!-- Y-Axis Price Label on the Right -->
                        <text x="482" [attr.y]="tick.y + 3" fill="#64748b" font-size="8.5" font-family="monospace">{{ tick.price }}</text>
                      }

                      <!-- Volume Sub-Grid Separator -->
                      <line x1="10" y1="150" x2="475" y2="150" stroke="#1e1e26" stroke-dasharray="1 3" stroke-width="1" />
                      <text x="14" y="146" fill="#475569" font-size="7.5" font-family="monospace">VOL</text>

                      <!-- EMA 50 Path (Amber) -->
                      @if (ema50Path()) {
                        <path [attr.d]="ema50Path()" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.8" stroke-dasharray="4 2" />
                      }

                      <!-- EMA 20 Path (Cyan) -->
                      @if (ema20Path()) {
                        <path [attr.d]="ema20Path()" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.9" />
                      }

                      <!-- Take Profit Target Level Projection -->
                      <line x1="300" [attr.y1]="tpLineY()" x2="475" [attr.y2]="tpLineY()" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3 3" />
                      <text x="310" [attr.y]="tpLineY() - 3" fill="#10b981" font-size="7.5" font-family="monospace" font-weight="bold">TP: {{ targetTP() }}</text>

                      <!-- Stop Loss Invalidation Level Projection -->
                      <line x1="300" [attr.y1]="slLineY()" x2="475" [attr.y2]="slLineY()" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3 3" />
                      <text x="310" [attr.y]="slLineY() + 9" fill="#ef4444" font-size="7.5" font-family="monospace" font-weight="bold">SL INVALIDATION</text>

                      <!-- Japanese Candlesticks (Bougies Japonaises) + Volume Bars -->
                      @for (c of renderedCandles(); track c.index) {
                        <g (mouseenter)="hoverCandle(c)" (mouseleave)="unhoverCandle()" class="cursor-crosshair">
                          <!-- Invisible wide hover hit zone -->
                          <rect [attr.x]="c.cx - 8" y="0" width="16" height="185" fill="transparent" />

                          <!-- Volume Bar at Bottom -->
                          <rect [attr.x]="c.cx - c.bodyWidth / 2" 
                                [attr.y]="c.volY" 
                                [attr.width]="c.bodyWidth" 
                                [attr.height]="c.volHeight" 
                                [attr.fill]="c.isBullish ? 'rgba(16, 185, 129, 0.45)' : 'rgba(244, 63, 94, 0.45)'" 
                                rx="0.5" />

                          <!-- Candlestick Wick (Mèche Haute & Basse) -->
                          <line [attr.x1]="c.cx" 
                                [attr.y1]="c.wickTopY" 
                                [attr.x2]="c.cx" 
                                [attr.y2]="c.wickBottomY" 
                                [attr.stroke]="c.isBullish ? '#10b981' : '#f43f5e'" 
                                stroke-width="1.5" />

                          <!-- Candlestick Body (Corps de la Bougie) -->
                          <rect [attr.x]="c.cx - c.bodyWidth / 2" 
                                [attr.y]="c.bodyY" 
                                [attr.width]="c.bodyWidth" 
                                [attr.height]="c.bodyHeight" 
                                [attr.fill]="c.isBullish ? '#10b981' : '#f43f5e'" 
                                [attr.stroke]="c.isBullish ? '#10b981' : '#f43f5e'" 
                                stroke-width="0.5"
                                rx="1" />
                        </g>
                      }

                      <!-- Live Price Line & Tracker Marker -->
                      <line x1="10" [attr.y1]="livePriceY()" x2="475" [attr.y2]="livePriceY()" stroke="#38bdf8" stroke-dasharray="2 2" stroke-width="1" />
                      
                      <!-- Live Price Glowing Dot at the last candle -->
                      @if (lastCandle(); as last) {
                        <circle [attr.cx]="last.cx" [attr.cy]="livePriceY()" r="3.5" fill="#38bdf8" filter="url(#glow-emerald)" />
                        <circle [attr.cx]="last.cx" [attr.cy]="livePriceY()" r="1.5" fill="#ffffff" />
                      }

                      <!-- Live Price Tag Pill on Right Axis -->
                      <g [attr.transform]="'translate(478, ' + (livePriceY() - 7) + ')'">
                        <rect x="0" y="0" width="58" height="14" rx="2" [attr.fill]="activePair().lastTickDirection === 'UP' ? '#065f46' : activePair().lastTickDirection === 'DOWN' ? '#881337' : '#1e293b'" stroke="#475569" stroke-width="0.5" />
                        <text x="29" y="10" fill="#ffffff" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="middle">
                          {{ activePair().bid }}
                        </text>
                      </g>

                      <!-- Interactive Hover Crosshair -->
                      @if (hoveredCandle(); as hov) {
                        <line [attr.x1]="hov.cx" y1="0" [attr.x2]="hov.cx" y2="180" stroke="#94a3b8" stroke-width="0.75" stroke-dasharray="2 2" />
                        <line x1="10" [attr.y1]="hov.bodyY" x2="475" [attr.y2]="hov.bodyY" stroke="#94a3b8" stroke-width="0.75" stroke-dasharray="2 2" />
                      }
                    </svg>

                    <!-- Status Overlay Badge (Calculated Signal) -->
                    <div class="absolute top-2 left-2 p-1 px-2 bg-[#141417]/90 backdrop-blur-sm border border-slate-800 rounded text-[9px] font-mono flex items-center gap-1.5 shadow-md">
                      <span class="text-slate-400 uppercase font-bold">Signal Calculé:</span>
                      <span class="text-emerald-400 font-bold">{{ activePair().bias === 'BULLISH' ? 'BUY_SETUP' : activePair().bias === 'BEARISH' ? 'SELL_SETUP' : 'WAIT_CONFIRM' }}</span>
                    </div>

                  </div>

                  <!-- Bottom Time Axis Labels -->
                  <div class="flex items-center justify-between text-[9px] font-mono text-slate-400 px-3 pt-1 border-t border-slate-800/60">
                    @for (t of timeAxisLabels(); track t.label) {
                      <span>{{ t.label }}</span>
                    }
                  </div>

                </div>

                <!-- Footer Timeframe Controls & Live Ticks -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1">
                  
                  <!-- Timeframe Switcher (M15, H1, H4, D1) with Real Coherent Data -->
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-slate-400 uppercase font-bold">Timeframe:</span>
                    <div class="flex gap-1 bg-[#141417] p-0.5 rounded border border-slate-800">
                      @for (tf of marketService.timeframeOptions; track tf.id) {
                        <button (click)="marketService.setTimeframe(tf.id)" 
                                [class]="marketService.selectedTimeframe() === tf.id ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200 border border-transparent'" 
                                class="px-2.5 py-0.5 rounded text-[11px] cursor-pointer transition-all">
                          {{ tf.id }}
                        </button>
                      }
                    </div>
                    
                    <!-- Timeframe Meaning Description -->
                    <span class="text-[10px] text-slate-400 hidden sm:inline border-l border-slate-800 pl-2">
                      {{ currentTimeframeInfo().name }} ({{ currentTimeframeInfo().desc }})
                    </span>
                  </div>

                  <div class="text-[11px] text-slate-400 font-mono">
                    Haut Période: <span class="text-slate-200">{{ periodHigh() }}</span> | Bas Période: <span class="text-slate-200">{{ periodLow() }}</span>
                  </div>
                </div>

              </div>

              <!-- Right Metric Cards (4 Cols) -->
              <div class="lg:col-span-4 space-y-3.5">
                
                <!-- Signal Alignment Card (Renamed with Required Disclaimer) -->
                <div class="p-3.5 bg-[#1a1a1e] border border-slate-800 rounded-lg space-y-2">
                  <div class="text-[10px] text-slate-300 uppercase font-bold tracking-widest flex items-center justify-between">
                    <span class="flex items-center gap-1">
                      <span class="mat-icon text-xs text-emerald-400">insights</span>
                      Alignement des signaux
                    </span>
                    <span class="text-emerald-400 font-mono font-bold">{{ activePair().aiConfidence }}%</span>
                  </div>
                  <div class="flex items-end justify-between">
                    <div class="text-2xl font-bold text-white font-mono">{{ activePair().aiConfidence }}%</div>
                    <div class="text-[10px] text-emerald-400 font-bold mb-1 uppercase font-mono">Convergence Forte</div>
                  </div>
                  <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 transition-all duration-500" [style.width.%]="activePair().aiConfidence"></div>
                  </div>
                  <!-- Mandatory Disclaimer Callout -->
                  <p class="text-[9px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80 font-mono">
                    Score interne indiquant le niveau de convergence entre les critères d'analyse configurés. Il ne représente pas une probabilité de gain.
                  </p>
                </div>

                <!-- Risk Engine Parameters Card -->
                <div class="p-3.5 bg-[#1a1a1e] border border-slate-800 rounded-lg space-y-2.5">
                  <div class="text-[10px] text-slate-300 uppercase font-bold tracking-widest flex items-center justify-between">
                    <span class="flex items-center gap-1 text-slate-200">
                      <span class="mat-icon text-xs text-emerald-400">shield</span>
                      Vos Règles de Risque
                    </span>
                    <span class="text-emerald-400 font-mono text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                      GARDE-FOU STRICT
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="bg-[#141417] p-2 rounded border border-slate-800">
                      <div class="text-[9px] text-slate-400 uppercase font-mono font-medium">Risque / Trade</div>
                      <div class="text-xs font-mono text-white font-bold">1.0% Capital</div>
                    </div>
                    <div class="bg-[#141417] p-2 rounded border border-slate-800">
                      <div class="text-[9px] text-slate-400 uppercase font-mono font-medium">Perte Max Jour</div>
                      <div class="text-xs font-mono text-rose-400 font-bold">2.0% Arrêt Auto</div>
                    </div>
                  </div>
                  <div class="text-[9px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Confirmation Manuelle :</span>
                    <span class="text-emerald-400 font-bold">ACTIVE (ON)</span>
                  </div>
                </div>

                <!-- MT5 Gateway Card (Connected Demo) -->
                <div class="p-3.5 bg-[#1a1a1e] border border-slate-800 rounded-lg space-y-2">
                  <div class="text-[10px] text-slate-300 uppercase font-bold tracking-widest flex items-center justify-between">
                    <span class="flex items-center gap-1">
                      <span class="mat-icon text-xs text-emerald-400">hub</span>
                      Passerelle MT5 (Comptes Démo)
                    </span>
                    <span class="text-[9px] text-emerald-400 font-mono font-bold">0.4ms</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span class="font-bold text-white font-mono text-[11px]">Compte Démo Connecté</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono font-bold">#78491029</span>
                  </div>
                  <p class="text-[9px] text-slate-400 font-mono leading-tight">
                    Vous connectez vos propres comptes. Vos fonds restent chez votre broker.
                  </p>
                </div>

                <!-- Economic Alert Mini -->
                <div class="p-3 bg-[#1a1a1e] border border-amber-500/20 rounded-lg text-xs space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold uppercase">
                    <span class="flex items-center gap-1">
                      <span class="mat-icon text-xs text-amber-400">calendar_month</span>
                      Filtre Événements Éco
                    </span>
                    <span>14:30 GMT+1</span>
                  </div>
                  <p class="text-[10px] text-slate-300 leading-tight">
                    Pause automatique des signaux 15 min avant les annonces à fort impact (CPI / NFP / Taux).
                  </p>
                </div>

              </div>

            </div>

            <!-- Terminal Bottom Strip -->
            <div class="border-t border-slate-800 p-3 px-5 bg-[#141417] flex flex-wrap justify-between items-center gap-2">
              <div class="flex flex-wrap gap-4 text-[10px] text-slate-300 uppercase font-bold tracking-widest font-mono">
                <span>Technique: <span class="text-white">{{ activePair().bias }}</span></span>
                <span>Type: <span class="text-emerald-400">{{ activePair().category }}</span></span>
                <span>Dernier Tick: <span class="text-slate-200">{{ activePair().lastUpdated }}</span></span>
              </div>
              <div class="text-[10px] text-slate-400 font-mono font-semibold">
                APERÇU DE LA PLATEFORME (DONNÉES ILLUSTRATIVES) // AUCUNE PROMESSE DE GAIN
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class HeroComponent {
  marketService = inject(MarketDemoService);
  hoveredCandle = signal<RenderedCandle | null>(null);

  activePair = computed(() => this.marketService.activePair());
  activeCandles = computed(() => this.marketService.activeCandles());

  selectPair(symbol: string) {
    this.marketService.setActivePair(symbol);
  }

  // Current timeframe metadata
  currentTimeframeInfo = computed(() => {
    const selected = this.marketService.selectedTimeframe();
    return this.marketService.timeframeOptions.find(t => t.id === selected) || this.marketService.timeframeOptions[2];
  });

  // Calculate high/low for active candle series
  periodHigh = computed(() => {
    const candles = this.activeCandles();
    if (!candles || candles.length === 0) return this.activePair().high24h.toFixed(this.activePair().digits);
    const max = Math.max(...candles.map(c => c.high));
    return max.toFixed(this.activePair().digits);
  });

  periodLow = computed(() => {
    const candles = this.activeCandles();
    if (!candles || candles.length === 0) return this.activePair().low24h.toFixed(this.activePair().digits);
    const min = Math.min(...candles.map(c => c.low));
    return min.toFixed(this.activePair().digits);
  });

  // Candlestick Geometry Calculations
  renderedCandles = computed<RenderedCandle[]>(() => {
    const candles = this.activeCandles();
    const pair = this.activePair();
    if (!candles || candles.length === 0) return [];

    const minPrice = Math.min(...candles.map(c => c.low));
    const maxPrice = Math.max(...candles.map(c => c.high));
    const padding = (maxPrice - minPrice) * 0.08 || 0.0005;

    const yMin = minPrice - padding;
    const yMax = maxPrice + padding;
    const yRange = yMax - yMin || 0.001;

    const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;

    // SVG coordinates boundaries
    const chartLeft = 18;
    const chartRight = 468;
    const chartTop = 15;
    const chartHeight = 125; // price canvas
    const volBottom = 178;
    const maxVolHeight = 26;

    const totalCandles = candles.length;
    const slotWidth = (chartRight - chartLeft) / totalCandles;
    const bodyWidth = Math.max(3.5, Math.min(10, slotWidth * 0.65));

    const tf = this.marketService.selectedTimeframe();

    return candles.map((c, idx) => {
      const cx = chartLeft + idx * slotWidth + slotWidth / 2;
      
      const yFor = (price: number) => {
        const normalized = (price - yMin) / yRange;
        return chartTop + (1 - normalized) * chartHeight;
      };

      const wickTopY = yFor(c.high);
      const wickBottomY = yFor(c.low);
      const topBodyPrice = Math.max(c.open, c.close);
      const bottomBodyPrice = Math.min(c.open, c.close);
      const bodyY = yFor(topBodyPrice);
      const bodyBottomY = yFor(bottomBodyPrice);
      const bodyHeight = Math.max(2, bodyBottomY - bodyY);
      const isBullish = c.close >= c.open;
      const changePct = c.open > 0 ? ((c.close - c.open) / c.open) * 100 : 0;

      // Volume bar
      const volHeight = Math.max(2, (c.volume / maxVolume) * maxVolHeight);
      const volY = volBottom - volHeight;

      // Time formatting based on timeframe
      const date = new Date(c.timestamp);
      let timeLabel = '';
      if (tf === 'D1') {
        timeLabel = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      } else {
        timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }

      return {
        candle: c,
        index: idx,
        cx,
        wickTopY,
        wickBottomY,
        bodyY,
        bodyHeight,
        bodyWidth,
        isBullish,
        volY,
        volHeight,
        changePct,
        timeLabel,
        open: c.open.toFixed(pair.digits),
        high: c.high.toFixed(pair.digits),
        low: c.low.toFixed(pair.digits),
        close: c.close.toFixed(pair.digits),
        volume: c.volume
      };
    });
  });

  lastCandle = computed(() => {
    const list = this.renderedCandles();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  // Active Candle for top status bar (Hovered or Latest)
  activeDisplayCandle = computed(() => {
    return this.hoveredCandle() || this.lastCandle();
  });

  displayCandleVariation = computed(() => {
    const c = this.activeDisplayCandle();
    if (!c) return '0.00%';
    const sign = c.changePct >= 0 ? '+' : '';
    return `${sign}${c.changePct.toFixed(2)}%`;
  });

  // Price Axis Ticks for Grid
  priceAxisTicks = computed(() => {
    const candles = this.activeCandles();
    const pair = this.activePair();
    if (!candles || candles.length === 0) {
      return [
        { y: 20, price: (pair.bid * 1.003).toFixed(pair.digits) },
        { y: 60, price: (pair.bid * 1.001).toFixed(pair.digits) },
        { y: 100, price: (pair.bid * 0.999).toFixed(pair.digits) },
        { y: 135, price: (pair.bid * 0.997).toFixed(pair.digits) }
      ];
    }

    const minPrice = Math.min(...candles.map(c => c.low));
    const maxPrice = Math.max(...candles.map(c => c.high));
    const padding = (maxPrice - minPrice) * 0.08 || 0.0005;

    const yMin = minPrice - padding;
    const yMax = maxPrice + padding;
    const yRange = yMax - yMin || 0.001;

    const chartTop = 15;
    const chartHeight = 125;

    const levels = [
      { ratio: 0.95, y: chartTop + (1 - 0.95) * chartHeight },
      { ratio: 0.65, y: chartTop + (1 - 0.65) * chartHeight },
      { ratio: 0.35, y: chartTop + (1 - 0.35) * chartHeight },
      { ratio: 0.05, y: chartTop + (1 - 0.05) * chartHeight }
    ];

    return levels.map(l => {
      const priceVal = yMin + l.ratio * yRange;
      return {
        y: l.y,
        price: priceVal.toFixed(pair.digits)
      };
    });
  });

  // Bottom Time Axis Labels
  timeAxisLabels = computed(() => {
    const rendered = this.renderedCandles();
    if (rendered.length === 0) return [];

    const indices = [
      0,
      Math.floor(rendered.length * 0.33),
      Math.floor(rendered.length * 0.66),
      rendered.length - 1
    ];

    return indices.map(idx => ({
      x: rendered[idx]?.cx || 0,
      label: rendered[idx]?.timeLabel || ''
    }));
  });

  // EMA 20 Calculation Path (Cyan Line)
  ema20Path = computed(() => {
    const rendered = this.renderedCandles();
    if (rendered.length < 3) return '';

    const k = 2 / (14 + 1); // Fast EMA period
    let ema = rendered[0].candle.close;

    const points = rendered.map((rc, i) => {
      if (i > 0) {
        ema = rc.candle.close * k + ema * (1 - k);
      }
      
      const candles = this.activeCandles();
      const minPrice = Math.min(...candles.map(c => c.low));
      const maxPrice = Math.max(...candles.map(c => c.high));
      const padding = (maxPrice - minPrice) * 0.08 || 0.0005;
      const yMin = minPrice - padding;
      const yMax = maxPrice + padding;
      const yRange = yMax - yMin || 0.001;

      const y = 15 + (1 - (ema - yMin) / yRange) * 125;
      return `${rc.cx.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M${points.join(' L')}`;
  });

  // EMA 50 Calculation Path (Amber Line)
  ema50Path = computed(() => {
    const rendered = this.renderedCandles();
    if (rendered.length < 5) return '';

    const k = 2 / (24 + 1); // Baseline EMA period
    let ema = rendered[0].candle.close;

    const points = rendered.map((rc, i) => {
      if (i > 0) {
        ema = rc.candle.close * k + ema * (1 - k);
      }
      
      const candles = this.activeCandles();
      const minPrice = Math.min(...candles.map(c => c.low));
      const maxPrice = Math.max(...candles.map(c => c.high));
      const padding = (maxPrice - minPrice) * 0.08 || 0.0005;
      const yMin = minPrice - padding;
      const yMax = maxPrice + padding;
      const yRange = yMax - yMin || 0.001;

      const y = 15 + (1 - (ema - yMin) / yRange) * 125;
      return `${rc.cx.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M${points.join(' L')}`;
  });

  // Live Price Y Position for dynamic line & badge
  livePriceY = computed(() => {
    const pair = this.activePair();
    const candles = this.activeCandles();
    if (!candles || candles.length === 0) return 75;

    const minPrice = Math.min(...candles.map(c => c.low));
    const maxPrice = Math.max(...candles.map(c => c.high));
    const padding = (maxPrice - minPrice) * 0.08 || 0.0005;
    const yMin = minPrice - padding;
    const yMax = maxPrice + padding;
    const yRange = yMax - yMin || 0.001;

    const norm = (pair.bid - yMin) / yRange;
    const y = 15 + (1 - norm) * 125;
    return Math.max(15, Math.min(142, y));
  });

  // Take Profit Y position
  tpLineY = computed(() => {
    const mult = this.activePair().bias === 'BEARISH' ? 1 : -1;
    return Math.max(18, Math.min(138, this.livePriceY() + (mult * 28)));
  });

  // Stop Loss Y position
  slLineY = computed(() => {
    const mult = this.activePair().bias === 'BEARISH' ? -1 : 1;
    return Math.max(18, Math.min(138, this.livePriceY() + (mult * 22)));
  });

  // Dynamic Take Profit Target Label
  targetTP = computed(() => {
    const pair = this.activePair();
    const mult = pair.bias === 'BEARISH' ? -1 : 1;
    let target = pair.bid;

    if (pair.category === 'CRYPTO') {
      target = pair.bid + (mult * 1850);
      return `$${target.toFixed(2)} (${mult > 0 ? '+' : ''}$1850)`;
    } else if (pair.category === 'COMMODITY') {
      target = pair.bid + (mult * 35.0);
      return `$${target.toFixed(2)} (${mult > 0 ? '+' : ''}$35)`;
    } else if (pair.symbol === 'USD/JPY') {
      target = pair.bid + (mult * 0.80);
      return `${target.toFixed(3)} (${mult > 0 ? '+' : ''}80p)`;
    } else {
      target = pair.bid + (mult * 0.0040);
      return `${target.toFixed(5)} (${mult > 0 ? '+' : ''}40p)`;
    }
  });

  hoverCandle(candle: RenderedCandle) {
    this.hoveredCandle.set(candle);
  }

  unhoverCandle() {
    this.hoveredCandle.set(null);
  }
}

