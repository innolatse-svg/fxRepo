import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Candle, TimeframeType } from '../../../core/models/market-intelligence.model';
import { MarketDemoService } from '../../../core/services/market-demo.service';
import { ThemeService } from '../../../core/services/theme.service';

export type ChartType = 'CANDLESTICK' | 'AREA';
export type SubPanelType = 'NONE' | 'VOLUME' | 'RSI' | 'MACD';

export interface MarketStructurePoint {
  index: number;
  type: 'HH' | 'HL' | 'LH' | 'LL';
  price: number;
  time: number;
}

export interface FvgZone {
  startIndex: number;
  topPrice: number;
  bottomPrice: number;
  type: 'BULLISH' | 'BEARISH';
}

export interface SupportResistanceLevel {
  price: number;
  type: 'RESISTANCE' | 'SUPPORT' | 'PIVOT';
  label: string;
  strength: number;
}

@Component({
  selector: 'app-financial-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DecimalPipe, MatIconModule],
  template: `
    <div 
      class="financial-chart-container flex flex-col bg-white dark:bg-[#0B0E14] text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-lg dark:shadow-2xl relative select-none w-full h-full"
      [class.compact-mode]="compact">
      
      <!-- ======================================================== -->
      <!-- TOP TOOLBAR & CONTROLS (Full mode or Mini toolbar)       -->
      <!-- ======================================================== -->
      <div class="px-3 sm:px-4 py-2.5 bg-slate-50 dark:bg-[#0e121a] border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 z-10">
        
        <!-- Left: Pair Symbol, Price, Live Badge & Chart Type -->
        <div class="flex items-center flex-wrap gap-2 sm:gap-3">
          <!-- Symbol & Live Indicator -->
          <div class="flex items-center gap-2">
            <span class="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
              {{ symbol }}
            </span>
            <span 
              class="w-2 h-2 rounded-full"
              [class.bg-emerald-500]="isLiveStreaming()"
              [class.animate-pulse]="isLiveStreaming()"
              [class.bg-slate-400]="!isLiveStreaming()"
              [class.dark:bg-slate-500]="!isLiveStreaming()"
              [title]="isLiveStreaming() ? 'Flux direct actif' : 'Flux suspendu'">
            </span>
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {{ selectedTimeframe() }}
            </span>
          </div>

          <!-- Current Live Price & Change -->
          @if (currentPrice()) {
            <div class="flex items-baseline gap-1.5 font-mono text-xs sm:text-sm">
              <span 
                class="font-black"
                [class.text-emerald-600]="priceChange() >= 0"
                [class.dark:text-emerald-400]="priceChange() >= 0"
                [class.text-rose-600]="priceChange() < 0"
                [class.dark:text-rose-400]="priceChange() < 0">
                {{ formatPrice(currentPrice()) }}
              </span>
              <span 
                class="text-[10px] font-bold"
                [class.text-emerald-600]="priceChange() >= 0"
                [class.dark:text-emerald-400]="priceChange() >= 0"
                [class.text-rose-600]="priceChange() < 0"
                [class.dark:text-rose-400]="priceChange() < 0">
                {{ priceChange() >= 0 ? '+' : '' }}{{ priceChange() | number:'1.2-2' }}%
              </span>
            </div>
          }

          <!-- Spread indicator -->
          <div class="hidden md:flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
            <span>Spread:</span>
            <span class="text-slate-800 dark:text-slate-200 font-bold">{{ spreadPips() }} pips</span>
          </div>

          <!-- Chart Style Toggle (Candles vs Area) -->
          <div class="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900/90 p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
            <button 
              type="button"
              (click)="setChartType('CANDLESTICK')"
              class="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              [class.bg-emerald-500/15]="chartType() === 'CANDLESTICK'"
              [class.dark:bg-emerald-500/20]="chartType() === 'CANDLESTICK'"
              [class.text-emerald-700]="chartType() === 'CANDLESTICK'"
              [class.dark:text-emerald-400]="chartType() === 'CANDLESTICK'"
              [class.font-bold]="chartType() === 'CANDLESTICK'"
              [class.text-slate-600]="chartType() !== 'CANDLESTICK'"
              [class.dark:text-slate-400]="chartType() !== 'CANDLESTICK'">
              <span class="mat-icon text-xs">candlestick_chart</span>
              <span class="hidden sm:inline">Bougies</span>
            </button>
            <button 
              type="button"
              (click)="setChartType('AREA')"
              class="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              [class.bg-emerald-500/15]="chartType() === 'AREA'"
              [class.dark:bg-emerald-500/20]="chartType() === 'AREA'"
              [class.text-emerald-700]="chartType() === 'AREA'"
              [class.dark:text-emerald-400]="chartType() === 'AREA'"
              [class.font-bold]="chartType() === 'AREA'"
              [class.text-slate-600]="chartType() !== 'AREA'"
              [class.dark:text-slate-400]="chartType() !== 'AREA'">
              <span class="mat-icon text-xs">show_chart</span>
              <span class="hidden sm:inline">Ligne</span>
            </button>
          </div>
        </div>

        <!-- Middle / Timeframe Selectors -->
        <div class="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
          @for (tf of timeframes; track tf) {
            <button
              type="button"
              (click)="onTimeframeChange(tf)"
              class="px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap"
              [class.bg-emerald-500]="selectedTimeframe() === tf"
              [class.text-slate-950]="selectedTimeframe() === tf"
              [class.shadow-xs]="selectedTimeframe() === tf"
              [class.bg-slate-100]="selectedTimeframe() !== tf"
              [class.dark:bg-slate-900]="selectedTimeframe() !== tf"
              [class.text-slate-600]="selectedTimeframe() !== tf"
              [class.dark:text-slate-400]="selectedTimeframe() !== tf"
              [class.hover:text-slate-900]="selectedTimeframe() !== tf"
              [class.dark:hover:text-white]="selectedTimeframe() !== tf"
              [class.hover:bg-slate-200]="selectedTimeframe() !== tf"
              [class.dark:hover:bg-slate-800]="selectedTimeframe() !== tf">
              {{ tf }}
            </button>
          }
        </div>

        <!-- Right: Indicators & Viewport Actions -->
        <div class="flex items-center gap-1.5">
          @if (!compact) {
            <!-- EMA Overlays Dropdown / Toggle -->
            <button 
              type="button"
              (click)="toggleEmaOverlay()"
              class="px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1 cursor-pointer"
              [class.bg-sky-50]="showEma()"
              [class.dark:bg-sky-500/15]="showEma()"
              [class.text-sky-700]="showEma()"
              [class.dark:text-sky-300]="showEma()"
              [class.border-sky-300]="showEma()"
              [class.dark:border-sky-500/40]="showEma()"
              [class.bg-slate-100]="!showEma()"
              [class.dark:bg-slate-900]="!showEma()"
              [class.text-slate-600]="!showEma()"
              [class.dark:text-slate-400]="!showEma()"
              [class.border-slate-200]="!showEma()"
              [class.dark:border-slate-800]="!showEma()">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>
              <span>EMA</span>
            </button>

            <!-- S/R Levels Toggle -->
            <button 
              type="button"
              (click)="toggleSrOverlay()"
              class="px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1 cursor-pointer"
              [class.bg-amber-50]="showSr()"
              [class.dark:bg-amber-500/15]="showSr()"
              [class.text-amber-800]="showSr()"
              [class.dark:text-amber-300]="showSr()"
              [class.border-amber-300]="showSr()"
              [class.dark:border-amber-500/40]="showSr()"
              [class.bg-slate-100]="!showSr()"
              [class.dark:bg-slate-900]="!showSr()"
              [class.text-slate-600]="!showSr()"
              [class.dark:text-slate-400]="!showSr()"
              [class.border-slate-200]="!showSr()"
              [class.dark:border-slate-800]="!showSr()">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
              <span>S/R</span>
            </button>

            <!-- FVG Imbalances Toggle -->
            <button 
              type="button"
              (click)="toggleFvgOverlay()"
              class="hidden sm:flex px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors items-center gap-1 cursor-pointer"
              [class.bg-indigo-50]="showFvg()"
              [class.dark:bg-indigo-500/15]="showFvg()"
              [class.text-indigo-700]="showFvg()"
              [class.dark:text-indigo-300]="showFvg()"
              [class.border-indigo-300]="showFvg()"
              [class.dark:border-indigo-500/40]="showFvg()"
              [class.bg-slate-100]="!showFvg()"
              [class.dark:bg-slate-900]="!showFvg()"
              [class.text-slate-600]="!showFvg()"
              [class.dark:text-slate-400]="!showFvg()"
              [class.border-slate-200]="!showFvg()"
              [class.dark:border-slate-800]="!showFvg()">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
              <span>FVG</span>
            </button>

            <!-- Structure HH/LL Toggle -->
            <button 
              type="button"
              (click)="toggleStructureOverlay()"
              class="hidden sm:flex px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors items-center gap-1 cursor-pointer"
              [class.bg-teal-50]="showStructure()"
              [class.dark:bg-teal-500/15]="showStructure()"
              [class.text-teal-800]="showStructure()"
              [class.dark:text-teal-300]="showStructure()"
              [class.border-teal-300]="showStructure()"
              [class.dark:border-teal-500/40]="showStructure()"
              [class.bg-slate-100]="!showStructure()"
              [class.dark:bg-slate-900]="!showStructure()"
              [class.text-slate-600]="!showStructure()"
              [class.dark:text-slate-400]="!showStructure()"
              [class.border-slate-200]="!showStructure()"
              [class.dark:border-slate-800]="!showStructure()">
              <span class="mat-icon text-xs">tune</span>
              <span>SMC</span>
            </button>

            <!-- Sub-panel Selector (Volume, RSI, MACD) -->
            <div class="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                (click)="setSubPanel('NONE')"
                [class.bg-white]="activeSubPanel() === 'NONE'"
                [class.dark:bg-slate-800]="activeSubPanel() === 'NONE'"
                [class.text-slate-900]="activeSubPanel() === 'NONE'"
                [class.dark:text-white]="activeSubPanel() === 'NONE'"
                [class.shadow-2xs]="activeSubPanel() === 'NONE'"
                [class.text-slate-500]="activeSubPanel() !== 'NONE'"
                [class.dark:text-slate-400]="activeSubPanel() !== 'NONE'"
                class="px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer font-medium">
                OFF
              </button>
              <button
                type="button"
                (click)="setSubPanel('VOLUME')"
                [class.bg-white]="activeSubPanel() === 'VOLUME'"
                [class.dark:bg-slate-800]="activeSubPanel() === 'VOLUME'"
                [class.text-slate-900]="activeSubPanel() === 'VOLUME'"
                [class.dark:text-white]="activeSubPanel() === 'VOLUME'"
                [class.shadow-2xs]="activeSubPanel() === 'VOLUME'"
                [class.text-slate-500]="activeSubPanel() !== 'VOLUME'"
                [class.dark:text-slate-400]="activeSubPanel() !== 'VOLUME'"
                class="px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer font-medium">
                VOL
              </button>
              <button
                type="button"
                (click)="setSubPanel('RSI')"
                [class.bg-white]="activeSubPanel() === 'RSI'"
                [class.dark:bg-slate-800]="activeSubPanel() === 'RSI'"
                [class.text-slate-900]="activeSubPanel() === 'RSI'"
                [class.dark:text-white]="activeSubPanel() === 'RSI'"
                [class.shadow-2xs]="activeSubPanel() === 'RSI'"
                [class.text-slate-500]="activeSubPanel() !== 'RSI'"
                [class.dark:text-slate-400]="activeSubPanel() !== 'RSI'"
                class="px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer font-medium">
                RSI
              </button>
              <button
                type="button"
                (click)="setSubPanel('MACD')"
                [class.bg-white]="activeSubPanel() === 'MACD'"
                [class.dark:bg-slate-800]="activeSubPanel() === 'MACD'"
                [class.text-slate-900]="activeSubPanel() === 'MACD'"
                [class.dark:text-white]="activeSubPanel() === 'MACD'"
                [class.shadow-2xs]="activeSubPanel() === 'MACD'"
                [class.text-slate-500]="activeSubPanel() !== 'MACD'"
                [class.dark:text-slate-400]="activeSubPanel() !== 'MACD'"
                class="px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer font-medium">
                MACD
              </button>
            </div>
          }

          <!-- Zoom & Reset Actions -->
          <div class="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              (click)="zoomIn()"
              title="Zoom avant"
              class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span class="mat-icon text-sm">zoom_in</span>
            </button>
            <button 
              type="button"
              (click)="zoomOut()"
              title="Zoom arrière"
              class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span class="mat-icon text-sm">zoom_out</span>
            </button>
            <button 
              type="button"
              (click)="resetView()"
              title="Recentrer et adapter l'échelle"
              class="px-2 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-mono font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span class="mat-icon text-xs">restart_alt</span>
              <span class="hidden sm:inline">Auto</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- HUD / CROSSHAIR REALTIME DATA BAR                        -->
      <!-- ======================================================== -->
      <div class="px-4 py-1.5 bg-slate-50/90 dark:bg-[#090b10] border-b border-slate-200 dark:border-slate-900 text-[11px] font-mono flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 z-10 min-h-[28px]">
        @if (hoveredCandle(); as hc) {
          <div class="flex items-center flex-wrap gap-x-3 gap-y-0.5">
            <span class="text-slate-900 dark:text-slate-300 font-bold">{{ hc.timeLabel }}</span>
            <span>O: <strong class="text-slate-900 dark:text-white">{{ formatPrice(hc.open) }}</strong></span>
            <span>H: <strong class="text-emerald-600 dark:text-emerald-400">{{ formatPrice(hc.high) }}</strong></span>
            <span>L: <strong class="text-rose-600 dark:text-rose-400">{{ formatPrice(hc.low) }}</strong></span>
            <span>C: <strong [class.text-emerald-600]="hc.close >= hc.open" [class.dark:text-emerald-400]="hc.close >= hc.open" [class.text-rose-600]="hc.close < hc.open" [class.dark:text-rose-400]="hc.close < hc.open">{{ formatPrice(hc.close) }}</strong></span>
            <span>Vol: <strong class="text-slate-800 dark:text-slate-200">{{ hc.volume | number }}</strong></span>
            <span [class.text-emerald-600]="hc.close >= hc.open" [class.dark:text-emerald-400]="hc.close >= hc.open" [class.text-rose-600]="hc.close < hc.open" [class.dark:text-rose-400]="hc.close < hc.open">
              {{ hc.close >= hc.open ? '+' : '' }}{{ (((hc.close - hc.open) / (hc.open || 1)) * 100) | number:'1.2-2' }}%
            </span>
          </div>

          <!-- Hovered Indicator Values -->
          <div class="hidden lg:flex items-center gap-3 text-[10px]">
            @if (showEma()) {
              <span class="text-sky-600 dark:text-sky-400 font-medium">EMA(20): {{ formatPrice(hoveredEma20()) }}</span>
              <span class="text-amber-600 dark:text-amber-400 font-medium">EMA(50): {{ formatPrice(hoveredEma50()) }}</span>
              <span class="text-purple-600 dark:text-purple-400 font-medium">EMA(200): {{ formatPrice(hoveredEma200()) }}</span>
            }
            @if (activeSubPanel() === 'RSI') {
              <span class="text-indigo-600 dark:text-indigo-400 font-medium">RSI(14): {{ hoveredRsi() | number:'1.1-1' }}</span>
            }
            @if (activeSubPanel() === 'MACD') {
              <span class="text-sky-600 dark:text-sky-400 font-medium">MACD: {{ hoveredMacd() | number:'1.4-4' }}</span>
            }
          </div>
        } @else {
          <div class="flex items-center gap-3 text-slate-500 dark:text-slate-500">
            <span>Survolez le graphique pour explorer les cours OHLC et la liquidité</span>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
            <span>Molette : Zoom &bull; Glisser : Déplacement</span>
          </div>
        }
      </div>

      <!-- ======================================================== -->
      <!-- MAIN CANVAS STAGE (Dynamic High-DPI Rendering)          -->
      <!-- ======================================================== -->
      <div 
        #chartWrapper
        class="relative flex-1 w-full min-h-[300px] sm:min-h-[380px] cursor-crosshair overflow-hidden bg-white dark:bg-[#0B0E14]"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        (mouseleave)="onMouseLeave()"
        (wheel)="onWheel($event)"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd()">

        <!-- Canvas rendering element -->
        <canvas 
          #chartCanvas
          class="absolute inset-0 w-full h-full block">
        </canvas>

        <!-- Floating Live Price Pill (At right edge) -->
        @if (livePriceY() !== null && currentPrice()) {
          <div 
            class="absolute right-0 pointer-events-none px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 rounded-l shadow-md transform -translate-y-1/2 flex items-center gap-1 z-20"
            [style.top.px]="livePriceY()">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
            <span>{{ formatPrice(currentPrice()) }}</span>
          </div>
        }

        <!-- Active Signal Level Marker Tag (if passed as input) -->
        @if (signalEntryPrice && signalEntryY() !== null) {
          <div 
            class="absolute left-2 pointer-events-none px-2 py-0.5 text-[10px] font-mono font-bold rounded shadow bg-indigo-600/90 text-white transform -translate-y-1/2 flex items-center gap-1 border border-indigo-400 z-20"
            [style.top.px]="signalEntryY()">
            <span>SIGNAL ENTRÉE: {{ formatPrice(signalEntryPrice) }}</span>
          </div>
        }
      </div>

      <!-- ======================================================== -->
      <!-- BOTTOM LEGEND & SMC STATUS STRIP                        -->
      <!-- ======================================================== -->
      @if (!compact) {
        <div class="px-4 py-2 bg-slate-50 dark:bg-[#090b10] border-t border-slate-200 dark:border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono gap-2 z-10">
          <div class="flex items-center flex-wrap gap-4">
            <!-- EMA legend -->
            @if (showEma()) {
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <span class="w-3 h-0.5 bg-sky-500 dark:bg-sky-400 rounded-full inline-block"></span>
                  <span class="text-sky-700 dark:text-sky-300 font-medium">EMA 20</span>
                </span>
                <span class="flex items-center gap-1">
                  <span class="w-3 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full inline-block"></span>
                  <span class="text-amber-700 dark:text-amber-300 font-medium">EMA 50</span>
                </span>
                <span class="flex items-center gap-1">
                  <span class="w-3 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full inline-block"></span>
                  <span class="text-purple-700 dark:text-purple-300 font-medium">EMA 200</span>
                </span>
              </div>
            }

            <!-- Structure legend -->
            @if (showStructure()) {
              <div class="flex items-center gap-2 text-[10px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/40 font-medium">
                <span class="font-bold">SMC:</span>
                <span>HH / HL / LH / LL + BOS</span>
              </div>
            }

            <!-- FVG legend -->
            @if (showFvg()) {
              <div class="flex items-center gap-2 text-[10px] text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/40 font-medium">
                <span class="w-2 h-2 rounded bg-indigo-500/50"></span>
                <span>Fair Value Gaps</span>
              </div>
            }
          </div>

          <!-- Right Status Info -->
          <div class="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              <span>Rendu Canvas 60 FPS</span>
            </span>
            <span class="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
            <span class="hidden sm:inline">Digits: {{ priceDigits() }} décimales</span>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 380px;
    }
    .compact-mode {
      min-height: 280px;
    }
  `]
})
export class FinancialChart implements OnInit, OnChanges, OnDestroy {
  private readonly marketDemoService = inject(MarketDemoService);
  private readonly themeService = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('chartWrapper', { static: true }) chartWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartCanvas', { static: true }) chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  // Component Inputs
  @Input() symbol = 'EUR/USD';
  @Input() candles: Candle[] = [];
  @Input() compact = false;
  @Input() signalEntryPrice?: number;
  @Input() signalStopLoss?: number;
  @Input() signalTakeProfit?: number;

