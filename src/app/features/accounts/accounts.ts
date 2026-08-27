import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TradingAccountService, TradingAccountResponse } from '../../core/services/trading-account.service';
import { AuthService } from '../../core/services/auth.service';

export interface MT5AccountExtended {
  id: string;
  broker: string;
  server: string;
  login: string;
  accountType: 'DEMO' | 'LIVE';
  balance: number;
  equity: number;
  currency: string;
  leverage: string;
  pingMs: number;
  connected: boolean;
  autoTradingEnabled: boolean;
  lastSyncTime: string;
}

export const INITIAL_ACCOUNTS: MT5AccountExtended[] = [
  {
    id: 'acc-demo-1',
    broker: 'Deriv Limited',
    server: 'Deriv-Demo',
    login: '10894521',
    accountType: 'DEMO',
    balance: 10000.00,
    equity: 10185.50,
    currency: 'USD',
    leverage: '1:100',
    pingMs: 21,
    connected: true,
    autoTradingEnabled: true,
    lastSyncTime: 'À l\'instant'
  },
  {
    id: 'acc-live-1',
    broker: 'IC Markets Global',
    server: 'ICMarketsSC-Live04',
    login: '54209118',
    accountType: 'LIVE',
    balance: 50000.00,
    equity: 50000.00,
    currency: 'USD',
    leverage: '1:30',
    pingMs: 38,
    connected: true,
    autoTradingEnabled: false,
    lastSyncTime: 'Il y a 3 min'
  }
];

