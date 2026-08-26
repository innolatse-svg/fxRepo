import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent],
  template: `
    <footer class="bg-[#0a0a0b] border-t border-slate-800 text-slate-400 text-xs">
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          <!-- Column 1: Brand & Identity -->
          <div class="lg:col-span-2 space-y-3">
            <app-logo routerLink="/" size="md" badge="PRO"></app-logo>

            <p class="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plateforme d'intelligence de marché, de synthèse multi-sources et d'orchestration du risque dédiée aux traders Forex professionnels.
            </p>

            <div class="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span class="px-2 py-0.5 rounded bg-[#141417] border border-slate-800 text-slate-300">Architecture Modulaire</span>
              <span class="px-2 py-0.5 rounded bg-[#141417] border border-slate-800 text-slate-300">MetaTrader 5 Bridge</span>
              <span class="px-2 py-0.5 rounded bg-[#141417] border border-slate-800 text-slate-300">Zero Broker Lock-in</span>
            </div>
          </div>

          <!-- Column 2: Produit -->
          <div class="space-y-2.5">
            <p class="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-widest">
              Produit
            </p>
            <ul class="space-y-2 text-xs">
              <li>
                <a href="#market-intelligence" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Analyse Technique & Fondamentale
                </a>
              </li>
              <li>
                <a href="#market-intelligence" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Signaux & Synthèse IA
                </a>
              </li>
              <li>
                <a href="#risk-management" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Risk Management Engine
                </a>
              </li>
              <li>
                <a href="#trading-accounts" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Trading Accounts & MT5
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Plateforme -->
          <div class="space-y-2.5">
            <p class="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-widest">
              Plateforme
            </p>
            <ul class="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Fonctionnalités Clés
                </a>
              </li>
              <li>
                <a href="#risk-management" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Sécurité & Isolation
                </a>
              </li>
              <li>
                <a href="#trading-accounts" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Intégrations Brokers
                </a>
              </li>
              <li>
                <a href="#automation" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Niveaux d'Automatisation
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Légal & Entreprise -->
          <div class="space-y-2.5">
            <p class="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-widest">
              Légal & Contact
            </p>
            <ul class="space-y-2 text-xs">
              <li>
                <a routerLink="/legal/terms" class="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:underline">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a routerLink="/legal/privacy" class="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:underline">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#risk-management" class="text-slate-400 hover:text-emerald-400 transition-colors">
                  Gestion des risques
                </a>
              </li>
              <li>
                <a routerLink="/legal/terms" fragment="contact" class="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:underline">
                  Contact & Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        <!-- Mandatory Risk Disclaimer Box -->
        <div class="mt-10 pt-6 border-t border-slate-800">
          <div class="rounded-xl bg-[#141417] p-4 border border-slate-800 space-y-2">
            <div class="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span class="mat-icon text-amber-400 text-sm">warning_amber</span>
              Avertissement Légal & Divulgation des Risques
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              <strong class="text-slate-300">Avertissement sur les risques financiers :</strong> Le trading sur devises (Forex) et produits dérivés avec effet de levier comporte un niveau élevé de risque et peut ne pas convenir à tous les investisseurs. Le risque de perte en capital peut être substantiel. <strong class="text-slate-300">Le trading comporte des risques. Les performances passées ne garantissent pas les résultats futurs.</strong>
            </p>
            <p class="text-[10px] text-slate-400 leading-relaxed">
              <strong class="text-slate-400">Nature du service :</strong> FOREX INTELLIGENCE PLATFORM (FOREX INTEL) est un logiciel SaaS technologique d'intelligence de marché, d'aide à la décision et d'orchestration. <span class="text-slate-400">FOREX INTEL n'est pas un broker, n'est pas un intermédiaire financier, ne fournit aucun conseil en investissement personnalisé, ne conserve aucun fond client et ne promet aucun rendement.</span> Tous les comptes de trading restent hébergés exclusivement chez vos brokers partenaires agréés.
            </p>
          </div>

          <div class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
            <p>© 2026 FOREX INTEL — Tous droits réservés.</p>
            <div class="flex items-center gap-3 text-[10px]">
              <span class="text-slate-400">BUILD: v1.0.0-PROD</span>
              <span class="text-slate-700">•</span>
              <span class="text-emerald-400">ANGULAR HIGH DENSITY ENGINE</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {}
