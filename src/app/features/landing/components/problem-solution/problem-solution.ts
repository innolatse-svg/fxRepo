import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';
import { BadgeComponent } from '../../../../shared/components/badge/badge';

@Component({
  selector: 'app-landing-problem-solution',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, BadgeComponent],
  template: `
    <section class="py-16 lg:py-24 bg-[#0a0a0b] border-y border-slate-800 relative overflow-hidden">
      <!-- Glow Accent -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <app-section-header
          eyebrow="LE CONSTAT DU MARCHÉ"
          title="Trop d'informations dispersées. Trop de décisions impulsives."
          subtitle="Un trader Forex doit aujourd'hui naviguer entre des dizaines d'indicateurs contradictoires, des annonces de banques centrales et des règles de risque isolées. Sans cadre unifié, les biais émotionnels prennent le dessus.">
        </app-section-header>

        <!-- Visual Architecture: Funnel / Pipeline -->
        <div class="mt-12 space-y-10">
          
          <!-- Step 1: Fragmented Multiple Sources (The Problem) -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <span class="mat-icon text-rose-400 text-sm">error_outline</span>
                1. Flux d'informations fragmentés & isolés
              </span>
              <app-badge variant="danger" size="sm">RISQUE D'ERREUR HUMAINE</app-badge>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              <!-- Source 1 -->
              <div class="bg-[#141417] p-4 rounded-xl border border-slate-800 space-y-2">
                <span class="mat-icon text-rose-400 text-lg">candlestick_chart</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Analyse Graphique</h4>
                <p class="text-xs text-slate-300 leading-relaxed">Multiples indicateurs sans synthèse globale.</p>
              </div>

              <!-- Source 2 -->
              <div class="bg-[#141417] p-4 rounded-xl border border-slate-800 space-y-2">
                <span class="mat-icon text-rose-400 text-lg">account_balance</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Données Macro</h4>
                <p class="text-xs text-slate-300 leading-relaxed">Différentiels de taux et politiques monétaires disséminés.</p>
              </div>

              <!-- Source 3 -->
              <div class="bg-[#141417] p-4 rounded-xl border border-slate-800 space-y-2">
                <span class="mat-icon text-rose-400 text-lg">calendar_month</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Calendrier Éco</h4>
                <p class="text-xs text-slate-300 leading-relaxed">Chocs de volatilité imprévus au moment d'exécuter.</p>
              </div>

              <!-- Source 4 -->
              <div class="bg-[#141417] p-4 rounded-xl border border-slate-800 space-y-2">
                <span class="mat-icon text-rose-400 text-lg">hub</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Structure Forex</h4>
                <p class="text-xs text-slate-300 leading-relaxed">Force relative des devises difficile à suivre en direct.</p>
              </div>

              <!-- Source 5 -->
              <div class="bg-[#141417] p-4 rounded-xl border border-slate-800 space-y-2">
                <span class="mat-icon text-rose-400 text-lg">shield</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Gestion du Risque</h4>
                <p class="text-xs text-slate-300 leading-relaxed">Calculs de lot manuels sujets à l'overtrading.</p>
              </div>

              <!-- Source 6 -->
              <div class="bg-[#141417] p-4 rounded-xl border border-slate-800 space-y-2">
                <span class="mat-icon text-rose-400 text-lg">account_tree</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Comptes MT5</h4>
                <p class="text-xs text-slate-300 leading-relaxed">Plusieurs comptes brokers à surveiller manuellement.</p>
              </div>

            </div>
          </div>

          <!-- Transition Connector Visual -->
          <div class="flex flex-col items-center justify-center py-1 text-slate-600">
            <div class="h-6 w-px bg-gradient-to-b from-rose-500/50 via-emerald-500/50 to-emerald-500"></div>
            <div class="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a1a1e] border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold shadow-sm">
              <span class="mat-icon text-emerald-400 text-sm">sync_alt</span>
              CENTRALISATION & SYNTHÈSE ALGORITHMIQUE
            </div>
            <div class="h-6 w-px bg-emerald-500/50"></div>
          </div>

          <!-- Step 2: The Unified Solution (Forex Intelligence Platform) -->
          <div class="bg-[#141417] rounded-xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl shadow-black space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              
              <!-- Left: Central Intelligence Core -->
              <div class="space-y-3">
                <app-badge variant="neon" size="sm" [dot]="true">FOREX INTELLIGENCE CORE</app-badge>
                <h3 class="text-xl sm:text-2xl font-bold text-white leading-snug">
                  Un seul moteur pour orchestrer toute votre analyse.
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Notre architecture ingère l'ensemble des flux Forex en continu, filtre le bruit de marché, évalue l'alignement des signaux et soumet chaque opportunité à vos garde-fous de capital prédéfinis.
                </p>
                <div class="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono text-emerald-400 font-bold uppercase">
                  <span class="flex items-center gap-1"><span class="mat-icon text-sm">check_circle</span> Zéro émotion</span>
                  <span class="flex items-center gap-1"><span class="mat-icon text-sm">check_circle</span> Vos propres règles</span>
                  <span class="flex items-center gap-1"><span class="mat-icon text-sm">check_circle</span> Contrôle total</span>
                </div>
              </div>

              <!-- Center/Right: Structured Decision Output Flow -->
              <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                <!-- Pillar 1 Output -->
                <div class="bg-[#0d0d0f] p-4 rounded-xl border border-slate-800 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono text-emerald-400 font-bold uppercase">ÉTAPE 1</span>
                    <span class="mat-icon text-emerald-400 text-base">insights</span>
                  </div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider">Alignement Multi-Piliers</h4>
                  <p class="text-xs text-slate-300 leading-relaxed">Synthèse de convergence entre données techniques, macro et calendrier économique.</p>
                </div>

                <!-- Pillar 2 Output -->
                <div class="bg-[#0d0d0f] p-4 rounded-xl border border-slate-800 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono text-amber-400 font-bold uppercase">ÉTAPE 2</span>
                    <span class="mat-icon text-amber-400 text-base">shield</span>
                  </div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider">Filtre du Risk Engine</h4>
                  <p class="text-xs text-slate-300 leading-relaxed">Vérification de vos limites : risque par trade, perte max quotidienne et paires autorisées.</p>
                </div>

                <!-- Pillar 3 Output -->
                <div class="bg-[#0d0d0f] p-4 rounded-xl border border-emerald-500/30 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono text-emerald-400 font-bold uppercase">RÉSULTAT</span>
                    <span class="mat-icon text-emerald-400 text-base">task_alt</span>
                  </div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider">Décision Structurée</h4>
                  <p class="text-xs text-slate-300 leading-relaxed">Signal contextualisé (BUY / SELL / WAIT) soumis à votre confirmation ou automatisé selon votre choix.</p>
                </div>

              </div>

            </div>

            <!-- Dual-Profile Clarity Banner -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div class="p-3.5 bg-[#0d0d0f] rounded-lg border border-slate-800/80 space-y-1">
                <span class="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <span class="mat-icon text-sm">psychology</span>
                  Pour le trader expérimenté
                </span>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Gain de temps massif, vision macro-technique consolidée, personnalisation totale des règles de money management et orchestration multi-comptes MT5.
                </p>
              </div>

              <div class="p-3.5 bg-[#0d0d0f] rounded-lg border border-slate-800/80 space-y-1">
                <span class="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <span class="mat-icon text-sm">verified_user</span>
                  Pour le trader en quête de méthode
                </span>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Filtrage du bruit et de la surcharge mentale, calcul automatique strict de la taille des positions et protection inviolable contre l'impulsivité.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class ProblemSolutionComponent {}