@Component({
  selector: 'app-accounts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule],
  template: `
    <div class="space-y-8 max-w-7xl mx-auto text-left">
      
      <!-- ============================================================ -->
      <!-- HEADER & ACTIONS                                             -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">cable</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Passerelles & Comptes MetaTrader 5
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              BRIDGE EA ULTRA-LOW LATENCY
            </span>
            @if (isSuperAdmin()) {
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                👑 ADMIN MODE (QUOTAS ILLIMITÉS)
              </span>
            }
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Gérez vos connexions brokers MT5, surveillez la latence des serveurs et configurez le routage des ordres.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            id="add-account-btn"
            type="button"
            [disabled]="isExpired() && !isSuperAdmin()"
            (click)="openAddAccountModal.set(true)"
            class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
            <span class="mat-icon text-base">add</span>
            <span>Connecter un Compte MT5</span>
          </button>
        </div>
      </div>

      <!-- SaaS Expired Banner -->
      @if (isExpired() && !isSuperAdmin()) {
        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 text-rose-400 text-xs">
            <span class="mat-icon text-lg">warning</span>
            <span><strong>Période d'essai terminée :</strong> Votre accès aux fonctionnalités de trading et aux comptes MT5 est suspendu.</span>
          </div>
          <a routerLink="/app/settings" class="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs">
            Mettre à niveau
          </a>
        </div>
      }

      <!-- ============================================================ -->
      <!-- GLOBAL BRIDGE TELEMETRY STATUS                               -->
      <!-- ============================================================ -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Passerelles Actives</div>
          <div class="text-2xl font-black font-mono text-white">{{ connectedAccountsCount() }} / {{ accounts().length }}</div>
          <div class="text-[10px] text-emerald-400">Toutes opérationnelles</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Latence Moyenne Broker</div>
          <div class="text-2xl font-black font-mono text-emerald-400">{{ avgLatency() }} ms</div>
          <div class="text-[10px] text-slate-400">Serveurs Londres & Frankfurt</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Capital Global Connecté</div>
          <div class="text-2xl font-black font-mono text-cyan-400">{{ totalCapital() | number:'1.2-2' }} $</div>
          <div class="text-[10px] text-slate-400">Valorisation en temps réel</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0e0e12] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono uppercase text-slate-400">Sécurité des Identifiants</div>
          <div class="text-2xl font-black font-mono text-indigo-400">AES-256</div>
          <div class="text-[10px] text-slate-400">Chiffrement matériel sécurisé</div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- ACCOUNTS LIST CARDS                                          -->
      <!-- ============================================================ -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-lg">dns</span>
            <span>Comptes MT5 Raccordés</span>
          </h2>
          <span class="text-xs text-slate-400 font-mono">Délai d'exécution max : 85 ms</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          @for (acc of accounts(); track acc.id) {
            <div class="p-6 rounded-2xl bg-[#0e0e12] border border-slate-800/90 shadow-xl space-y-5 hover:border-slate-700 transition-all text-left relative overflow-hidden">
              
              <!-- Card Header -->
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-bold text-white tracking-tight">{{ acc.broker }}</h3>
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                      [class.bg-emerald-500/20]="acc.accountType === 'DEMO'"
                      [class.text-emerald-400]="acc.accountType === 'DEMO'"
                      [class.bg-amber-500/20]="acc.accountType === 'LIVE'"
                      [class.text-amber-400]="acc.accountType === 'LIVE'">
                      {{ acc.accountType === 'DEMO' ? 'DÉMO SANDBOX' : 'COMPTE RÉEL / LIVE' }}
                    </span>
                  </div>
                  <div class="text-xs font-mono text-slate-400">
                    Serveur : <strong class="text-slate-300">{{ acc.server }}</strong> &bull; Login : <strong class="text-slate-300">{{ maskLogin(acc.login) }}</strong>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{{ acc.pingMs }} ms</span>
                </div>
              </div>

              <!-- Balance & Equity Box -->
              <div class="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-center">
                <div>
                  <div class="text-slate-400 text-[10px]">Solde (Balance)</div>
                  <div class="font-bold text-white text-base mt-0.5">{{ acc.balance | number:'1.2-2' }} $</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Capitaux Propres (Equity)</div>
                  <div class="font-bold text-emerald-400 text-base mt-0.5">{{ acc.equity | number:'1.2-2' }} $</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Levier Max</div>
                  <div class="font-bold text-cyan-400 text-base mt-0.5">{{ acc.leverage }}</div>
                </div>
              </div>

              <!-- Automation Switch Row -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-[#181822] border border-slate-800/80">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-white flex items-center gap-1.5">
                    <span class="mat-icon text-sm text-emerald-400">smart_toy</span>
                    <span>Routage Automatique des Ordres IA</span>
                  </div>
                  <p class="text-[11px] text-slate-400">
                    Transmet automatiquement les signaux validés par le Risk Engine.
                  </p>
                </div>

                <button 
                  type="button"
                  (click)="toggleAutoTrading(acc.id)"
                  [class.bg-emerald-500]="acc.autoTradingEnabled"
                  [class.bg-slate-700]="!acc.autoTradingEnabled"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  role="switch"
                  [attr.aria-checked]="acc.autoTradingEnabled">
                  <span 
                    [class.translate-x-5]="acc.autoTradingEnabled"
                    [class.translate-x-0]="!acc.autoTradingEnabled"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out">
                  </span>
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span class="text-slate-400 font-mono text-[10px]">Dernière synchro : {{ acc.lastSyncTime }}</span>

                <div class="flex items-center gap-2">
                  <button 
                    type="button"
                    (click)="testPing(acc.id)"
                    class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1">
                    <span class="mat-icon text-xs text-emerald-400">speed</span>
                    <span>Tester Ping</span>
                  </button>

                  <button 
                    type="button"
                    (click)="syncBalance(acc.id)"
                    class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1">
                    <span class="mat-icon text-xs text-cyan-400" [class.animate-spin]="isSyncing() === acc.id">sync</span>
                    <span>Synchroniser</span>
                  </button>

                  <button 
                    type="button"
                    (click)="removeAccount(acc.id)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Dissocier ce compte">
                    <span class="mat-icon text-base">delete</span>
                  </button>
                </div>
              </div>

            </div>
          }
        </div>
      </div>

      <!-- Bottom Return Link -->
      <div class="text-center pt-6">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>

    </div>

    <!-- ============================================================ -->
    <!-- MODAL : CONNECT MT5 ACCOUNT                                  -->
    <!-- ============================================================ -->
    @if (openAddAccountModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        
        <div class="w-full max-w-md bg-[#0e0e12] border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-5">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <span class="mat-icon text-lg">add_link</span>
              </div>
              <h3 class="text-base font-bold text-white">Connexion Passerelle MT5</h3>
            </div>
            <button 
              type="button"
              (click)="openAddAccountModal.set(false)"
              class="p-1 text-slate-400 hover:text-white">
              <span class="mat-icon text-lg">close</span>
            </button>
          </div>

          <form [formGroup]="accountForm" (ngSubmit)="submitNewAccount()" class="space-y-4">
            
            <!-- Broker -->
            <div>
              <label for="acc-broker" class="block text-xs font-mono text-slate-300 mb-1">Nom du Courtier / Broker</label>
              <input 
                id="acc-broker"
                type="text" 
                formControlName="broker"
                placeholder="ex: Deriv Limited, IC Markets, FTMO..."
                class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
            </div>

            <!-- Server -->
            <div>
              <label for="acc-server" class="block text-xs font-mono text-slate-300 mb-1">Serveur MT5 Exact</label>
              <input 
                id="acc-server"
                type="text" 
                formControlName="server"
                placeholder="ex: Deriv-Demo, ICMarkets-Live02..."
                class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
            </div>

            <!-- Login -->
            <div>
              <label for="acc-login" class="block text-xs font-mono text-slate-300 mb-1">Identifiant Compte MT5 (Login)</label>
              <input 
                id="acc-login"
                type="text" 
                formControlName="login"
                placeholder="ex: 10894521"
                class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
            </div>

            <!-- Password with Toggle -->
            <div>
              <label for="acc-password" class="block text-xs font-mono text-slate-300 mb-1">Mot de Passe Trader</label>
              <div class="relative">
                <input 
                  id="acc-password"
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password"
                  placeholder="••••••••••••"
                  class="w-full pl-3 pr-10 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
                <button 
                  type="button"
                  (click)="toggleShowPassword()"
                  class="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                  aria-label="Afficher le mot de passe">
                  <span class="mat-icon text-base">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <!-- Account Type -->
            <div>
              <label for="acc-type" class="block text-xs font-mono text-slate-300 mb-1">Type d'Environnement</label>
              <select 
                id="acc-type"
                formControlName="accountType"
                class="w-full px-3 py-2 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500">
                <option value="DEMO">Démo / Sandbox (Recommandé pour débuter)</option>
                <option value="LIVE">Compte Réel / Prop Firm Challenge</option>
              </select>
            </div>

            <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
              <span class="mat-icon text-base">lock</span>
              <span>Chiffrement matériel AES-256 GCM. Zéro stockage en clair.</span>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button 
                type="button"
                (click)="openAddAccountModal.set(false)"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
                Annuler
              </button>
              <button 
                id="save-account-btn"
                type="submit"
                [disabled]="accountForm.invalid"
                class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20">
                Vérifier & Lier
              </button>
            </div>

          </form>

        </div>
      </div>
    }
  `
})
export class AccountsComponent implements OnInit {
  tradingAccountService = inject(TradingAccountService);
  authService = inject(AuthService);

