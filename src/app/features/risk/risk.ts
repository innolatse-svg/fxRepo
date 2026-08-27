import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OnboardingService } from '../../core/services/onboarding.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { RiskEngineService } from '../../core/services/risk-engine.service';

export interface AuditLogItem {
  id: string;
  time: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  status: 'AUTHORIZED' | 'REJECTED';
  reason: string;
  ruleCategory: 'RISK_PER_TRADE' | 'DAILY_DRAWDOWN' | 'NEWS_FILTER' | 'MAX_EXPOSURE' | 'CONFLUENCE_SCORE';
}

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-01',
    time: 'Aujourd\'hui 11:42',
    symbol: 'EUR/USD',
    type: 'SELL',
    lots: 0.25,
    status: 'AUTHORIZED',
    reason: 'Confluence 88% validée. Risque 0.95% sous le plafond de 1.00%. Filtre news OK.',
    ruleCategory: 'CONFLUENCE_SCORE'
  },
  {
    id: 'aud-02',
    time: 'Aujourd\'hui 10:15',
    symbol: 'USD/JPY',
    type: 'SELL',
    lots: 0.50,
    status: 'AUTHORIZED',
    reason: 'Ordre sandbox exécuté avec Stop Loss obligatoire (65 pips). Marge disponible : 94.2%.',
    ruleCategory: 'RISK_PER_TRADE'
  },
  {
    id: 'aud-03',
    time: 'Hier 16:20',
    symbol: 'GBP/USD',
    type: 'BUY',
    lots: 1.20,
    status: 'REJECTED',
    reason: 'Rejeté : Risque calculé (2.40%) excède le seuil maximum autorisé de 1.00% par trade.',
    ruleCategory: 'RISK_PER_TRADE'
  },
  {
    id: 'aud-04',
    time: 'Hier 14:18',
    symbol: 'USD/CAD',
    type: 'BUY',
    lots: 0.40,
    status: 'REJECTED',
    reason: 'Rejeté : Événement macro US "Core CPI" dans 12 minutes. Filtre de volatilité actif.',
    ruleCategory: 'NEWS_FILTER'
  },
  {
    id: 'aud-05',
    time: 'Il y a 2 jours',
    symbol: 'AUD/USD',
    type: 'BUY',
    lots: 0.85,
    status: 'REJECTED',
    reason: 'Rejeté : Plafond d\'exposition simultanée de portefeuille (6.00%) dépassé.',
    ruleCategory: 'MAX_EXPOSURE'
  }
];

