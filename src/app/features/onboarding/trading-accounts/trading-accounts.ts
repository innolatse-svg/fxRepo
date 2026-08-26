import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-onboarding-trading-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-4">
      
      <!-- Main Card -->
      <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        <!-- Top Glow Accent -->
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <!-- Header -->
        <div class="space-y-2 text-left mb-6">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <span>Étape 4 &bull; Connexion Broker Externe (Optionnelle)</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Connectez vos propres comptes
          </h1>
          
          <p class="text-sm text-slate-300 leading-relaxed max-w-2xl">
            <strong>Forex Intel n'est pas un courtier (broker).</strong> Vos fonds, dépôts et transactions restent intégralement sous la garde de votre courtier agréé.
          </p>
        </div>

        <!-- Architecture Overview & Trust Banner -->
        <div class="p-4 rounded-xl bg-[#131317] border border-slate-800 flex items-start gap-3 mb-6 text-left">
          <span class="mat-icon text-cyan-400 text-lg flex-shrink-0 mt-0.5">account_balance</span>
          <div class="space-y-1 text-xs">
            <div class="font-bold text-white font-mono uppercase text-[11px]">
              Compatibilité Passerelle MT5 (MetaTrader 5)
            </div>
            <p class="text-slate-300 leading-relaxed">
              La plateforme est conçue pour se connecter en mode lecture ou exécution assistée à vos comptes <strong>DEMO</strong> ou <strong>LIVE</strong> (IC Markets, Pepperstone, FXCM, FTMO, Eightcap...).
            </p>
          </div>
        </div>

        <!-- Accounts Grid / Preview Cards -->
        <div class="space-y-3 mb-8 text-left">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Aperçu de la gestion multi-comptes
            </span>
            <span class="text-[10px] font-mono uppercase bg-[#181820] text-slate-400 px-2 py-0.5 rounded border border-slate-800">
              Exemple de configuration
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Sample Card 1: Demo MT5 -->
            <div class="p-4 rounded-xl bg-[#121216] border border-slate-800 space-y-3 relative overflow-hidden">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    MT5
                  </div>
                  <div>
                    <div class="text-xs font-bold text-white">Compte Sandbox Démo</div>
                    <div class="text-[11px] text-slate-400 font-mono">ICMarketsSC-Demo02</div>
                  </div>
                </div>

                <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono font-bold border border-emerald-500/20">
                  DEMO ACTIVE
                </span>
              </div>

              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Solde simulé : <strong class="text-white">10 000 USD</strong></span>
                <span class="text-emerald-400">Lecture & Ticks OK</span>
              </div>
            </div>

            <!-- Sample Card 2: Live MT5 (Not connected) -->
            <div class="p-4 rounded-xl bg-[#121216] border border-slate-800/80 space-y-3 opacity-70">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                    LIVE
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-300">Compte Réel Broker</div>
                    <div class="text-[11px] text-slate-400 font-mono">Non connecté</div>
                  </div>
                </div>

                <span class="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono font-bold border border-slate-700">
                  INACTIF
                </span>
              </div>

              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Règles de sécurité : Stricte</span>
                <span>Configurable ultérieurement</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Non-Credential Notice -->
        <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-slate-300 flex items-start gap-3 mb-8 text-left">
          <span class="mat-icon text-amber-400 text-base flex-shrink-0 mt-0.5">security</span>
          <span>
            <strong>Sécurité des identifiants :</strong> Vous ne saisissez aucun mot de passe de compte réel lors de cet onboarding. L'appairage se fera de manière sécurisée directement depuis les paramètres de votre terminal.
          </span>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            (click)="goBack()"
            class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            ← Étape précédente
          </button>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              (click)="continue()"
              class="px-4 py-2.5 rounded-lg bg-[#141418] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Configurer plus tard (Ignorer)
            </button>

            <app-button
              variant="primary"
              size="lg"
              (btnClick)="continue()">
              Continuer : Automatisation →
            </app-button>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: ``
})
export class OnboardingTradingAccountsComponent implements OnInit {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  ngOnInit() {
    this.onboardingService.setStep(4);
  }

  goBack() {
    this.router.navigate(['/onboarding/risk-management']);
  }

  continue() {
    this.onboardingService.setStep(5);
    this.router.navigate(['/onboarding/automation']);
  }
}
