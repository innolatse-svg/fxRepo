import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OnboardingService } from '../../core/services/onboarding.service';

@Component({
  selector: 'app-accounts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto text-left">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">account_balance</span>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Comptes MT5 & Passerelle Broker</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Gestion des identifiants brokers, serveurs MT5 et autorisations d'exécution d'ordres.
          </p>
        </div>
        <a 
          routerLink="/app/settings"
          [queryParams]="{ tab: 'accounts' }"
          class="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
          + Connecter un compte
        </a>
      </div>

      <!-- Account List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (acc of accounts(); track acc.id) {
          <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {{ acc.accountType }}
              </span>
              <span class="text-xs font-mono text-slate-400">Serveur: {{ acc.server }}</span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white">{{ acc.brokerName }}</h3>
              <p class="text-xs text-slate-400 font-mono">Identifiant : #{{ acc.accountNumber }}</p>
            </div>

            <div class="text-sm font-mono text-emerald-400 font-bold">
              Solde : {{ acc.balanceDemo || 10000 | number:'1.2-2' }} {{ acc.currency }}
            </div>

            <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-400">Statut de la passerelle :</span>
              <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Connectée (Sandbox)
              </span>
            </div>
          </div>
        }
      </div>

      <div class="text-center pt-4">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>
    </div>
  `
})
export class AccountsComponent {
  onboardingService = inject(OnboardingService);
  accounts = computed(() => this.onboardingService.tradingAccounts());
}