  readonly openAddAccountModal = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly isSyncing = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly isSuperAdmin = computed(() => this.authService.currentUser()?.role === 'SUPER_ADMIN');
  readonly isExpired = computed(() => this.authService.currentUser()?.subscriptionStatus === 'EXPIRED');

  // Accounts list computed from TradingAccountService (or initial mock fallback if empty)
  readonly accounts = computed<MT5AccountExtended[]>(() => {
    const list = this.tradingAccountService.accounts();
    if (list && list.length > 0) {
      return list.map(a => ({
        id: a.id,
        broker: a.broker,
        server: a.server,
        login: a.login,
        accountType: a.accountType as 'DEMO' | 'LIVE',
        balance: a.balance || 10000,
        equity: a.equity || 10000,
        currency: a.currency || 'USD',
        leverage: a.leverage || '1:100',
        pingMs: 22,
        connected: a.connected,
        autoTradingEnabled: a.autoTradingEnabled,
        lastSyncTime: 'À l\'instant'
      }));
    }
    return INITIAL_ACCOUNTS;
  });

  readonly connectedAccountsCount = computed(() => this.accounts().filter(a => a.connected).length);
  
  readonly avgLatency = computed(() => {
    const list = this.accounts();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.pingMs, 0);
    return Math.round(sum / list.length);
  });

  readonly totalCapital = computed(() => {
    return this.accounts().reduce((acc, curr) => acc + curr.balance, 0);
  });

  readonly accountForm = new FormGroup({
    broker: new FormControl('', [Validators.required]),
    server: new FormControl('', [Validators.required]),
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    accountType: new FormControl<'DEMO' | 'LIVE'>('DEMO', [Validators.required])
  });

  ngOnInit(): void {
    this.tradingAccountService.fetchAccounts();
  }

  maskLogin(login: string): string {
    if (!login) return '';
    if (login.length <= 4) return login;
    return login.substring(0, 4) + '****';
  }

  toggleShowPassword() {
    this.showPassword.update(s => !s);
  }

  async toggleAutoTrading(id: string) {
    try {
      await this.tradingAccountService.toggleAutoTrading(id);
    } catch (e) {
      console.warn('[Accounts] Erreur lors du basculement auto-trading', e);
    }
  }

  testPing(id: string) {
    const jitter = Math.floor(15 + Math.random() * 18);
    // Simulation visuelle du test de latence
    const target = this.accounts().find(a => a.id === id);
    if (target) {
      target.pingMs = jitter;
    }
  }

  async syncBalance(id: string) {
    this.isSyncing.set(id);
    try {
      await this.tradingAccountService.syncAccount(id);
    } catch (e) {
      console.warn('[Accounts] Erreur synchronisation MT5', e);
    } finally {
      this.isSyncing.set(null);
    }
  }

  async removeAccount(id: string) {
    try {
      await this.tradingAccountService.deleteAccount(id);
    } catch (e) {
      console.warn('[Accounts] Erreur suppression compte', e);
    }
  }

  async submitNewAccount() {
    if (this.accountForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.accountForm.value;
    const plainPassword = val.password || '';

    try {
      // 1. Envoi au Credential Vault via l'API REST
      await this.tradingAccountService.createAccount({
        broker: val.broker || 'MetaQuotes Broker',
        server: val.server || 'Demo-Server-01',
        login: val.login || '12345678',
        password: plainPassword,
        accountType: val.accountType || 'DEMO'
      });

      // 2. Sécurité : Effacement immédiat du mot de passe de la mémoire
      this.accountForm.reset({ accountType: 'DEMO' });
      this.isSubmitting.set(false);
      this.openAddAccountModal.set(false);
    } catch (e: any) {
      this.isSubmitting.set(false);
      this.errorMessage.set(e.error?.message || 'Erreur lors de la liaison du compte broker');
    }
  }
}