@Component({
  selector: 'app-risk-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="space-y-8 max-w-7xl mx-auto text-left">
      
      <!-- ============================================================ -->
      <!-- HEADER & ACTIONS                                             -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">shield</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gestion du Risque & Coupe-Circuit
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              DISJONCTEUR HARD STOP
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Calculateur de dimensionnement de lot, monitoring de santé du capital et journal d'audit du Risk Engine.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a 
            routerLink="/app/settings"
            [queryParams]="{ tab: 'risk' }"
            class="px-3.5 py-2 rounded-xl bg-[#141419] hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
            <span class="mat-icon text-sm">tune</span>
            <span>Ajuster les plafonds</span>
          </a>

          <a 
            routerLink="/app/dashboard"
            class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1">
            <span>Dashboard</span>
          </a>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 1 : CALCULATEUR DE TAILLE DE POSITION                -->
      <!-- ============================================================ -->
      <section aria-labelledby="calc-heading" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 id="calc-heading" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-xl">calculate</span>
              <span>Calculateur Institutionnel de Taille de Position</span>
            </h2>
            <p class="text-xs text-slate-400">
              Calculez la taille exacte en lots pour respecter rigoureusement votre tolérance au risque.
            </p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Formule : Lots = (Capital × Risque%) / (Pips × Valeur Pip)
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 shadow-xl">
          
          <!-- Inputs Column (7 Cols) -->
          <div class="lg:col-span-7 space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Account Capital -->
              <div>
                <label for="calc-capital" class="block text-xs font-mono text-slate-300 mb-1">Capital du compte ($)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">$</span>
                  <input 
                    id="calc-capital"
                    type="number" 
                    [value]="calcCapital()"
                    (input)="onCalcCapitalChange($event)"
                    step="1000"
                    min="100"
                    class="w-full pl-7 pr-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 font-bold" />
                </div>
              </div>

              <!-- Pair Selection -->
              <div>
                <label for="calc-pair" class="block text-xs font-mono text-slate-300 mb-1">Paire de devises</label>
                <select 
                  id="calc-pair"
                  [value]="calcPair()"
                  (change)="onCalcPairChange($event)"
                  class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 font-bold">
                  <option value="EUR/USD">EUR/USD (Standard 10$/pip)</option>
                  <option value="GBP/USD">GBP/USD (Standard 10$/pip)</option>
                  <option value="USD/JPY">USD/JPY (Pip 0.01)</option>
                  <option value="USD/CAD">USD/CAD (Pip 0.0001)</option>
                  <option value="AUD/USD">AUD/USD (Standard 10$/pip)</option>
                  <option value="XAU/USD">XAU/USD (Gold - 100oz/lot)</option>
                  <option value="BTC/USD">BTC/USD (Crypto - 1 BTC/lot)</option>
                </select>
              </div>
            </div>

            <!-- Desired Risk Percentage -->
            <div>
              <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Risque toléré par trade :</span>
                <span class="text-emerald-400 font-bold">{{ calcRiskPct() }}% ({{ monetaryRiskDollar() | number:'1.2-2' }} $)</span>
              </div>
              <div class="flex items-center gap-3">
                <input 
                  id="calc-risk-slider"
                  type="range" 
                  min="0.25" 
                  max="5.00" 
                  step="0.25"
                  [value]="calcRiskPct()"
                  (input)="onCalcRiskChange($event)"
                  class="w-full accent-emerald-500 cursor-pointer" />
                <div class="flex gap-1.5">
                  @for (preset of [0.5, 1.0, 2.0, 3.0]; track preset) {
                    <button 
                      type="button"
                      (click)="calcRiskPct.set(preset)"
                      [class.bg-emerald-500]="calcRiskPct() === preset"
                      [class.text-black]="calcRiskPct() === preset"
                      [class.font-bold]="calcRiskPct() === preset"
                      class="px-2 py-1 rounded bg-[#181822] text-[10px] font-mono text-slate-300 border border-slate-800 hover:border-emerald-500 transition-colors">
                      {{ preset }}%
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Stop Loss in Pips -->
            <div>
              <label for="calc-sl-pips" class="block text-xs font-mono text-slate-300 mb-1">Distance Stop Loss (en Pips / Points)</label>
              <div class="flex items-center gap-3">
                <input 
                  id="calc-sl-pips"
                  type="number" 
                  [value]="calcSlPips()"
                  (input)="onCalcSlPipsChange($event)"
                  step="5"
                  min="3"
                  max="500"
                  class="w-32 px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 font-bold" />
                <div class="flex gap-1.5">
                  @for (sl of [15, 25, 35, 50, 75]; track sl) {
                    <button 
                      type="button"
                      (click)="calcSlPips.set(sl)"
                      [class.bg-emerald-500]="calcSlPips() === sl"
                      [class.text-black]="calcSlPips() === sl"
                      [class.font-bold]="calcSlPips() === sl"
                      class="px-2 py-1 rounded bg-[#181822] text-[10px] font-mono text-slate-300 border border-slate-800 hover:border-emerald-500 transition-colors">
                      {{ sl }}p
                    </button>
                  }
                </div>
              </div>
            </div>

          </div>

          <!-- Live Results Display Column (5 Cols) -->
          <div class="lg:col-span-5 p-5 rounded-xl bg-[#141419] border border-slate-800/90 flex flex-col justify-between space-y-4">
            
            <div class="space-y-1">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">Taille de Position Recommandée</span>
              <div class="text-4xl font-black font-mono text-emerald-400 tracking-tight flex items-baseline gap-2">
                <span>{{ calculatedLotSize() | number:'1.2-2' }}</span>
                <span class="text-base text-slate-300 font-bold">Lots</span>
              </div>
              <p class="text-[11px] text-slate-400">
                Soit {{ (calculatedLotSize() * 100000) | number:'1.0-0' }} unités monétaires standard.
              </p>
            </div>

            <!-- Breakdown Grid -->
            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div>
                <span class="text-slate-400 text-[10px]">Risque Monétaire :</span>
                <div class="font-bold text-rose-400">-{{ monetaryRiskDollar() | number:'1.2-2' }} $</div>
              </div>
              <div>
                <span class="text-slate-400 text-[10px]">Valeur par Pip :</span>
                <div class="font-bold text-cyan-400">{{ (calculatedLotSize() * 10) | number:'1.2-2' }} $/pip</div>
              </div>
              <div>
                <span class="text-slate-400 text-[10px]">Levier Effectif :</span>
                <div class="font-bold text-white">{{ calculatedLeverage() | number:'1.1-1' }}x</div>
              </div>
              <div>
                <span class="text-slate-400 text-[10px]">Marge Estimée :</span>
                <div class="font-bold text-slate-200">{{ (calculatedLotSize() * 1000) | number:'1.0-0' }} $ (1:100)</div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <button 
                type="button"
                (click)="evaluateCurrentRiskIntent()"
                class="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                <span class="mat-icon text-sm">shield</span>
                <span>Évaluer avec le Risk Engine Backend</span>
              </button>

              @if (evaluationStatus() === 'ALLOWED') {
                <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span class="mat-icon text-sm">verified</span>
                  <span>{{ evaluationFeedback() }}</span>
                </div>
              } @else if (evaluationStatus() === 'REJECTED') {
                <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
                  <span class="mat-icon text-sm">gpp_bad</span>
                  <span>{{ evaluationFeedback() }}</span>
                </div>
              } @else {
                <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span class="mat-icon text-sm">verified</span>
                  <span>Paramètre 100% conforme aux règles prop firm</span>
                </div>
              }
            </div>

          </div>

        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 2 : TABLEAU DE BORD DE SANTÉ DU COMPTE               -->
      <!-- ============================================================ -->
      <section aria-labelledby="health-heading" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 id="health-heading" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-xl">favorite</span>
              <span>Santé du Capital & Jauges de Sécurité</span>
            </h2>
            <p class="text-xs text-slate-400">
              Surveillance continue du drawdown journalier, marge résiduelle et disjoncteur inviolable.
            </p>
          </div>
        </div>

        <!-- Metric Jauges Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <!-- Drawdown Daily Gauge -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="font-mono uppercase text-[10px]">Drawdown Journalier</span>
              <span class="text-emerald-400 font-bold font-mono">{{ metrics().consumedDailyLossPct }}% / max {{ metrics().maxDailyLossLimitPct }}%</span>
            </div>

            <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                class="bg-gradient-to-r from-emerald-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                [style.width.%]="(metrics().consumedDailyLossPct / metrics().maxDailyLossLimitPct) * 100">
              </div>
            </div>

            <p class="text-[11px] text-slate-400">
              Marge de sécurité restante avant coupure automatique : <strong class="text-emerald-400 font-mono">{{ (metrics().maxDailyLossLimitPct - metrics().consumedDailyLossPct) | number:'1.1-1' }}%</strong>
            </p>
          </div>

          <!-- Total Exposure Gauge -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="font-mono uppercase text-[10px]">Exposition Cumulée</span>
              <span class="text-cyan-400 font-bold font-mono">{{ metrics().currentExposurePct }}% / max {{ metrics().maxExposureLimitPct }}%</span>
            </div>

            <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                class="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                [style.width.%]="(metrics().currentExposurePct / metrics().maxExposureLimitPct) * 100">
              </div>
            </div>

            <p class="text-[11px] text-slate-400">
              Actuellement <strong class="text-white font-mono">{{ metrics().openPositionsCount }}</strong> / {{ metrics().maxPositionsLimit }} positions ouvertes simultanées.
            </p>
          </div>

          <!-- Margin Level % Gauge -->
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="font-mono uppercase text-[10px]">Niveau de Marge MT5</span>
              <span class="text-emerald-400 font-bold font-mono">1 845% (Sain)</span>
            </div>

            <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div class="bg-emerald-400 h-full rounded-full w-[92%]"></div>
            </div>

            <p class="text-[11px] text-slate-400">
              Seuil d'alerte : &lt; 300% &bull; Seuil d'arrêt forcé (Stop Out) : 50%
            </p>
          </div>

        </div>

        <!-- Drawdown Evolution Line Graph (SVG Canvas) -->
        <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-2">
              <span class="mat-icon text-base text-emerald-400">timeline</span>
              <span>Courbe de Santé du Capital & Évolution du Drawdown (30 Derniers Jours)</span>
            </div>
            <span class="text-xs font-mono text-emerald-400 font-bold">
              Max Drawdown Historique : -1.85%
            </span>
          </div>

          <!-- SVG Visual Chart -->
          <div class="h-44 w-full relative">
            <svg class="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="riskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
                </linearGradient>
              </defs>

              <!-- Grid reference lines -->
              <line x1="0" y1="40" x2="800" y2="40" stroke="#1e293b" stroke-dasharray="4"/>
              <line x1="0" y1="80" x2="800" y2="80" stroke="#1e293b" stroke-dasharray="4"/>
              <line x1="0" y1="120" x2="800" y2="120" stroke="#1e293b" stroke-dasharray="4"/>

              <!-- Area Fill -->
              <path 
                d="M 0,110 Q 120,90 200,95 T 400,60 T 600,45 T 800,30 L 800,160 L 0,160 Z" 
                fill="url(#riskGrad)" />

              <!-- Equity Curve Line -->
              <path 
                d="M 0,110 Q 120,90 200,95 T 400,60 T 600,45 T 800,30" 
                fill="none" 
                stroke="#10b981" 
                stroke-width="2.5" />

              <!-- Hard Stop Threshold Line (Red) -->
              <line x1="0" y1="145" x2="800" y2="145" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="6"/>
              <text x="790" y="140" fill="#f43f5e" font-size="10" font-family="monospace" text-anchor="end">Seuil Hard Stop (-3.0%)</text>
            </svg>
          </div>
        </div>

      </section>

      <!-- ============================================================ -->
      <!-- SECTION 3 : JOURNAL D'AUDIT DU RISK ENGINE                   -->
      <!-- ============================================================ -->
      <section aria-labelledby="audit-heading" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="audit-heading" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-xl">fact_check</span>
              <span>Journal d'Audit du Risk Engine (Dernières Décisions)</span>
            </h2>
            <p class="text-xs text-slate-400">
              Traçabilité complète de chaque ordre analysé, validé ou bloqué par le coupe-circuit.
            </p>
          </div>

          <!-- Status Filter Pills -->
          <div class="flex items-center rounded-xl bg-[#141419] border border-slate-800 p-0.5 text-xs font-mono">
            <button 
              type="button"
              (click)="auditFilter.set('ALL')"
              [class.bg-emerald-500]="auditFilter() === 'ALL'"
              [class.text-black]="auditFilter() === 'ALL'"
              [class.font-bold]="auditFilter() === 'ALL'"
              class="px-2.5 py-1 rounded-lg text-slate-300 transition-colors">
              Tous ({{ auditLogs().length }})
            </button>
            <button 
              type="button"
              (click)="auditFilter.set('AUTHORIZED')"
              [class.bg-emerald-500]="auditFilter() === 'AUTHORIZED'"
              [class.text-black]="auditFilter() === 'AUTHORIZED'"
              [class.font-bold]="auditFilter() === 'AUTHORIZED'"
              class="px-2.5 py-1 rounded-lg text-emerald-400 transition-colors">
              Autorisés
            </button>
            <button 
              type="button"
              (click)="auditFilter.set('REJECTED')"
              [class.bg-rose-500]="auditFilter() === 'REJECTED'"
              [class.text-white]="auditFilter() === 'REJECTED'"
              [class.font-bold]="auditFilter() === 'REJECTED'"
              class="px-2.5 py-1 rounded-lg text-rose-400 transition-colors">
              Rejetés
            </button>
          </div>
        </div>

        <!-- Audit Table -->
        <div class="rounded-2xl bg-[#0e0e12] border border-slate-800 overflow-x-auto shadow-xl">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[#141419] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">Heure</th>
                <th class="p-3.5">Instrument</th>
                <th class="p-3.5">Type & Volume</th>
                <th class="p-3.5">Décision</th>
                <th class="p-3.5">Motif Détaillé & Règle Validée</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (log of filteredAuditLogs(); track log.id) {
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="p-3.5 text-slate-400 whitespace-nowrap">{{ log.time }}</td>
                  <td class="p-3.5 font-bold text-white">{{ log.symbol }}</td>
                  <td class="p-3.5">
                    <span 
                      class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      [class.text-emerald-400]="log.type === 'BUY'"
                      [class.text-rose-400]="log.type === 'SELL'">
                      {{ log.type }} {{ log.lots }} Lot
                    </span>
                  </td>
                  <td class="p-3.5">
                    @if (log.status === 'AUTHORIZED') {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        AUTORISÉ
                      </span>
                    } @else {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        REJETÉ
                      </span>
                    }
                  </td>
                  <td class="p-3.5 text-slate-300">{{ log.reason }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Bottom Return Link -->
      <div class="text-center pt-6">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>

    </div>
  `
})
export class RiskComponent implements OnInit {
  onboardingService = inject(OnboardingService);
  dashboardService = inject(DashboardService);
  riskEngineService = inject(RiskEngineService);

  readonly riskPrefs = computed(() => this.onboardingService.riskPreferences());
  readonly metrics = computed(() => this.dashboardService.metrics());

  // Calculator State Signals
  readonly calcCapital = signal<number>(10000);
  readonly calcPair = signal<string>('EUR/USD');
  readonly calcRiskPct = signal<number>(1.0);
  readonly calcSlPips = signal<number>(25);

  // Evaluation Feedback Signal
  readonly evaluationFeedback = signal<string | null>(null);
  readonly evaluationStatus = signal<'NONE' | 'ALLOWED' | 'REJECTED'>('NONE');

  // Audit Logs State (Backend REST API)
  readonly auditFilter = signal<'ALL' | 'AUTHORIZED' | 'REJECTED'>('ALL');

  readonly auditLogs = computed<AuditLogItem[]>(() => {
    const serverLogs = this.riskEngineService.auditLogs();
    if (serverLogs && serverLogs.length > 0) {
      return serverLogs.map(l => ({
        id: l.id,
        time: new Date(l.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        symbol: l.symbol,
        type: (l.actionType === 'BUY' || l.actionType === 'SELL' ? l.actionType : 'BUY') as 'BUY' | 'SELL',
        lots: l.lotSize,
        status: (l.decision === 'ALLOWED' ? 'AUTHORIZED' : 'REJECTED') as 'AUTHORIZED' | 'REJECTED',
        reason: l.reason,
        ruleCategory: 'RISK_PER_TRADE' as const
      }));
    }
    return INITIAL_AUDIT_LOGS;
  });

  readonly filteredAuditLogs = computed(() => {
    const f = this.auditFilter();
    const logs = this.auditLogs();
    if (f === 'ALL') return logs;
    return logs.filter(a => a.status === f);
  });

  // Calculator Computeds
  readonly monetaryRiskDollar = computed(() => {
    return (this.calcCapital() * this.calcRiskPct()) / 100;
  });

  readonly calculatedLotSize = computed(() => {
    const riskDollar = this.monetaryRiskDollar();
    const slPips = Math.max(1, this.calcSlPips());
    const pair = this.calcPair();

    let pipValuePerLot = 10; // Standard USD pair (EUR/USD, GBP/USD, AUD/USD)
    if (pair === 'USD/JPY') pipValuePerLot = 6.45;
    else if (pair === 'USD/CAD') pipValuePerLot = 7.40;
    else if (pair === 'XAU/USD') pipValuePerLot = 10;
    else if (pair === 'BTC/USD') pipValuePerLot = 1;

    const lots = riskDollar / (slPips * pipValuePerLot);
    return Math.max(0.01, Math.min(50.0, Number(lots.toFixed(2))));
  });

  readonly calculatedLeverage = computed(() => {
    const lots = this.calculatedLotSize();
    const notional = lots * 100000;
    const capital = Math.max(1, this.calcCapital());
    return Number((notional / capital).toFixed(1));
  });

  ngOnInit(): void {
    this.riskEngineService.fetchAuditLogs();
  }

  /**
   * Évalue l'intention de calcul de lot en direct auprès du Risk Engine Spring Boot
   */
  async evaluateCurrentRiskIntent(): Promise<void> {
    const result = await this.riskEngineService.evaluateTrade({
      symbol: this.calcPair(),
      direction: 'BUY',
      lotSize: this.calculatedLotSize(),
      requestedRiskPct: this.calcRiskPct(),
      stopLoss: 1.0800,
      accountBalance: this.calcCapital()
    });

    this.evaluationStatus.set(result.decision === 'ALLOWED' ? 'ALLOWED' : 'REJECTED');
    this.evaluationFeedback.set(result.reason);
  }

  onCalcCapitalChange(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.calcCapital.set(val > 0 ? val : 10000);
    this.evaluationStatus.set('NONE');
  }

  onCalcPairChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.calcPair.set(val);
    this.evaluationStatus.set('NONE');
  }

  onCalcRiskChange(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.calcRiskPct.set(val);
    this.evaluationStatus.set('NONE');
  }

  onCalcSlPipsChange(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.calcSlPips.set(val > 0 ? val : 20);
    this.evaluationStatus.set('NONE');
  }
}
