import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-landing-risk-engine',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  template: `
    <section id="risk-management" class="py-16 lg:py-24 bg-[#0a0a0b] border-t border-slate-800 relative overflow-hidden">
      <!-- Glow -->
      <div class="absolute left-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-ambient-emerald pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <app-section-header
          eyebrow="RISK ENGINE & GOUVERNANCE"
          title="Une bonne analyse ne sert à rien sans gestion stricte du risque."
          subtitle="Le Risk Engine est le coeur inviolable de la plateforme. Aucune analyse, signal ou niveau d'automatisation ne peut contourner vos garde-fous de capital prédéfinis.">
        </app-section-header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10 items-center">
          
          <!-- Left: Key Pillars of Risk Engine (7 Cols) -->
          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <!-- Guardrail 1: Risk Per Trade -->
            <div class="bg-[#141417] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
              <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-emerald-400">
                <span class="mat-icon text-lg">percent</span>
              </div>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Risque par Trade Verrouillé</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Calcul automatique de la taille de lot exacte en fonction de votre capital et de la distance du Stop Loss (ex: 0.5% ou 1.0%).
              </p>
            </div>

            <!-- Guardrail 2: Maximum Daily Loss -->
            <div class="bg-[#141417] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
              <div class="w-8 h-8 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <span class="mat-icon text-lg">block</span>
              </div>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Perte Max Quotidienne</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Circuit-breaker d'urgence : interruption automatique de toute nouvelle prise de position si votre seuil journalier est atteint.
              </p>
            </div>

            <!-- Guardrail 3: Drawdown Protection -->
            <div class="bg-[#141417] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
              <div class="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <span class="mat-icon text-lg">trending_down</span>
              </div>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Protection du Drawdown</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Surveillance en temps réel du drawdown global et réduction progressive de l'exposition en période de volatilité défavorable.
              </p>
            </div>

            <!-- Guardrail 4: Pause Volatilité & Actualités -->
            <div class="bg-[#141417] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
              <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-slate-300">
                <span class="mat-icon text-lg">pause_circle</span>
              </div>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Filtre Calendrier Éco</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Suspension automatique des prises de positions 15 à 30 minutes avant et après les annonces majeures (NFP, CPI, Décisions de taux).
              </p>
            </div>

            <!-- Guardrail 5: Validation Manuelle en Option -->
            <div class="sm:col-span-2 bg-[#141417] p-4 sm:p-5 rounded-xl border border-emerald-500/30 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="mat-icon text-emerald-400 text-xl">fingerprint</span>
                  <h3 class="text-xs font-bold text-white uppercase tracking-wider">Confirmation Manuelle Systématique</h3>
                </div>
                <span class="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold font-mono tracking-widest uppercase border border-emerald-500/20">
                  VOUS GARDEZ LA MAIN
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Exigez une validation en 1 clic pour chaque signal généré avant toute exécution sur votre compte de démonstration ou réel connecté. L'automatisation ne court-circuite jamais votre décision.
              </p>
            </div>

          </div>

          <!-- Right: Visual Risk Decision Pipeline (5 Cols) -->
          <div class="lg:col-span-5 bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-2xl shadow-black">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Pipeline du Risk Engine</span>
              <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold font-mono tracking-widest uppercase border border-emerald-500/20">
                TEMPS RÉEL
              </span>
            </div>

            <!-- Step 1 in Pipeline -->
            <div class="bg-[#0d0d0f] p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">1</span>
                <span class="text-slate-300">Opportunité & Alignement</span>
              </div>
              <span class="text-emerald-400 font-bold">Alignement 87%</span>
            </div>

            <!-- Arrow Down -->
            <div class="flex justify-center -my-2 text-slate-600">
              <span class="mat-icon text-xs">arrow_downward</span>
            </div>

            <!-- Step 2 in Pipeline -->
            <div class="bg-[#0d0d0f] p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">2</span>
                <span class="text-slate-300">Vérification calendrier éco</span>
              </div>
              <span class="text-emerald-400 font-bold">Aucun choc &lt; 30m</span>
            </div>

            <!-- Arrow Down -->
            <div class="flex justify-center -my-2 text-slate-600">
              <span class="mat-icon text-xs">arrow_downward</span>
            </div>

            <!-- Step 3 in Pipeline -->
            <div class="bg-[#0d0d0f] p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded bg-[#1e1e24] text-slate-300 flex items-center justify-center font-bold text-[10px]">3</span>
                <span class="text-slate-300">Calcul du lot (1.0% de risque)</span>
              </div>
              <span class="text-slate-200 font-bold">0.45 Lot</span>
            </div>

            <!-- Arrow Down -->
            <div class="flex justify-center -my-2 text-slate-600">
              <span class="mat-icon text-xs">arrow_downward</span>
            </div>

            <!-- Step 4 in Pipeline: Output Gate -->
            <div class="bg-[#0d0d0f] p-3.5 rounded-lg border border-emerald-500/30 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">AUTORISATION RISK ENGINE VALIDÉE</span>
                <span class="mat-icon text-emerald-400 text-base">verified_user</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                L'ordre respecte l'ensemble de vos règles de gestion du risque et peut être soumis à votre confirmation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class RiskEngineComponent {}
