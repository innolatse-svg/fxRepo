import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MarketDemoService } from '../../../../core/services/market-demo.service';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';
import { BadgeComponent } from '../../../../shared/components/badge/badge';
import { StatusIndicatorComponent } from '../../../../shared/components/status-indicator/status-indicator';

@Component({
  selector: 'app-landing-trading-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, BadgeComponent, StatusIndicatorComponent],
  template: `
    <section id="trading-accounts" class="py-16 lg:py-24 bg-[#0a0a0b] border-t border-slate-800 relative overflow-hidden">
      <!-- Ambient Glow -->
      <div class="absolute top-1/3 left-10 w-[450px] h-[450px] glow-ambient-emerald pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <app-section-header
          eyebrow="CONNEXION BROKERS & MT5"
          title="Vos comptes. Vos règles. Votre contrôle."
          subtitle="FOREX INTEL n'est pas un courtier. Vos fonds et vos comptes restent chez votre broker habituel. Vous connectez simplement vos terminaux via notre passerelle d'orchestration sécurisée.">
        </app-section-header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 items-start">
          
          <!-- Left: Key Architectural Principles -->
          <div class="space-y-4 lg:sticky lg:top-24">
            <div class="bg-[#141417] rounded-xl p-5 sm:p-6 border border-slate-800 space-y-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center">
                  <span class="mat-icon text-emerald-400 text-lg">hub</span>
                </div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">Intégration MetaTrader 5</h3>
              </div>

              <p class="text-xs text-slate-300 leading-relaxed">
                Connectez vos comptes de démonstration ou réels. Vous décidez à tout instant quel compte a le droit de recevoir ou d'exécuter des ordres.
              </p>

              <div class="pt-2 space-y-2 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="mat-icon text-emerald-400 text-base">check_circle</span>
                  <span>Aucun dépôt de fonds sur notre plateforme</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="mat-icon text-emerald-400 text-base">check_circle</span>
                  <span>Compatible avec votre broker habituel (MT5)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="mat-icon text-emerald-400 text-base">check_circle</span>
                  <span>Isolement complet des accès et clés de trading</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="mat-icon text-emerald-400 text-base">check_circle</span>
                  <span>Activation ou coupure instantanée en 1 clic</span>
                </div>
              </div>
            </div>

            <!-- Important Broker Disclaimer Callout -->
            <div class="p-4 rounded-xl bg-[#141417] border border-slate-800 text-xs text-slate-300 space-y-1.5 shadow-md">
              <span class="text-emerald-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                <span class="mat-icon text-emerald-400 text-sm">lock</span>
                Garantie de non-détention des fonds
              </span>
              <p class="leading-relaxed text-slate-400">
                « Vos comptes et vos capitaux restent exclusivement chez votre broker. FOREX INTEL n'a jamais accès à vos retraits ni à vos dépôts. »
              </p>
            </div>
          </div>

          <!-- Right: Interactive Accounts Control Mockup (2 Cols) -->
          <div class="lg:col-span-2 space-y-3.5">
            
            <div class="flex items-center justify-between px-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              <span>COMPTES DE TRADING DÉTECTÉS</span>
              <span>STATUT PASSERELLE MT5</span>
            </div>

            <!-- Account 1: Demo Account 1 Connected -->
            <div class="bg-[#141417] rounded-xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg shadow-black">
              <div class="flex flex-wrap items-center justify-between gap-2.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs">
                    MT5
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-white uppercase tracking-wide">Broker Partenaire A</h4>
                      <app-badge variant="success" size="sm">DEMO</app-badge>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400">Compte: #78491029 • Serveur: Partner-Demo-01</span>
                  </div>
                </div>

                <div class="flex items-center gap-2.5">
                  <app-status-indicator status="CONNECTED" label="CONNECTED"></app-status-indicator>
                  <button 
                    type="button"
                    (click)="marketService.toggleAccountExecution('acc-1')"
                    class="px-2.5 py-1 text-[10px] font-mono font-bold rounded border transition-all cursor-pointer uppercase tracking-wider"
                    [class]="marketService.demoAccounts()[0].isExecutionAllowed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                      : 'bg-[#1a1a1e] text-slate-400 border-slate-800'">
                    {{ marketService.demoAccounts()[0].isExecutionAllowed ? 'ORDRES AUTORISÉS' : 'PAUSE EXÉCUTION' }}
                  </button>
                </div>
              </div>

              <!-- Balance & Equity Row -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#0d0d0f] p-3 rounded-lg border border-slate-800 text-xs font-mono">
                <div>
                  <span class="text-slate-400 text-[9px] block uppercase font-bold tracking-wider">BALANCE</span>
                  <span class="text-slate-200 font-bold text-xs">$100,000.00</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[9px] block uppercase font-bold tracking-wider">EQUITY DÉMO</span>
                  <span class="text-emerald-400 font-bold text-xs">$102,450.00</span>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <span class="text-slate-400 text-[9px] block uppercase font-bold tracking-wider">ALLOCATION RISQUE</span>
                  <span class="text-emerald-400 font-bold text-xs">1.0% / trade</span>
                </div>
              </div>
            </div>

            <!-- Account 2: Demo Account 2 Connected -->
            <div class="bg-[#141417] rounded-xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg shadow-black">
              <div class="flex flex-wrap items-center justify-between gap-2.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs">
                    MT5
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-white uppercase tracking-wide">Broker Partenaire B</h4>
                      <app-badge variant="success" size="sm">DEMO</app-badge>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400">Compte: #44910283 • Serveur: Partner-Pro-Demo</span>
                  </div>
                </div>

                <div class="flex items-center gap-2.5">
                  <app-status-indicator status="CONNECTED" label="CONNECTED"></app-status-indicator>
                  <button 
                    type="button"
                    (click)="marketService.toggleAccountExecution('acc-2')"
                    class="px-2.5 py-1 text-[10px] font-mono font-bold rounded border transition-all cursor-pointer uppercase tracking-wider"
                    [class]="marketService.demoAccounts()[1].isExecutionAllowed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                      : 'bg-[#1a1a1e] text-slate-400 border-slate-800'">
                    {{ marketService.demoAccounts()[1].isExecutionAllowed ? 'ORDRES AUTORISÉS' : 'PAUSE EXÉCUTION' }}
                  </button>
                </div>
              </div>

              <!-- Balance & Equity Row -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#0d0d0f] p-3 rounded-lg border border-slate-800 text-xs font-mono">
                <div>
                  <span class="text-slate-400 text-[9px] block uppercase font-bold tracking-wider">BALANCE</span>
                  <span class="text-slate-200 font-bold text-xs">€50,000.00</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[9px] block uppercase font-bold tracking-wider">EQUITY DÉMO</span>
                  <span class="text-emerald-400 font-bold text-xs">€50,820.00</span>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <span class="text-slate-400 text-[9px] block uppercase font-bold tracking-wider">ALLOCATION RISQUE</span>
                  <span class="text-emerald-400 font-bold text-xs">0.5% / trade</span>
                </div>
              </div>
            </div>

            <!-- Account 3: Live Account (Disabled by default for safety) -->
            <div class="bg-[#141417] rounded-xl p-4 sm:p-5 border border-slate-800 opacity-80 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#1a1a1e] border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-xs">
                    MT5
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wide">Compte Principal Réel</h4>
                      <app-badge variant="neutral" size="sm">LIVE RÉEL</app-badge>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400">Compte: #99201844 • Serveur: Partner-Live-Real02</span>
                  </div>
                </div>

                <div class="flex items-center gap-2.5">
                  <app-status-indicator status="DISABLED" label="DISABLED"></app-status-indicator>
                  <span class="px-2.5 py-1 text-[10px] font-mono font-bold rounded bg-[#1a1a1e] text-slate-400 border border-slate-800 uppercase tracking-wider">
                    EXÉCUTION VERROUILLÉE
                  </span>
                </div>
              </div>

              <!-- Live Account Protection Notice -->
              <div class="bg-[#0d0d0f] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span class="flex items-center gap-1.5">
                  <span class="mat-icon text-amber-400 text-xs">lock</span>
                  Nécessite la phase de validation sur compte DEMO préalable.
                </span>
                <span class="font-mono text-slate-400 text-[10px] font-bold">SÉCURITÉ STRICTE</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class TradingAccountsComponent {
  marketService = inject(MarketDemoService);
}