  // Chart configuration signals
  readonly chartType = signal<ChartType>('CANDLESTICK');
  readonly selectedTimeframe = signal<TimeframeType>('H1');
  readonly showEma = signal<boolean>(true);
  readonly showSr = signal<boolean>(true);
  readonly showFvg = signal<boolean>(true);
  readonly showStructure = signal<boolean>(true);
  readonly activeSubPanel = signal<SubPanelType>('VOLUME');

  // Mouse & viewport state
  readonly hoveredCandle = signal<Candle | null>(null);
  readonly hoveredIndex = signal<number | null>(null);
  readonly livePriceY = signal<number | null>(null);
  readonly signalEntryY = signal<number | null>(null);

  // Hovered indicator computed values
  readonly hoveredEma20 = signal<number | null>(null);
  readonly hoveredEma50 = signal<number | null>(null);
  readonly hoveredEma200 = signal<number | null>(null);
  readonly hoveredRsi = signal<number | null>(null);
  readonly hoveredMacd = signal<number | null>(null);

  readonly timeframes: TimeframeType[] = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];

  // Viewport / Pan & Zoom state
  private visibleCandleCount = 75;
  private offsetFromRight = 0; // 0 means anchored to latest candle
  private isDragging = false;
  private dragStartX = 0;
  private dragStartOffset = 0;
  private touchStartDistance = 0;

  // Render & Animation loop variables
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private mousePos: { x: number; y: number } | null = null;

  // Computed properties
  readonly isLiveStreaming = computed(() => this.marketDemoService.isLiveStreaming());
  
  readonly currentPair = computed(() => {
    return this.marketDemoService.pairs().find(p => p.symbol === this.symbol) || this.marketDemoService.activePair();
  });

  readonly currentPrice = computed(() => {
    if (this.candles.length > 0) {
      return this.candles[this.candles.length - 1].close;
    }
    return this.currentPair().bid;
  });

  readonly priceChange = computed(() => {
    if (this.candles.length > 1) {
      const first = this.candles[0].open;
      const last = this.candles[this.candles.length - 1].close;
      return ((last - first) / (first || 1)) * 100;
    }
    return this.currentPair().change24h;
  });

  readonly priceDigits = computed(() => {
    if (this.symbol.includes('JPY')) return 3;
    if (this.symbol === 'XAU/USD' || this.symbol === 'XAG/USD' || this.symbol.includes('BTC') || this.symbol.includes('US30') || this.symbol.includes('NAS')) {
      return 2;
    }
    return 5;
  });

  readonly spreadPips = computed(() => {
    return this.currentPair().spread || 0.8;
  });

  constructor() {
    effect(() => {
      // Re-render when theme changes between dark and light
      this.themeService.theme();
      if (this.isBrowser) {
        this.scheduleRender();
      }
    });
  }

  ngOnInit() {
    this.selectedTimeframe.set(this.marketDemoService.selectedTimeframe());
    if (this.compact) {
      this.activeSubPanel.set('NONE');
      this.showFvg.set(false);
      this.showStructure.set(false);
    }
    if (this.isBrowser) {
      this.initCanvasAndObserver();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol'] || changes['candles']) {
      if (this.isBrowser) {
        this.scheduleRender();
      }
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  setChartType(type: ChartType) {
    this.chartType.set(type);
    this.scheduleRender();
  }

  onTimeframeChange(tf: TimeframeType) {
    this.selectedTimeframe.set(tf);
    this.marketDemoService.setTimeframe(tf);
    this.scheduleRender();
  }

  toggleEmaOverlay() {
    this.showEma.update(v => !v);
    this.scheduleRender();
  }

  toggleSrOverlay() {
    this.showSr.update(v => !v);
    this.scheduleRender();
  }

  toggleFvgOverlay() {
    this.showFvg.update(v => !v);
    this.scheduleRender();
  }

  toggleStructureOverlay() {
    this.showStructure.update(v => !v);
    this.scheduleRender();
  }

  setSubPanel(panel: SubPanelType) {
    this.activeSubPanel.set(panel);
    this.scheduleRender();
  }

  zoomIn() {
    this.visibleCandleCount = Math.max(12, Math.floor(this.visibleCandleCount * 0.8));
    this.scheduleRender();
  }

  zoomOut() {
    const total = this.candles.length || this.marketDemoService.activeCandles().length || 750;
    this.visibleCandleCount = Math.min(total, Math.ceil(this.visibleCandleCount * 1.3));
    this.scheduleRender();
  }

  resetView() {
    const total = this.candles.length || this.marketDemoService.activeCandles().length || 750;
    this.visibleCandleCount = Math.min(total, 75);
    this.offsetFromRight = 0;
    this.scheduleRender();
  }

  formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined || isNaN(price)) return '-';
    return price.toFixed(this.priceDigits());
  }

  // ====================================================================
  // CANVAS INITIALIZATION & RESIZE OBSERVER
  // ====================================================================
  private initCanvasAndObserver() {
    if (!this.isBrowser) return;
    const canvas = this.chartCanvasRef?.nativeElement;
    const wrapper = this.chartWrapperRef?.nativeElement;
    if (!canvas || !wrapper) return;

    this.ctx = canvas.getContext('2d', { alpha: false });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.resizeCanvas();
        this.scheduleRender();
      });
      this.resizeObserver.observe(wrapper);
    }

    this.resizeCanvas();
    this.scheduleRender();
  }

  private resizeCanvas() {
    if (!this.isBrowser) return;
    const canvas = this.chartCanvasRef?.nativeElement;
    const wrapper = this.chartWrapperRef?.nativeElement;
    if (!canvas || !wrapper) return;

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const rect = wrapper.getBoundingClientRect();
    const width = Math.max(rect.width, 280);
    const height = Math.max(rect.height, 260);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }
  }

  // ====================================================================
  // INTERACTION HANDLERS (PAN, ZOOM, CROSSHAIR)
  // ====================================================================
  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartOffset = this.offsetFromRight;
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.chartWrapperRef.nativeElement.getBoundingClientRect();
    this.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (this.isDragging) {
      const deltaX = e.clientX - this.dragStartX;
      const candleWidth = (rect.width - 70) / this.visibleCandleCount;
      const candleShift = Math.round(deltaX / candleWidth);
      const totalCandles = this.candles.length || 48;
      const maxOffset = Math.max(0, totalCandles - this.visibleCandleCount);
      
      this.offsetFromRight = Math.max(0, Math.min(maxOffset, this.dragStartOffset + candleShift));
    }

    this.scheduleRender();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseLeave() {
    this.isDragging = false;
    this.mousePos = null;
    this.hoveredCandle.set(null);
    this.scheduleRender();
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    const totalCandles = this.candles.length || 48;
    if (e.deltaY < 0) {
      // Zoom in
      this.visibleCandleCount = Math.max(10, Math.floor(this.visibleCandleCount * 0.9));
    } else {
      // Zoom out
      this.visibleCandleCount = Math.min(totalCandles, Math.ceil(this.visibleCandleCount * 1.1));
    }
    this.scheduleRender();
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.dragStartX = e.touches[0].clientX;
      this.dragStartOffset = this.offsetFromRight;
      const rect = this.chartWrapperRef.nativeElement.getBoundingClientRect();
      this.mousePos = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else if (e.touches.length === 2) {
      this.isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchStartDistance = Math.hypot(dx, dy);
    }
    this.scheduleRender();
  }

  onTouchMove(e: TouchEvent) {
    const rect = this.chartWrapperRef.nativeElement.getBoundingClientRect();
    if (e.touches.length === 1 && this.isDragging) {
      const deltaX = e.touches[0].clientX - this.dragStartX;
      const candleWidth = (rect.width - 70) / this.visibleCandleCount;
      const candleShift = Math.round(deltaX / candleWidth);
      const totalCandles = this.candles.length || 48;
      const maxOffset = Math.max(0, totalCandles - this.visibleCandleCount);
      
      this.offsetFromRight = Math.max(0, Math.min(maxOffset, this.dragStartOffset + candleShift));
      this.mousePos = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
      this.scheduleRender();
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (this.touchStartDistance > 0) {
        const factor = dist / this.touchStartDistance;
        const totalCandles = this.candles.length || 48;
        if (factor > 1.05) {
          this.visibleCandleCount = Math.max(10, Math.floor(this.visibleCandleCount * 0.95));
          this.touchStartDistance = dist;
        } else if (factor < 0.95) {
          this.visibleCandleCount = Math.min(totalCandles, Math.ceil(this.visibleCandleCount * 1.05));
          this.touchStartDistance = dist;
        }
      }
      this.scheduleRender();
    }
  }

  onTouchEnd() {
    this.isDragging = false;
    this.touchStartDistance = 0;
  }

  // ====================================================================
  // MAIN RENDERING PIPELINE (60 FPS ACCELERATED CANVAS)
  // ====================================================================
  private scheduleRender() {
    if (!this.isBrowser) return;
    if (this.animationFrameId !== null) return;
    if (typeof requestAnimationFrame === 'undefined') return;
    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = null;
      this.render();
    });
  }

  private render() {
    if (!this.isBrowser || !this.ctx || !this.chartWrapperRef) return;
    const ctx = this.ctx;
    const rect = this.chartWrapperRef.nativeElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width <= 0 || height <= 0) return;

    const isDark = this.themeService.isDark();

    // Background Canvas Fill
    ctx.fillStyle = isDark ? '#0B0E14' : '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const candleSeries = this.candles.length > 0 
      ? this.candles 
      : this.marketDemoService.activeCandles();

    if (!candleSeries || candleSeries.length === 0) {
      // Empty state placeholder
      ctx.fillStyle = isDark ? '#475569' : '#94A3B8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Chargement du flux graphique...', width / 2, height / 2);
      return;
    }

    // Determine layout partitions (Price Panel vs Sub-Panel)
    const rightAxisWidth = this.compact ? 55 : 70;
    const bottomAxisHeight = 24;
    const hasSubPanel = this.activeSubPanel() !== 'NONE' && !this.compact;
    const subPanelHeight = hasSubPanel ? Math.min(100, Math.floor(height * 0.24)) : 0;
    
    const chartPlotWidth = width - rightAxisWidth;
    const mainPlotHeight = height - bottomAxisHeight - subPanelHeight;

    // Slice visible candles according to viewport pan & zoom
    const totalCount = candleSeries.length;
    const visibleCount = Math.min(this.visibleCandleCount, totalCount);
    const endIndex = Math.max(visibleCount, totalCount - this.offsetFromRight);
    const startIndex = Math.max(0, endIndex - visibleCount);
    const visibleCandles = candleSeries.slice(startIndex, endIndex);

    if (visibleCandles.length === 0) return;

    // Calculate Price Extents (Min / Max with 8% padding)
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    for (const c of visibleCandles) {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    }

    // Include Signal Levels in bounds if present
    if (this.signalEntryPrice) {
      minPrice = Math.min(minPrice, this.signalEntryPrice);
      maxPrice = Math.max(maxPrice, this.signalEntryPrice);
    }

    const priceRange = maxPrice - minPrice || 0.0001;
    const padding = priceRange * 0.08;
    const plotMinPrice = minPrice - padding;
    const plotMaxPrice = maxPrice + padding;
    const plotPriceRange = plotMaxPrice - plotMinPrice;

    // Helper coordinate conversion functions
    const priceToY = (p: number) => {
      return mainPlotHeight - ((p - plotMinPrice) / plotPriceRange) * mainPlotHeight;
    };

    const yToPrice = (y: number) => {
      return plotMaxPrice - (y / mainPlotHeight) * plotPriceRange;
    };

    const candleWidth = chartPlotWidth / visibleCandles.length;
    const barWidth = Math.max(2, Math.floor(candleWidth * 0.72));

    const indexToX = (localIndex: number) => {
      return localIndex * candleWidth + candleWidth / 2;
    };

    // 1. DRAW BACKGROUND GRIDS & REFERENCE LEVELS
    this.drawGrid(ctx, chartPlotWidth, mainPlotHeight, plotMinPrice, plotMaxPrice, visibleCandles, isDark);

    // 2. DRAW FAIR VALUE GAPS (FVG)
    if (this.showFvg() && !this.compact) {
      this.drawFvgZones(ctx, visibleCandles, startIndex, candleSeries, indexToX, priceToY, candleWidth, isDark);
    }

    // 3. DRAW SUPPORT & RESISTANCE (S/R) BANDS
    if (this.showSr() && !this.compact) {
      this.drawSrLevels(ctx, chartPlotWidth, candleSeries, plotMinPrice, plotMaxPrice, priceToY, isDark);
    }

    // 4. DRAW SIGNAL ENTRY / SL / TP OVERLAYS
    this.drawSignalLevels(ctx, chartPlotWidth, priceToY, isDark);

    // 5. DRAW MAIN PRICE SERIES (CANDLESTICKS OR AREA)
    if (this.chartType() === 'CANDLESTICK') {
      this.drawCandlesticks(ctx, visibleCandles, indexToX, priceToY, barWidth, isDark);
    } else {
      this.drawAreaCurve(ctx, visibleCandles, indexToX, priceToY, chartPlotWidth, mainPlotHeight, isDark);
    }

    // 6. DRAW EMA OVERLAYS (20, 50, 200)
    if (this.showEma()) {
      this.drawEmaCurves(ctx, candleSeries, startIndex, visibleCandles.length, indexToX, priceToY, isDark);
    }

    // 7. DRAW MARKET STRUCTURE (HH/HL/LH/LL & BOS)
    if (this.showStructure() && !this.compact) {
      this.drawMarketStructure(ctx, visibleCandles, startIndex, indexToX, priceToY, isDark);
    }

    // 8. DRAW CURRENT LIVE PRICE LINE & TRACKER
    const latestCandle = candleSeries[candleSeries.length - 1];
    if (latestCandle) {
      const liveY = priceToY(latestCandle.close);
      this.livePriceY.set(liveY);
      this.drawLivePriceLine(ctx, chartPlotWidth, width, liveY, latestCandle.close, isDark);
    }

    // 9. DRAW SUB-PANEL (VOLUME, RSI, MACD)
    if (hasSubPanel) {
      const subPanelY = mainPlotHeight;
      this.drawSubPanel(ctx, chartPlotWidth, width, subPanelY, subPanelHeight, visibleCandles, candleSeries, startIndex, indexToX, barWidth, isDark);
    }

    // 10. DRAW PRICE AXIS (RIGHT) & TIME AXIS (BOTTOM)
    this.drawAxes(ctx, width, height, chartPlotWidth, mainPlotHeight, rightAxisWidth, bottomAxisHeight, plotMinPrice, plotMaxPrice, visibleCandles, indexToX, isDark);

    // 11. DRAW CROSSHAIR & TOOLTIP HUD
    this.drawCrosshair(ctx, width, height, chartPlotWidth, mainPlotHeight, visibleCandles, startIndex, candleSeries, indexToX, priceToY, yToPrice, candleWidth, isDark);
  }

  // ====================================================================
  // DRAWING HELPER FUNCTIONS
  // ====================================================================

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    minPrice: number,
    maxPrice: number,
    visibleCandles: Candle[],
    isDark: boolean
  ) {
    ctx.save();
    ctx.strokeStyle = isDark ? '#161B26' : '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Horizontal grid lines (4-5 divisions)
    const priceSteps = 5;
    for (let i = 0; i <= priceSteps; i++) {
      const y = (height / priceSteps) * i;
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(width, Math.floor(y) + 0.5);
      ctx.stroke();
    }

    // Vertical grid lines
    const timeStep = Math.max(1, Math.floor(visibleCandles.length / 6));
    for (let i = 0; i < visibleCandles.length; i += timeStep) {
      const x = (width / visibleCandles.length) * i + (width / visibleCandles.length) / 2;
      ctx.beginPath();
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, height);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawCandlesticks(
    ctx: CanvasRenderingContext2D,
    candles: Candle[],
    indexToX: (i: number) => number,
    priceToY: (p: number) => number,
    barWidth: number,
    isDark: boolean
  ) {
    ctx.save();

    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const x = indexToX(i);
      const isBullish = c.close >= c.open;

      const openY = priceToY(c.open);
      const closeY = priceToY(c.close);
      const highY = priceToY(c.high);
      const lowY = priceToY(c.low);

      const topBodyY = Math.min(openY, closeY);
      const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));

      const candleColor = isBullish 
        ? (isDark ? '#00E699' : '#10B981') 
        : (isDark ? '#FF4D6D' : '#EF4444');
      const wickColor = isBullish 
        ? (isDark ? '#00E699' : '#059669') 
        : (isDark ? '#FF4D6D' : '#DC2626');

      // Draw Upper and Lower Wicks
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.floor(x) + 0.5, Math.floor(highY));
      ctx.lineTo(Math.floor(x) + 0.5, Math.floor(lowY));
      ctx.stroke();

      // Draw Candle Body
      ctx.fillStyle = candleColor;
      ctx.fillRect(
        Math.floor(x - barWidth / 2),
        Math.floor(topBodyY),
        barWidth,
        Math.ceil(bodyHeight)
      );

      // In light mode, draw crisp border around candle body for optimal contrast
      if (!isDark) {
        ctx.strokeStyle = isBullish ? '#059669' : '#DC2626';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
          Math.floor(x - barWidth / 2),
          Math.floor(topBodyY),
          barWidth,
          Math.ceil(bodyHeight)
        );
      }
    }

    ctx.restore();
  }

  private drawAreaCurve(
    ctx: CanvasRenderingContext2D,
    candles: Candle[],
    indexToX: (i: number) => number,
    priceToY: (p: number) => number,
    width: number,
    height: number,
    isDark: boolean
  ) {
    ctx.save();

    const points: { x: number; y: number }[] = candles.map((c, i) => ({
      x: indexToX(i),
      y: priceToY(c.close)
    }));

    if (points.length < 2) {
      ctx.restore();
      return;
    }

    // Create Emerald Gradient fill under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      gradient.addColorStop(0, 'rgba(0, 230, 153, 0.35)');
      gradient.addColorStop(0.6, 'rgba(0, 230, 153, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 230, 153, 0.00)');
    } else {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.30)');
      gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.08)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Crisp Area Stroke Line
    ctx.strokeStyle = isDark ? '#00E699' : '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    ctx.restore();
  }

  private drawEmaCurves(
    ctx: CanvasRenderingContext2D,
    allCandles: Candle[],
    startIndex: number,
    visibleCount: number,
    indexToX: (i: number) => number,
    priceToY: (p: number) => number,
    isDark: boolean
  ) {
    const ema20 = this.calculateEma(allCandles, 20);
    const ema50 = this.calculateEma(allCandles, 50);
    const ema200 = this.calculateEma(allCandles, 200);

    const drawSingleEma = (emaValues: (number | null)[], color: string, lineWidth: number) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      let started = false;
      for (let i = 0; i < visibleCount; i++) {
        const globalIdx = startIndex + i;
        const val = emaValues[globalIdx];
        if (val !== null && !isNaN(val)) {
          const x = indexToX(i);
          const y = priceToY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    const c20 = isDark ? '#38BDF8' : '#0284C7';
    const c50 = isDark ? '#F59E0B' : '#D97706';
    const c200 = isDark ? '#A855F7' : '#7E22CE';

    drawSingleEma(ema20, c20, 1.5);
    drawSingleEma(ema50, c50, 1.5);
    drawSingleEma(ema200, c200, 2.0);
  }

  private drawFvgZones(
    ctx: CanvasRenderingContext2D,
    visibleCandles: Candle[],
    startIndex: number,
    allCandles: Candle[],
    indexToX: (i: number) => number,
    priceToY: (p: number) => number,
    candleWidth: number,
    isDark: boolean
  ) {
    ctx.save();

    for (let i = 2; i < visibleCandles.length; i++) {
      const globalIdx = startIndex + i;
      if (globalIdx < 2 || globalIdx >= allCandles.length) continue;

      const c0 = allCandles[globalIdx - 2];
      const c2 = allCandles[globalIdx];

      // Bullish FVG: Low of candle 2 is strictly above High of candle 0
      if (c2.low > c0.high) {
        const topY = priceToY(c2.low);
        const bottomY = priceToY(c0.high);
        const startX = indexToX(i - 2) - candleWidth / 2;
        const endX = indexToX(Math.min(visibleCandles.length - 1, i + 3)) + candleWidth / 2;

        ctx.fillStyle = isDark ? 'rgba(0, 230, 153, 0.12)' : 'rgba(16, 185, 129, 0.14)';
        ctx.fillRect(startX, topY, endX - startX, bottomY - topY);

        ctx.strokeStyle = isDark ? 'rgba(0, 230, 153, 0.4)' : 'rgba(5, 150, 105, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(startX, topY, endX - startX, bottomY - topY);

        ctx.fillStyle = isDark ? 'rgba(0, 230, 153, 0.8)' : '#047857';
        ctx.font = '9px monospace font-bold';
        ctx.fillText('FVG +', startX + 4, topY + 10);
      }
      // Bearish FVG: High of candle 2 is strictly below Low of candle 0
      else if (c2.high < c0.low) {
        const topY = priceToY(c0.low);
        const bottomY = priceToY(c2.high);
        const startX = indexToX(i - 2) - candleWidth / 2;
        const endX = indexToX(Math.min(visibleCandles.length - 1, i + 3)) + candleWidth / 2;

        ctx.fillStyle = isDark ? 'rgba(255, 77, 109, 0.12)' : 'rgba(239, 68, 68, 0.14)';
        ctx.fillRect(startX, topY, endX - startX, bottomY - topY);

        ctx.strokeStyle = isDark ? 'rgba(255, 77, 109, 0.4)' : 'rgba(220, 38, 38, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(startX, topY, endX - startX, bottomY - topY);

        ctx.fillStyle = isDark ? 'rgba(255, 77, 109, 0.8)' : '#B91C1C';
        ctx.font = '9px monospace font-bold';
        ctx.fillText('FVG -', startX + 4, bottomY - 3);
      }
    }

    ctx.restore();
  }

  private drawSrLevels(
    ctx: CanvasRenderingContext2D,
    width: number,
    candles: Candle[],
    minPrice: number,
    maxPrice: number,
    priceToY: (p: number) => number,
    isDark: boolean
  ) {
    if (candles.length < 10) return;
    ctx.save();

    // Extract notable swing levels
    let highest = -Infinity;
    let lowest = Infinity;
    for (const c of candles) {
      if (c.high > highest) highest = c.high;
      if (c.low < lowest) lowest = c.low;
    }

    const pivot = (highest + lowest) / 2;
    const r1 = pivot + (highest - lowest) * 0.382;
    const s1 = pivot - (highest - lowest) * 0.382;

    const levels: SupportResistanceLevel[] = [
      { price: highest, type: 'RESISTANCE', label: 'Résistance Majeure', strength: 3 },
      { price: r1, type: 'RESISTANCE', label: 'Résistance R1', strength: 2 },
      { price: pivot, type: 'PIVOT', label: 'Pivot Institutionnel', strength: 1 },
      { price: s1, type: 'SUPPORT', label: 'Support S1', strength: 2 },
      { price: lowest, type: 'SUPPORT', label: 'Support Majeur', strength: 3 }
    ];

    for (const lvl of levels) {
      if (lvl.price < minPrice || lvl.price > maxPrice) continue;

      const y = priceToY(lvl.price);
      const isRes = lvl.type === 'RESISTANCE';
      const isSup = lvl.type === 'SUPPORT';
      
      const color = isRes 
        ? (isDark ? '#FF4D6D' : '#E11D48') 
        : isSup 
        ? (isDark ? '#00E699' : '#059669') 
        : (isDark ? '#94A3B8' : '#64748B');

      // Subtle horizontal reference line
      ctx.strokeStyle = color;
      ctx.lineWidth = lvl.strength === 3 ? 1.5 : 1;
      ctx.setLineDash(lvl.strength === 3 ? [6, 4] : [3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(width, Math.floor(y) + 0.5);
      ctx.stroke();

      // Mini level badge on left
      const badgeBg = isRes 
        ? (isDark ? 'rgba(255, 77, 109, 0.15)' : 'rgba(225, 29, 72, 0.12)') 
        : isSup 
        ? (isDark ? 'rgba(0, 230, 153, 0.15)' : 'rgba(5, 150, 105, 0.12)') 
        : (isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.12)');
      
      ctx.fillStyle = badgeBg;
      ctx.fillRect(8, y - 9, 115, 16);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(8, y - 9, 115, 16);

      ctx.fillStyle = isDark 
        ? color 
        : (isRes ? '#BE123C' : isSup ? '#047857' : '#334155');
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${lvl.label} ${this.formatPrice(lvl.price)}`, 12, y + 3);
    }

    ctx.restore();
  }

  private drawSignalLevels(
    ctx: CanvasRenderingContext2D,
    width: number,
    priceToY: (p: number) => number,
    isDark: boolean
  ) {
    if (!this.signalEntryPrice) return;
    ctx.save();

    const entryY = priceToY(this.signalEntryPrice);
    this.signalEntryY.set(entryY);

    // Entry line
    ctx.strokeStyle = isDark ? '#818CF8' : '#4F46E5';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(entryY) + 0.5);
    ctx.lineTo(width, Math.floor(entryY) + 0.5);
    ctx.stroke();

    // Take Profit Line if present
    if (this.signalTakeProfit) {
      const tpY = priceToY(this.signalTakeProfit);
      ctx.strokeStyle = isDark ? '#00E699' : '#059669';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(tpY) + 0.5);
      ctx.lineTo(width, Math.floor(tpY) + 0.5);
      ctx.stroke();

      ctx.fillStyle = isDark ? 'rgba(0, 230, 153, 0.2)' : 'rgba(16, 185, 129, 0.15)';
      ctx.fillRect(width - 90, tpY - 8, 85, 15);
      ctx.fillStyle = isDark ? '#00E699' : '#047857';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`TP: ${this.formatPrice(this.signalTakeProfit)}`, width - 85, tpY + 3);
    }

    // Stop Loss Line if present
    if (this.signalStopLoss) {
      const slY = priceToY(this.signalStopLoss);
      ctx.strokeStyle = isDark ? '#FF4D6D' : '#E11D48';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(slY) + 0.5);
      ctx.lineTo(width, Math.floor(slY) + 0.5);
      ctx.stroke();

      ctx.fillStyle = isDark ? 'rgba(255, 77, 109, 0.2)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(width - 90, slY - 8, 85, 15);
      ctx.fillStyle = isDark ? '#FF4D6D' : '#B91C1C';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`SL: ${this.formatPrice(this.signalStopLoss)}`, width - 85, slY + 3);
    }

    ctx.restore();
  }

  private drawMarketStructure(
    ctx: CanvasRenderingContext2D,
    visibleCandles: Candle[],
    startIndex: number,
    indexToX: (i: number) => number,
    priceToY: (p: number) => number,
    isDark: boolean
  ) {
    if (visibleCandles.length < 8) return;
    ctx.save();

    let prevHigh = -Infinity;
    let prevLow = Infinity;

    for (let i = 2; i < visibleCandles.length - 2; i++) {
      const c = visibleCandles[i];
      const cPrev = visibleCandles[i - 1];
      const cPrev2 = visibleCandles[i - 2];
      const cNext = visibleCandles[i + 1];
      const cNext2 = visibleCandles[i + 2];

      const x = indexToX(i);

      // Swing High Detection
      if (c.high > cPrev.high && c.high > cPrev2.high && c.high > cNext.high && c.high > cNext2.high) {
        const isHigherHigh = c.high > prevHigh;
        prevHigh = c.high;
        const y = priceToY(c.high);

        const bg = isHigherHigh 
          ? (isDark ? 'rgba(0, 230, 153, 0.2)' : 'rgba(16, 185, 129, 0.15)') 
          : (isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)');
        const border = isHigherHigh 
          ? (isDark ? '#00E699' : '#059669') 
          : (isDark ? '#F59E0B' : '#D97706');
        const text = isHigherHigh 
          ? (isDark ? '#00E699' : '#047857') 
          : (isDark ? '#F59E0B' : '#B45309');

        ctx.fillStyle = bg;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillRect(x - 12, y - 18, 24, 13);
        ctx.strokeRect(x - 12, y - 18, 24, 13);

        ctx.fillStyle = text;
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isHigherHigh ? 'HH' : 'LH', x, y - 8);
      }

      // Swing Low Detection
      if (c.low < cPrev.low && c.low < cPrev2.low && c.low < cNext.low && c.low < cNext2.low) {
        const isHigherLow = c.low > prevLow;
        prevLow = c.low;
        const y = priceToY(c.low);

        const bg = isHigherLow 
          ? (isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.15)') 
          : (isDark ? 'rgba(255, 77, 109, 0.2)' : 'rgba(239, 68, 68, 0.15)');
        const border = isHigherLow 
          ? (isDark ? '#38BDF8' : '#0284C7') 
          : (isDark ? '#FF4D6D' : '#E11D48');
        const text = isHigherLow 
          ? (isDark ? '#38BDF8' : '#0369A1') 
          : (isDark ? '#FF4D6D' : '#BE123C');

        ctx.fillStyle = bg;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillRect(x - 12, y + 6, 24, 13);
        ctx.strokeRect(x - 12, y + 6, 24, 13);

        ctx.fillStyle = text;
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isHigherLow ? 'HL' : 'LL', x, y + 16);
      }
    }

    ctx.restore();
  }

  private drawLivePriceLine(
    ctx: CanvasRenderingContext2D,
    plotWidth: number,
    totalWidth: number,
    y: number,
    price: number,
    isDark: boolean
  ) {
    ctx.save();

    // Live price line
    ctx.strokeStyle = isDark ? '#00E699' : '#059669';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(y) + 0.5);
    ctx.lineTo(plotWidth, Math.floor(y) + 0.5);
    ctx.stroke();

    // Right axis price badge
    ctx.fillStyle = isDark ? '#00E699' : '#10B981';
    ctx.fillRect(plotWidth, y - 10, totalWidth - plotWidth, 20);

    ctx.fillStyle = isDark ? '#0B0E14' : '#FFFFFF';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.formatPrice(price), plotWidth + (totalWidth - plotWidth) / 2, y + 4);

    ctx.restore();
  }

  private drawSubPanel(
    ctx: CanvasRenderingContext2D,
    plotWidth: number,
    totalWidth: number,
    startY: number,
    height: number,
    visibleCandles: Candle[],
    allCandles: Candle[],
    startIndex: number,
    indexToX: (i: number) => number,
    barWidth: number,
    isDark: boolean
  ) {
    ctx.save();

    // Sub-panel border divider
    ctx.strokeStyle = isDark ? '#1E293B' : '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, startY + 0.5);
    ctx.lineTo(totalWidth, startY + 0.5);
    ctx.stroke();

    // Background fill
    ctx.fillStyle = isDark ? '#080A0F' : '#F8FAFC';
    ctx.fillRect(0, startY + 1, totalWidth, height - 1);

    if (this.activeSubPanel() === 'VOLUME') {
      // 1. VOLUME HISTOGRAM
      let maxVol = 1;
      for (const c of visibleCandles) {
        if (c.volume > maxVol) maxVol = c.volume;
      }

      ctx.fillStyle = isDark ? '#64748B' : '#475569';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Volume (Ticks)', 10, startY + 14);

      for (let i = 0; i < visibleCandles.length; i++) {
        const c = visibleCandles[i];
        const x = indexToX(i);
        const barH = (c.volume / maxVol) * (height - 20);
        const y = startY + height - barH - 2;

        const isBullish = c.close >= c.open;
        if (isDark) {
          ctx.fillStyle = isBullish ? 'rgba(0, 230, 153, 0.45)' : 'rgba(255, 77, 109, 0.45)';
        } else {
          ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.65)' : 'rgba(239, 68, 68, 0.65)';
        }
        ctx.fillRect(x - barWidth / 2, y, barWidth, barH);
      }
    } else if (this.activeSubPanel() === 'RSI') {
      // 2. RSI (14) OSCILLATOR
      const rsiValues = this.calculateRsi(allCandles, 14);

      ctx.fillStyle = isDark ? '#818CF8' : '#4F46E5';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)', 10, startY + 14);

      // Overbought 70, Mid 50, Oversold 30 horizontal lines
      const y70 = startY + (1 - 0.70) * (height - 20) + 10;
      const y50 = startY + (1 - 0.50) * (height - 20) + 10;
      const y30 = startY + (1 - 0.30) * (height - 20) + 10;

      ctx.strokeStyle = isDark ? '#334155' : '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      ctx.beginPath();
      ctx.moveTo(0, y70);
      ctx.lineTo(plotWidth, y70);
      ctx.moveTo(0, y50);
      ctx.lineTo(plotWidth, y50);
      ctx.moveTo(0, y30);
      ctx.lineTo(plotWidth, y30);
      ctx.stroke();

      // RSI Curve
      ctx.strokeStyle = isDark ? '#818CF8' : '#4F46E5';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();

      let started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const globalIdx = startIndex + i;
        const rsi = rsiValues[globalIdx];
        if (rsi !== null && !isNaN(rsi)) {
          const x = indexToX(i);
          const y = startY + (1 - rsi / 100) * (height - 20) + 10;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();

      // Right axis labels for RSI
      ctx.fillStyle = isDark ? '#64748B' : '#64748B';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('70', plotWidth + (totalWidth - plotWidth) / 2, y70 + 3);
      ctx.fillText('30', plotWidth + (totalWidth - plotWidth) / 2, y30 + 3);

    } else if (this.activeSubPanel() === 'MACD') {
      // 3. MACD (12, 26, 9) OSCILLATOR
      const { macd, signal, histogram } = this.calculateMacd(allCandles);

      ctx.fillStyle = isDark ? '#38BDF8' : '#0284C7';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('MACD (12, 26, 9)', 10, startY + 14);

      let maxAbs = 0.0001;
      for (let i = 0; i < visibleCandles.length; i++) {
        const idx = startIndex + i;
        if (Math.abs(macd[idx] || 0) > maxAbs) maxAbs = Math.abs(macd[idx] || 0);
        if (Math.abs(histogram[idx] || 0) > maxAbs) maxAbs = Math.abs(histogram[idx] || 0);
      }

      const zeroY = startY + height / 2;

      // Draw Histogram
      for (let i = 0; i < visibleCandles.length; i++) {
        const idx = startIndex + i;
        const hist = histogram[idx] || 0;
        const x = indexToX(i);
        const barH = (hist / maxAbs) * (height / 2 - 10);

        if (isDark) {
          ctx.fillStyle = hist >= 0 ? '#00E699' : '#FF4D6D';
        } else {
          ctx.fillStyle = hist >= 0 ? '#10B981' : '#EF4444';
        }

        if (hist >= 0) {
          ctx.fillRect(x - barWidth / 2, zeroY - barH, barWidth, barH);
        } else {
          ctx.fillRect(x - barWidth / 2, zeroY, barWidth, -barH);
        }
      }

      // Draw MACD line
      ctx.strokeStyle = isDark ? '#38BDF8' : '#0284C7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let startedMacd = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const idx = startIndex + i;
        const m = macd[idx];
        if (m !== null && !isNaN(m)) {
          const x = indexToX(i);
          const y = zeroY - (m / maxAbs) * (height / 2 - 10);
          if (!startedMacd) {
            ctx.moveTo(x, y);
            startedMacd = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();

      // Draw Signal line
      ctx.strokeStyle = isDark ? '#F59E0B' : '#D97706';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let startedSignal = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const idx = startIndex + i;
        const s = signal[idx];
        if (s !== null && !isNaN(s)) {
          const x = indexToX(i);
          const y = zeroY - (s / maxAbs) * (height / 2 - 10);
          if (!startedSignal) {
            ctx.moveTo(x, y);
            startedSignal = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawAxes(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    plotWidth: number,
    mainPlotHeight: number,
    rightAxisWidth: number,
    bottomAxisHeight: number,
    minPrice: number,
    maxPrice: number,
    visibleCandles: Candle[],
    indexToX: (i: number) => number,
    isDark: boolean
  ) {
    ctx.save();

    // Axis dividers
    ctx.strokeStyle = isDark ? '#1E293B' : '#E2E8F0';
    ctx.lineWidth = 1;

    // Right Axis Border
    ctx.beginPath();
    ctx.moveTo(plotWidth + 0.5, 0);
    ctx.lineTo(plotWidth + 0.5, height);
    ctx.stroke();

    // Bottom Axis Border
    ctx.beginPath();
    ctx.moveTo(0, height - bottomAxisHeight + 0.5);
    ctx.lineTo(width, height - bottomAxisHeight + 0.5);
    ctx.stroke();

    // Background for Right Axis
    ctx.fillStyle = isDark ? '#090C12' : '#F8FAFC';
    ctx.fillRect(plotWidth + 1, 0, rightAxisWidth, height - bottomAxisHeight);

    // Background for Bottom Axis
    ctx.fillRect(0, height - bottomAxisHeight + 1, width, bottomAxisHeight);

    // Price labels on Right Axis (5 divisions)
    ctx.fillStyle = isDark ? '#94A3B8' : '#475569';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const priceSteps = 5;
    for (let i = 0; i <= priceSteps; i++) {
      const y = (mainPlotHeight / priceSteps) * i;
      const price = maxPrice - (i / priceSteps) * (maxPrice - minPrice);
      ctx.fillText(this.formatPrice(price), plotWidth + rightAxisWidth / 2, y + 4);
    }

    // Time labels on Bottom Axis
    const timeStep = Math.max(1, Math.floor(visibleCandles.length / 5));
    ctx.textAlign = 'center';

    for (let i = 0; i < visibleCandles.length; i += timeStep) {
      const c = visibleCandles[i];
      const x = indexToX(i);
      ctx.fillText(c.timeLabel, x, height - 7);
    }

    ctx.restore();
  }

  private drawCrosshair(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    plotWidth: number,
    mainPlotHeight: number,
    visibleCandles: Candle[],
    startIndex: number,
    allCandles: Candle[],
    indexToX: (i: number) => number,
    priceToY: (p: number) => number,
    yToPrice: (y: number) => number,
    candleWidth: number,
    isDark: boolean
  ) {
    if (!this.mousePos) return;

    const { x, y } = this.mousePos;
    if (x < 0 || x > plotWidth || y < 0 || y > mainPlotHeight) return;

    ctx.save();
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(2, 132, 199, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Horizontal crosshair line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(plotWidth, y);
    ctx.stroke();

    // Find nearest candle by X coordinate
    const candleIndex = Math.min(
      visibleCandles.length - 1,
      Math.max(0, Math.floor(x / candleWidth))
    );
    const nearestCandle = visibleCandles[candleIndex];
    const snapX = indexToX(candleIndex);

    // Vertical crosshair line snapped to candle
    ctx.beginPath();
    ctx.moveTo(snapX, 0);
    ctx.lineTo(snapX, height - 24);
    ctx.stroke();

    // Draw Price Badge on Right Axis
    const hoveredPrice = yToPrice(y);
    ctx.fillStyle = isDark ? '#38BDF8' : '#0284C7';
    ctx.fillRect(plotWidth, y - 9, width - plotWidth, 18);

    ctx.fillStyle = isDark ? '#0B0E14' : '#FFFFFF';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.formatPrice(hoveredPrice), plotWidth + (width - plotWidth) / 2, y + 4);

    // Draw Time Badge on Bottom Axis
    if (nearestCandle) {
      ctx.fillStyle = isDark ? '#38BDF8' : '#0284C7';
      ctx.fillRect(snapX - 35, height - 22, 70, 18);

      ctx.fillStyle = isDark ? '#0B0E14' : '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nearestCandle.timeLabel, snapX, height - 9);

      // Update hovered candle signal for UI HUD
      this.hoveredCandle.set(nearestCandle);
      this.hoveredIndex.set(candleIndex);

      // Update hovered indicator values
      const globalIdx = startIndex + candleIndex;
      const ema20 = this.calculateEma(allCandles, 20);
      const ema50 = this.calculateEma(allCandles, 50);
      const ema200 = this.calculateEma(allCandles, 200);
      const rsi = this.calculateRsi(allCandles, 14);
      const { macd } = this.calculateMacd(allCandles);

      this.hoveredEma20.set(ema20[globalIdx] || null);
      this.hoveredEma50.set(ema50[globalIdx] || null);
      this.hoveredEma200.set(ema200[globalIdx] || null);
      this.hoveredRsi.set(rsi[globalIdx] || null);
      this.hoveredMacd.set(macd[globalIdx] || null);
    }

    ctx.restore();
  }

  // ====================================================================
  // TECHNICAL INDICATOR MATHEMATICAL CALCULATORS
  // ====================================================================

  private calculateEma(candles: Candle[], period: number): (number | null)[] {
    const k = 2 / (period + 1);
    const result: (number | null)[] = [];
    let ema: number | null = null;

    for (let i = 0; i < candles.length; i++) {
      const price = candles[i].close;
      if (i < period - 1) {
        result.push(null);
      } else if (i === period - 1) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[j].close;
        }
        ema = sum / period;
        result.push(ema);
      } else {
        ema = price * k + ema! * (1 - k);
        result.push(ema);
      }
    }
    return result;
  }

  private calculateRsi(candles: Candle[], period = 14): (number | null)[] {
    const result: (number | null)[] = [];
    if (candles.length < period + 1) {
      return candles.map(() => null);
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = 0; i < candles.length; i++) {
      if (i < period) {
        result.push(null);
      } else if (i === period) {
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      } else {
        const diff = candles[i].close - candles[i - 1].close;
        const currentGain = diff >= 0 ? diff : 0;
        const currentLoss = diff < 0 ? Math.abs(diff) : 0;

        avgGain = (avgGain * (period - 1) + currentGain) / period;
        avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    }
    return result;
  }

  private calculateMacd(candles: Candle[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const fastEma = this.calculateEma(candles, fastPeriod);
    const slowEma = this.calculateEma(candles, slowPeriod);

    const macdLine: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      const f = fastEma[i];
      const s = slowEma[i];
      if (f !== null && s !== null) {
        macdLine.push(f - s);
      } else {
        macdLine.push(null);
      }
    }

    // Calculate signal line (EMA of MACD line)
    const validMacdIndices = macdLine.map((val, idx) => ({ val, idx })).filter(item => item.val !== null);
    const dummyCandles: Candle[] = validMacdIndices.map(item => ({
      timestamp: 0,
      timeLabel: '',
      open: item.val!,
      high: item.val!,
      low: item.val!,
      close: item.val!,
      volume: 0
    }));

    const signalEma = this.calculateEma(dummyCandles, signalPeriod);
    const fullSignalLine: (number | null)[] = new Array(candles.length).fill(null);
    const histogram: (number | null)[] = new Array(candles.length).fill(null);

    for (let i = 0; i < validMacdIndices.length; i++) {
      const originalIdx = validMacdIndices[i].idx;
      const sigVal = signalEma[i];
      fullSignalLine[originalIdx] = sigVal;
      if (sigVal !== null && macdLine[originalIdx] !== null) {
        histogram[originalIdx] = macdLine[originalIdx]! - sigVal;
      }
    }

    return { macd: macdLine, signal: fullSignalLine, histogram };
  }
}
