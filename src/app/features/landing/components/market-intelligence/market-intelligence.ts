import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-landing-market-intelligence',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  template: `
    <section id="market-intelligence" class="py-16 lg:py-24 bg-[#0a0a0b] border-t border-slate-800 relative overflow-hidden">
      <!-- Glow ambient -->
      <div class="absolute right-0 top-1/4 w-[500px] h-[500px] glow-ambient-emerald pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <app-section-header
          eyebrow="LES 4 PILIERS DE L'INTELLIGENCE"
          title="Une vision complète et contextualisée du Forex."
          subtitle="Chaque opportunité est examinée à travers quatre angles complémentaires pour éliminer les faux signaux et préserver votre capital.">
        </app-section-header>

        <!-- 4 Pillars Grid (High Density Theme) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-10">
          
          <!-- Pillar 1: Analyse Technique -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-4 group">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                <span class="mat-icon text-xl">candlestick_chart</span>
              </div>
              <span class="px-2.5 py-0.5 bg-[#1a1a1e] text-emerald-400 rounded text-[10px] font-mono font-bold uppercase border border-slate-800">
                PILIER 01
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-base sm:text-lg font-bold text-white uppercase tracking-wide">Analyse Technique Avancée</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Cartographie instantanée de la structure de marché sans surcharge visuelle.
              </p>
            </div>

            <!-- Bullet capabilities -->
            <div class="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Identification automatique des tendances multi-timeframes (M15, H1, H4, D1)</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Détection des zones clés : supports majeurs, résistances et order blocks</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Analyse des cassures (breakouts) et détection des faux mouvements</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Convergence des indicateurs de momentum (RSI, EMAs dynamiques, ATR)</span>
              </div>
            </div>
          </div>

          <!-- Pillar 2: Analyse Fondamentale & Macro -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-slate-700 transition-all space-y-4 group">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                <span class="mat-icon text-xl">account_balance</span>
              </div>
              <span class="px-2.5 py-0.5 bg-[#1a1a1e] text-slate-300 rounded text-[10px] font-mono font-bold uppercase border border-slate-800">
                PILIER 02
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-base sm:text-lg font-bold text-white uppercase tracking-wide">Analyse Fondamentale & Macro</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Compréhension des forces macroéconomiques qui dictent les flux de capitaux mondiaux.
              </p>
            </div>

            <!-- Bullet capabilities -->
            <div class="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <div class="flex items-start gap-2">
                <span class="mat-icon text-slate-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Suivi des politiques des banques centrales (Fed, BCE, BoE, BoJ)</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-slate-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Calcul des différentiels de taux d'intérêt et flux de carry trade</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-slate-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Matrice de force relative par devise (USD, EUR, GBP, JPY, CAD, AUD, CHF)</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-slate-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Mesure du sentiment de risque global : Risk-On vs Risk-Off</span>
              </div>
            </div>
          </div>

          <!-- Pillar 3: Événements Économiques -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-amber-500/30 transition-all space-y-4 group">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 transition-colors">
                <span class="mat-icon text-xl">calendar_month</span>
              </div>
              <span class="px-2.5 py-0.5 bg-[#1a1a1e] text-amber-400 rounded text-[10px] font-mono font-bold uppercase border border-slate-800">
                PILIER 03
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-base sm:text-lg font-bold text-white uppercase tracking-wide">Événements Économiques & Volatilité</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Anticipation des chocs de volatilité et protection automatique du capital.
              </p>
            </div>

            <!-- Bullet capabilities -->
            <div class="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <div class="flex items-start gap-2">
                <span class="mat-icon text-amber-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Calendrier économique filtré par impact (CPI, NFP, Décisions de taux)</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-amber-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Alertes de volatilité imminente et analyse des écarts consensus vs publié</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-amber-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Mise en pause automatique des prises de positions lors des annonces majeures</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-amber-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Protection proactive contre les élargissements de spreads et le slippage</span>
              </div>
            </div>
          </div>

          <!-- Pillar 4: Intelligence Artificielle & Synthèse -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-4 group">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                <span class="mat-icon text-xl">psychology</span>
              </div>
              <span class="px-2.5 py-0.5 bg-[#1a1a1e] text-emerald-400 rounded text-[10px] font-mono font-bold uppercase border border-slate-800">
                PILIER 04
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-base sm:text-lg font-bold text-white uppercase tracking-wide">Synthèse & Alignement des Signaux</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Une IA explicable qui synthétise les données complexes en signaux clairs et justifiés.
              </p>
            </div>

            <!-- Bullet capabilities -->
            <div class="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Synthèse unifiée des contextes de marché en langage clair et direct</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Score d'alignement des signaux (0 à 100%) mesurant la convergence des piliers</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Proposition de plans structurés (Direction, Invalidation SL, Objectif TP)</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">arrow_right</span>
                <span>Zéro boîte noire : chaque signal affiche la justification détaillée et traçable</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Forex Scope Note Banner -->
        <div class="mt-8 p-4 rounded-xl bg-[#141417] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5 text-slate-300">
            <span class="mat-icon text-emerald-400 text-base">info</span>
            <span><strong>Positionnement :</strong> Moteur optimisé en priorité pour le marché du Forex (paires majeures et croisées).</span>
          </div>
          <span class="text-[10px] font-mono uppercase text-slate-400 px-2.5 py-1 rounded bg-[#1c1c22] border border-slate-700 whitespace-nowrap">
            Extensions Or & Crypto en aperçu
          </span>
        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class MarketIntelligenceComponent {}
