import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-landing-how-it-works',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  template: `
    <section id="how-it-works" class="py-16 lg:py-24 bg-[#0a0a0b] border-t border-slate-800 relative overflow-hidden">
      <!-- Glow -->
      <div class="absolute left-1/2 bottom-0 -translate-x-1/2 w-[700px] h-[300px] glow-ambient-emerald pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <app-section-header
          eyebrow="ONBOARDING EN 4 ÉTAPES"
          title="Comment ça marche ?"
          subtitle="Un parcours d'activation simple et sécurisé pour transformer votre méthode de travail en quelques minutes.">
        </app-section-header>

        <!-- 4 Steps Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
          
          <!-- Step 01 -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 group shadow-lg">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-2xl font-extrabold font-mono text-emerald-400">01</span>
                <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                  <span class="mat-icon text-lg">tune</span>
                </div>
              </div>

              <h3 class="text-sm font-bold text-white uppercase tracking-wider">Configurez votre espace</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Créez votre profil, choisissez vos préférences d'affichage (thème sombre pro, unités de pips, fuseau horaire) et activez votre essai de 15 jours sans engagement.
              </p>
            </div>

            <div class="pt-2.5 border-t border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wide">
              Durée : ~2 minutes
            </div>
          </div>

          <!-- Step 02 -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group shadow-lg">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-2xl font-extrabold font-mono text-slate-300">02</span>
                <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <span class="mat-icon text-lg">account_tree</span>
                </div>
              </div>

              <h3 class="text-sm font-bold text-white uppercase tracking-wider">Connectez vos comptes</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Associez vos comptes de démonstration ou réels de vos brokers via la passerelle MT5 et sélectionnez les paires Forex autorisées (ex: EUR/USD, GBP/USD).
              </p>
            </div>

            <div class="pt-2.5 border-t border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wide">
              Fonds chez votre broker
            </div>
          </div>

          <!-- Step 03 -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 group shadow-lg">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-2xl font-extrabold font-mono text-amber-400">03</span>
                <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 transition-colors">
                  <span class="mat-icon text-lg">shield</span>
                </div>
              </div>

              <h3 class="text-sm font-bold text-white uppercase tracking-wider">Définissez votre risque</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Verrouillez vos limites : risque max par position (ex: 1%), seuil de perte journalière (ex: 2%) et confirmation manuelle en 1 clic obligatoire.
              </p>
            </div>

            <div class="pt-2.5 border-t border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wide">
              Règles inviolables
            </div>
          </div>

          <!-- Step 04 -->
          <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 group shadow-lg">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-2xl font-extrabold font-mono text-emerald-400">04</span>
                <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                  <span class="mat-icon text-lg">bolt</span>
                </div>
              </div>

              <h3 class="text-sm font-bold text-white uppercase tracking-wider">Analysez & orchestrez</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Recevez les synthèses, évaluez l'alignement multi-piliers, validez les opportunités détectées et automatisez l'exécution vers vos comptes au rythme souhaité.
              </p>
            </div>

            <div class="pt-2.5 border-t border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wide">
              Contrôle continu
            </div>
          </div>

        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class HowItWorksComponent {}
