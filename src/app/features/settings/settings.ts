import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockUserStorageService } from '../../core/services/mock-user-storage.service';
import { 
  OnboardingService, 
  DEFAULT_FOREX_PAIRS, 
  OTHER_UPCOMING_INSTRUMENTS, 
  AUTOMATION_LEVELS 
} from '../../core/services/onboarding.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';
import { AutomationLevel } from '../../core/models/onboarding.model';
import { AutomationLevelCode, MockUserAccountRecord, MockUserPreferences } from '../../core/models/user-storage.model';

type SettingsTab = 'pairs' | 'risk' | 'accounts' | 'automation' | 'profile' | 'subscription';

interface BrokerOption {
  name: string;
  defaultServer: string;
}

const POPULAR_BROKERS: BrokerOption[] = [
  { name: 'Deriv MT5', defaultServer: 'Deriv-Demo' },
  { name: 'IC Markets', defaultServer: 'ICMarketsSC-Demo' },
  { name: 'Pepperstone', defaultServer: 'Pepperstone-Demo01' },
  { name: 'FTMO MT5', defaultServer: 'FTMO-Demo' },
  { name: 'Vantage Markets', defaultServer: 'VantageFX-Demo' },
  { name: 'XM Global', defaultServer: 'XMGlobal-Real' },
  { name: 'Autre Broker MT5', defaultServer: 'Custom-Server' }
];

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggleComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto text-left pb-16">
      
      <!-- ============================================================ -->
      <!-- 1. HEADER & SYNCHRONIZATION STATUS BAR                        -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span class="mat-icon text-2xl">settings</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Paramètres & Préférences Trader
              </h1>
              <p class="text-xs sm:text-sm text-slate-400 mt-0.5">
                Configuration de votre univers de trading, du moteur de risque et des passerelles MT5
              </p>
            </div>
          </div>
        </div>

        <!-- Quick DB sync badge & action buttons -->
        <div class="flex items-center flex-wrap gap-2.5">
          @if (hasUnsavedChanges()) {
            <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 animate-pulse">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              Modifications non enregistrées
            </span>
          } @else {
            <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Synchronisé avec la Base JSON
            </span>
          }

          <button 
            type="button" 
            (click)="resetDraftToSaved()"
            [disabled]="!hasUnsavedChanges()"
            class="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
            <span class="mat-icon text-[16px]">undo</span>
            <span>Annuler</span>
          </button>

          <button 
            type="button" 
            (click)="saveAllChanges()"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]">
            <span class="mat-icon text-[16px]">save</span>
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 2. SUCCESS TOAST ALERT                                        -->
      <!-- ============================================================ -->
      @if (toastMessage(); as toast) {
        <div class="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xl shadow-emerald-950/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div class="flex items-center gap-2.5">
            <span class="mat-icon text-emerald-400 text-xl flex-shrink-0">check_circle</span>
            <span class="font-medium">{{ toast }}</span>
          </div>
          <button 
            type="button" 
            (click)="toastMessage.set(null)"
            class="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors">
            <span class="mat-icon text-sm">close</span>
          </button>
        </div>
      }

      <!-- ============================================================ -->
      <!-- 3. NAVIGATION TABS                                            -->
      <!-- ============================================================ -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        @for (tab of tabs; track tab.id) {
          <button 
            type="button"
            (click)="setActiveTab(tab.id)"
            [class]="activeTab() === tab.id 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold shadow-sm' 
              : 'bg-[#101014] text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-[#15151c] font-medium'"
            class="px-4 py-2.5 rounded-xl border text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer">
            <span class="mat-icon text-[17px]">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            @if (tab.badge) {
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300 font-bold">
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>

      <!-- ============================================================ -->
      <!-- TAB 1: PAIRES & UNIVERS DE TRADING                            -->
      <!-- ============================================================ -->
      @if (activeTab() === 'pairs') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <!-- Tab Intro & Search / Actions Header -->
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800/90 space-y-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 class="text-base font-bold text-white flex items-center gap-2">
                  <span class="mat-icon text-emerald-400 text-lg">candlestick_chart</span>
                  <span>Univers d'actifs et Paires Autorisées</span>
                </h2>
                <p class="text-xs text-slate-400 mt-0.5">
                  Seuls les actifs sélectionnés feront l'objet d'analyses algorithmiques, de signaux d'entrée et d'affichage dans la Watchlist.
                </p>
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <button 
                  type="button" 
                  (click)="selectAllPairs()"
                  class="px-3 py-1.5 rounded-lg bg-[#15151b] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Tout sélectionner
                </button>
                <button 
                  type="button" 
                  (click)="selectDefaultPairs()"
                  class="px-3 py-1.5 rounded-lg bg-[#15151b] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                  Sélection par défaut (Forex)
                </button>
                <button 
                  type="button" 
                  (click)="clearAllPairs()"
                  class="px-3 py-1.5 rounded-lg bg-[#15151b] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
                  Désélectionner tout
                </button>
              </div>
            </div>

            <!-- Search Bar & Counter -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div class="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  [value]="pairSearchQuery()"
                  (input)="onPairSearch($event)"
                  placeholder="Rechercher par symbole (ex: EUR, XAU, BTC)..."
                  class="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-[#14141a] text-white placeholder-slate-500 border border-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 font-mono"
                />
                <span class="mat-icon text-slate-400 text-sm absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
              </div>

              <div class="text-xs font-mono text-slate-300 flex items-center gap-2">
                <span>Total sélectionné :</span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                  {{ draftSelectedPairs().length }} instrument(s)
                </span>
              </div>
            </div>

            @if (draftSelectedPairs().length === 0) {
              <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span class="mat-icon text-sm">warning</span>
                <span>Attention : Au moins un instrument doit rester sélectionné pour alimenter le Dashboard et le moteur de signaux.</span>
              </div>
            }
          </div>

          <!-- Forex Pairs Grid -->
          <div class="space-y-3">
            <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Paires Forex Principales ({{ filteredForexPairs().length }})</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              @for (pair of filteredForexPairs(); track pair.symbol) {
                <button
                  type="button"
                  (click)="togglePair(pair.symbol)"
                  class="p-4 rounded-xl border text-left transition-all duration-150 relative overflow-hidden flex flex-col justify-between cursor-pointer"
                  [class]="isPairSelected(pair.symbol) 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm' 
                    : 'bg-[#0f0f14] border-slate-800 hover:border-slate-700'">
                  
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-base font-extrabold text-white font-mono tracking-tight">{{ pair.symbol }}</span>
                        <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                          {{ pair.category }}
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-0.5">{{ pair.name }}</div>
                    </div>

                    <!-- Checkbox -->
                    <div 
                      class="w-5 h-5 rounded-md flex items-center justify-center transition-colors"
                      [class]="isPairSelected(pair.symbol) ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-800 text-slate-500'">
                      @if (isPairSelected(pair.symbol)) {
                        <span class="mat-icon text-sm">check</span>
                      }
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span class="truncate max-w-[170px]">{{ pair.description }}</span>
                    <span class="text-emerald-400 font-bold">{{ pair.spreadAvgPips }} pips</span>
                  </div>
                </button>
              }
            </div>
          </div>

          <!-- Other Assets Grid -->
          <div class="space-y-3 pt-2">
            <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>Extensions d'actifs (Métaux, Indices & Crypto) ({{ filteredOtherInstruments().length }})</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              @for (inst of filteredOtherInstruments(); track inst.symbol) {
                <button
                  type="button"
                  (click)="togglePair(inst.symbol)"
                  class="p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer"
                  [class]="isPairSelected(inst.symbol) 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm' 
                    : 'bg-[#0f0f14] border-slate-800 hover:border-slate-700'">
                  
                  <div class="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span class="text-sm font-extrabold text-white font-mono">{{ inst.symbol }}</span>
                      <span class="ml-1.5 text-[9px] uppercase font-mono px-1 py-0.2 bg-slate-800 text-cyan-300 rounded">
                        {{ inst.type }}
                      </span>
                    </div>
                    <div 
                      class="w-4 h-4 rounded flex items-center justify-center transition-colors"
                      [class]="isPairSelected(inst.symbol) ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-800 text-slate-500'">
                      @if (isPairSelected(inst.symbol)) {
                        <span class="mat-icon text-xs">check</span>
                      }
                    </div>
                  </div>

                  <div class="text-[10px] text-slate-400 truncate">{{ inst.name }}</div>
                  <div class="text-[9px] font-mono text-emerald-400 mt-2 flex items-center justify-between">
                    <span>Spread</span>
                    <span class="font-bold">{{ inst.spreadAvg }}</span>
                  </div>
                </button>
              }
            </div>
          </div>

        </div>
      }

      <!-- ============================================================ -->
      <!-- TAB 2: MOTEUR DE RISQUE (RISK ENGINE)                         -->
      <!-- ============================================================ -->
      @if (activeTab() === 'risk') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-6">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <span class="mat-icon text-cyan-400 text-lg">shield</span>
                <span>Paramétrage Strict du Risk Engine</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Ces règles sont appliquées en amont de toute prise de position et protègent votre capital contre les drawdowns excessifs.
              </p>
            </div>

            <!-- 4 Numeric Rules Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Risque max par trade -->
              <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">1. Risque Max par Trade :</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-sm">
                    {{ draftRiskRules().riskPerTradePercent }}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.25" 
                  max="2.0" 
                  step="0.25"
                  [value]="draftRiskRules().riskPerTradePercent"
                  (input)="updateRiskRule('riskPerTradePercent', $event)"
                  class="w-full accent-emerald-500 cursor-pointer"
                />
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Conservateur: 0.25%</span>
                  <span>Défaut: 1.0%</span>
                  <span>Plafond: 2.0%</span>
                </div>
              </div>

              <!-- 2. Perte maximale quotidienne -->
              <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">2. Perte Maximale Journalière (Daily Loss) :</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-400 font-mono font-bold text-sm">
                    {{ draftRiskRules().maxDailyLossPercent }}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="5.0" 
                  step="0.5"
                  [value]="draftRiskRules().maxDailyLossPercent"
                  (input)="updateRiskRule('maxDailyLossPercent', $event)"
                  class="w-full accent-rose-500 cursor-pointer"
                />
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Prudent: 1.0%</span>
                  <span>Prop Firm Limit: 3.0%</span>
                  <span>Max: 5.0%</span>
                </div>
              </div>

              <!-- 3. Positions simultanées max -->
              <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">3. Nombre Maximal de Positions Simultanées :</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold text-sm">
                    {{ draftRiskRules().maxOpenPositions }}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1"
                  [value]="draftRiskRules().maxOpenPositions"
                  (input)="updateRiskRule('maxOpenPositions', $event)"
                  class="w-full accent-indigo-500 cursor-pointer"
                />
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>1 trade</span>
                  <span>3 trades (Optimal)</span>
                  <span>5 trades max</span>
                </div>
              </div>

              <!-- 4. Exposition globale cumulée -->
              <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">4. Exposition Globale Cumulée (Cap) :</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-sm">
                    {{ draftRiskRules().maxExposurePercent }}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="2.0" 
                  max="8.0" 
                  step="0.5"
                  [value]="draftRiskRules().maxExposurePercent"
                  (input)="updateRiskRule('maxExposurePercent', $event)"
                  class="w-full accent-cyan-500 cursor-pointer"
                />
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>2.0%</span>
                  <span>4.0% (Standard)</span>
                  <span>8.0% max</span>
                </div>
              </div>

            </div>

            <!-- Filters Switches -->
            <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 space-y-4">
              <span class="text-xs font-bold text-white uppercase tracking-wider block">
                Filtres Avancés de Protection de Marché
              </span>

              <div class="space-y-3">
                <label for="filter-news" class="flex items-center justify-between p-3 rounded-lg bg-[#16161d] border border-slate-800/80 cursor-pointer hover:border-slate-700">
                  <div class="space-y-0.5">
                    <div class="text-xs font-semibold text-white flex items-center gap-2">
                      <span class="mat-icon text-amber-400 text-sm">event_busy</span>
                      <span>Protection Volatilité News (High Impact)</span>
                    </div>
                    <div class="text-[11px] text-slate-400">
                      Suspend automatiquement toute ouverture 15 min avant et après les publications majeures (CPI, NFP, Taux BCE/Fed).
                    </div>
                  </div>
                  <input 
                    id="filter-news"
                    type="checkbox" 
                    [checked]="draftRiskRules().newsFilterActive"
                    (change)="toggleNewsFilter($event)"
                    class="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label for="filter-weekend" class="flex items-center justify-between p-3 rounded-lg bg-[#16161d] border border-slate-800/80 cursor-pointer hover:border-slate-700">
                  <div class="space-y-0.5">
                    <div class="text-xs font-semibold text-white flex items-center gap-2">
                      <span class="mat-icon text-cyan-400 text-sm">nightlight</span>
                      <span>Verrouillage Week-end & Hors Sessions Liquidité</span>
                    </div>
                    <div class="text-[11px] text-slate-400">
                      Bloque les prises de position le vendredi soir et avant l'ouverture de la session asiatique.
                    </div>
                  </div>
                  <input 
                    id="filter-weekend"
                    type="checkbox" 
                    [checked]="draftRiskRules().weekendLockActive"
                    (change)="toggleWeekendLock($event)"
                    class="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <!-- Platform Hard Rules Guarantee -->
            <div class="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-start gap-3">
              <span class="mat-icon text-cyan-400 text-lg flex-shrink-0">verified_user</span>
              <div>
                <strong class="text-white block">Garantie Hard Stop & Conformité Prop Firm :</strong>
                <span>Les règles utilisateur ne peuvent jamais dépasser les limites strictes de la plateforme. Tout ordre dépassant l'exposition autorisée est automatiquement rejeté par le Risk Engine.</span>
              </div>
            </div>

          </div>

        </div>
      }

      <!-- ============================================================ -->
      <!-- TAB 3: COMPTES MT5 & PASSERELLES                              -->
      <!-- ============================================================ -->
      @if (activeTab() === 'accounts') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-base font-bold text-white flex items-center gap-2">
                  <span class="mat-icon text-indigo-400 text-lg">account_balance</span>
                  <span>Passerelles & Comptes MT5 Connectés</span>
                </h2>
                <p class="text-xs text-slate-400 mt-0.5">
                  Gestion des identifiants broker, passerelles de test et statut d'autorisation de trading.
                </p>
              </div>

              <button 
                type="button" 
                (click)="openAddAccountModal()"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer">
                <span class="mat-icon text-base">add</span>
                <span>Connecter un nouveau compte MT5</span>
              </button>
            </div>

            <!-- Accounts List -->
            <div class="space-y-3 pt-2">
              @for (acc of draftAccounts(); track acc.id) {
                <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-mono font-bold text-sm">
                      MT5
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-white">{{ acc.broker }}</span>
                        <span 
                          class="px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase"
                          [class]="acc.environment === 'DEMO' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'">
                          {{ acc.environment }}
                        </span>
                        <span class="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          CONNECTÉ
                        </span>
                      </div>
                      <div class="text-xs font-mono text-slate-400 mt-0.5">
                        Compte #{{ acc.accountNumber }} &bull; Serveur: {{ acc.server }}
                      </div>
                    </div>
                  </div>

                  <!-- Controls for this account -->
                  <div class="flex items-center flex-wrap gap-3">
                    
                    <!-- Automation toggle switch -->
                    <label [attr.for]="'acc-trading-' + acc.id" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16161e] border border-slate-800 cursor-pointer text-xs">
                      <span class="text-slate-300 font-medium">Automatisation :</span>
                      <input 
                        [id]="'acc-trading-' + acc.id"
                        type="checkbox" 
                        [checked]="acc.tradingEnabled"
                        (change)="toggleAccountTrading(acc.id, $event)"
                        class="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <span [class]="acc.tradingEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'">
                        {{ acc.tradingEnabled ? 'ACTIVE' : 'DÉSACTIVÉE' }}
                      </span>
                    </label>

                    <!-- Ping Latency Button -->
                    <button 
                      type="button" 
                      (click)="testAccountPing(acc.id)"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                      <span class="mat-icon text-sm text-cyan-400">network_check</span>
                      @if (accountPingResult()[acc.id]; as ping) {
                        <span class="text-emerald-400 font-bold">{{ ping }}</span>
                      } @else {
                        <span>Tester Ping</span>
                      }
                    </button>

                    <!-- Delete / Unlink Button -->
                    <button 
                      type="button" 
                      (click)="removeAccount(acc.id)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Dissocier ce compte">
                      <span class="mat-icon text-lg">delete</span>
                    </button>

                  </div>

                </div>
              }

              @if (draftAccounts().length === 0) {
                <div class="p-8 rounded-xl bg-[#121217] border border-dashed border-slate-800 text-center space-y-2">
                  <div class="mat-icon text-3xl text-slate-500">account_balance</div>
                  <div class="text-sm font-bold text-white">Aucun compte MT5 associé</div>
                  <div class="text-xs text-slate-400">Cliquez sur le bouton ci-dessus pour connecter votre premier compte broker.</div>
                </div>
              }
            </div>

          </div>

        </div>
      }

      <!-- ============================================================ -->
      <!-- TAB 4: AUTOMATISATION & EXÉCUTION                             -->
      <!-- ============================================================ -->
      @if (activeTab() === 'automation') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-6">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <span class="mat-icon text-emerald-400 text-lg">psychology</span>
                <span>Niveau d'Automatisation & Règles d'Exécution</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Déterminez le degré d'autonomie accordé aux algorithmes d'analyse et aux déclencheurs d'ordres.
              </p>
            </div>

            <!-- Automation Levels Radio Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              @for (lvl of automationLevels; track lvl.level) {
                <button 
                  type="button"
                  (click)="setAutomationLevel(lvl.level)"
                  class="p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer"
                  [class]="draftAutomationLevel() === lvl.level 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md' 
                    : 'bg-[#121217] border-slate-800 hover:border-slate-700'">
                  
                  <div class="space-y-2 mb-3">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-emerald-300">
                        {{ lvl.badge }}
                      </span>
                      <div 
                        class="w-4 h-4 rounded-full border flex items-center justify-center"
                        [class]="draftAutomationLevel() === lvl.level ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'">
                        @if (draftAutomationLevel() === lvl.level) {
                          <div class="w-1.5 h-1.5 rounded-full bg-black"></div>
                        }
                      </div>
                    </div>
                    <div class="text-sm font-bold text-white">{{ lvl.title }}</div>
                    <p class="text-[11px] text-slate-400 leading-relaxed">{{ lvl.description }}</p>
                  </div>

                  <div class="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                    Mode : {{ lvl.executionMode }}
                  </div>
                </button>
              }
            </div>

            <!-- Manual Confirmation Switch & Max Daily Trades -->
            <div class="p-5 rounded-xl bg-[#121217] border border-slate-800 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div class="space-y-0.5 max-w-xl">
                  <div class="text-xs font-bold text-white flex items-center gap-2">
                    <span class="mat-icon text-amber-400 text-sm">touch_app</span>
                    <span>Confirmation Manuelle Obligatoire Avant Exécution</span>
                  </div>
                  <p class="text-[11px] text-slate-400">
                    Si activé, chaque opportunité détectée reste en attente de validation avec un compte à rebours avant d'être envoyée à MT5.
                  </p>
                </div>
                
                <label for="manual-confirmation-toggle" class="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="manual-confirmation-toggle"
                    type="checkbox" 
                    [checked]="draftManualConfirmation()"
                    (change)="toggleManualConfirmation($event)"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <!-- Max Daily Trades -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-white">Plafond de trades exécutés par jour :</div>
                  <div class="text-[11px] text-slate-400">Limite maximale pour éviter tout risque de sur-trading (Over-trading protection).</div>
                </div>
                
                <div class="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="1"
                    [value]="draftMaxDailyTrades()"
                    (input)="updateMaxDailyTrades($event)"
                    class="w-32 accent-emerald-500 cursor-pointer"
                  />
                  <span class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                    {{ draftMaxDailyTrades() }} trades / jour
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      }

      <!-- ============================================================ -->
      <!-- TAB 5: PROFIL & SÉCURITÉ                                      -->
      <!-- ============================================================ -->
      @if (activeTab() === 'profile') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <!-- Personal Info Card -->
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-lg">person</span>
              <span>Informations Personnelles du Trader</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="profile-first-name" class="text-xs font-bold text-slate-300">Prénom :</label>
                <input 
                  id="profile-first-name"
                  type="text" 
                  [value]="profileFirstName()"
                  (input)="profileFirstName.set($any($event.target).value)"
                  class="w-full px-3.5 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div class="space-y-1.5">
                <label for="profile-last-name" class="text-xs font-bold text-slate-300">Nom :</label>
                <input 
                  id="profile-last-name"
                  type="text" 
                  [value]="profileLastName()"
                  (input)="profileLastName.set($any($event.target).value)"
                  class="w-full px-3.5 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div class="space-y-1.5 sm:col-span-2">
                <label for="profile-email-addr" class="text-xs font-bold text-slate-300">Adresse E-mail :</label>
                <input 
                  id="profile-email-addr"
                  type="email" 
                  [value]="profileEmail()"
                  (input)="profileEmail.set($any($event.target).value)"
                  class="w-full px-3.5 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Password Change Card -->
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span class="mat-icon text-cyan-400 text-lg">lock</span>
              <span>Changer le mot de passe</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label for="pwd-old" class="text-xs font-bold text-slate-300">Ancien mot de passe :</label>
                <input 
                  id="pwd-old"
                  type="password" 
                  [value]="oldPassword()"
                  (input)="oldPassword.set($any($event.target).value)"
                  placeholder="••••••••"
                  class="w-full px-3.5 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div class="space-y-1.5">
                <label for="pwd-new" class="text-xs font-bold text-slate-300">Nouveau mot de passe :</label>
                <input 
                  id="pwd-new"
                  type="password" 
                  [value]="newPassword()"
                  (input)="newPassword.set($any($event.target).value)"
                  placeholder="Min. 8 caractères"
                  class="w-full px-3.5 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div class="space-y-1.5">
                <label for="pwd-confirm" class="text-xs font-bold text-slate-300">Confirmation :</label>
                <input 
                  id="pwd-confirm"
                  type="password" 
                  [value]="confirmPassword()"
                  (input)="confirmPassword.set($any($event.target).value)"
                  placeholder="Min. 8 caractères"
                  class="w-full px-3.5 py-2 rounded-xl bg-[#141419] border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            @if (passwordFeedback(); as fb) {
              <div 
                class="p-3 rounded-xl text-xs flex items-center gap-2"
                [class]="fb.isError ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'">
                <span class="mat-icon text-sm">{{ fb.isError ? 'error' : 'check_circle' }}</span>
                <span>{{ fb.message }}</span>
              </div>
            }

            <div class="flex justify-end pt-2">
              <button 
                type="button" 
                (click)="handleUpdatePassword()"
                class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer">
                Mettre à jour le mot de passe
              </button>
            </div>
          </div>

          <!-- Sessions Management Card -->
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span class="mat-icon text-amber-400 text-lg">devices</span>
              <span>Gestion des Sessions Actives</span>
            </h2>

            <div class="p-4 rounded-xl bg-[#121217] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                  <span class="mat-icon text-lg">laptop_mac</span>
                </div>
                <div>
                  <div class="text-xs font-bold text-white flex items-center gap-2">
                    <span>Navigateur Web Actuel</span>
                    <span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400">SESSION COURANTE</span>
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5">
                    IP: 192.168.1.42 &bull; Dernière activité: À l'instant
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                (click)="disconnectOtherSessions()"
                class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer">
                Déconnecter toutes les autres sessions
              </button>
            </div>
          </div>

          <!-- App Theme & Appearance -->
          <div class="p-6 rounded-2xl bg-[#0d0d12] border border-slate-800 space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span class="mat-icon text-emerald-400 text-lg">palette</span>
              <span>Apparence & Thème Visuel</span>
            </h2>

            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-bold text-white">Mode d'affichage</div>
                <div class="text-xs text-slate-400">Basculer entre le mode sombre FinTech et le mode clair haute lisibilité.</div>
              </div>
              <app-theme-toggle></app-theme-toggle>
            </div>
          </div>

        </div>
      }

      <!-- ============================================================ -->
      <!-- TAB 6: ABONNEMENT & QUOTAS PRO                                -->
      <!-- ============================================================ -->
      @if (activeTab() === 'subscription') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <!-- Plan Status Card -->
          <div class="p-6 rounded-2xl bg-gradient-to-br from-[#0e0e15] to-[#141420] border border-emerald-500/30 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase">
                    Licence Active
                  </span>
                  <h2 class="text-xl font-bold text-white">Essai Gratuit Pro Trader</h2>
                </div>
                <p class="text-xs text-slate-400">
                  Accès complet aux modèles d'intelligence de marché, passerelles MT5 et risk engine institutionnel.
                </p>
              </div>

              <button 
                type="button" 
                (click)="openUpgradeModal()"
                class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2 cursor-pointer hover:scale-105">
                <span class="mat-icon text-[17px]">star</span>
                <span>Passer au Forfait Pro Annuel</span>
              </button>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-2 p-4 rounded-xl bg-[#09090d]/80 border border-slate-800">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300 font-medium">Validité de la période d'essai :</span>
                <span class="text-emerald-400 font-bold font-mono">15 jours restants / 30 jours</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[50%] rounded-full"></div>
              </div>
            </div>

            <!-- Quotas Comparison Table -->
            <div class="space-y-3">
              <span class="text-xs font-bold text-white uppercase tracking-wider block">
                Quotas & Capacités Incluses
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-[#121217] border border-slate-800 space-y-1">
                  <div class="text-slate-400 text-[11px]">Passerelles MT5 connectées</div>
                  <div class="text-white font-bold text-sm font-mono">{{ draftAccounts().length }} / 5 comptes</div>
                </div>

                <div class="p-3.5 rounded-xl bg-[#121217] border border-slate-800 space-y-1">
                  <div class="text-slate-400 text-[11px]">Instruments autorisés</div>
                  <div class="text-white font-bold text-sm font-mono">{{ draftSelectedPairs().length }} / 20 actifs</div>
                </div>

                <div class="p-3.5 rounded-xl bg-[#121217] border border-slate-800 space-y-1">
                  <div class="text-slate-400 text-[11px]">Moteur d'analyse IA & Deep Intel</div>
                  <div class="text-emerald-400 font-bold text-sm font-mono">Illimité (Pro)</div>
                </div>

                <div class="p-3.5 rounded-xl bg-[#121217] border border-slate-800 space-y-1">
                  <div class="text-slate-400 text-[11px]">Latence moyenne de routage</div>
                  <div class="text-cyan-400 font-bold text-sm font-mono">&lt; 20 ms Ultra-Fast</div>
                </div>

                <div class="p-3.5 rounded-xl bg-[#121217] border border-slate-800 space-y-1">
                  <div class="text-slate-400 text-[11px]">Coupe-circuit d'urgence</div>
                  <div class="text-emerald-400 font-bold text-sm font-mono">Garantie 0ms</div>
                </div>

                <div class="p-3.5 rounded-xl bg-[#121217] border border-slate-800 space-y-1">
                  <div class="text-slate-400 text-[11px]">Calendrier Macro Institutional</div>
                  <div class="text-white font-bold text-sm font-mono">Flux Temps Réel</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      }

      <!-- ============================================================ -->
      <!-- MODAL: AJOUTER UN COMPTE MT5                                 -->
      <!-- ============================================================ -->
      @if (showAddAccountModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div class="relative bg-[#0e0e13] border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-md w-full text-left shadow-2xl shadow-black/90 space-y-4">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <span class="mat-icon text-lg">account_balance</span>
                </div>
                <h3 class="text-base font-bold text-white">Connecter un compte MT5</h3>
              </div>
              <button 
                type="button" 
                (click)="closeAddAccountModal()"
                class="text-slate-400 hover:text-white">
                <span class="mat-icon text-lg">close</span>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="space-y-1">
                <label for="modal-broker" class="font-bold text-slate-300">Broker / Courtier :</label>
                <select 
                  id="modal-broker"
                  [value]="newAccountBroker()"
                  (change)="onBrokerSelectChange($event)"
                  class="w-full px-3 py-2 rounded-xl bg-[#15151b] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-mono">
                  @for (b of popularBrokers; track b.name) {
                    <option [value]="b.name">{{ b.name }}</option>
                  }
                </select>
              </div>

              <div class="space-y-1">
                <label for="modal-server" class="font-bold text-slate-300">Serveur MT5 :</label>
                <input 
                  id="modal-server"
                  type="text" 
                  [value]="newAccountServer()"
                  (input)="newAccountServer.set($any($event.target).value)"
                  placeholder="ex: Deriv-Demo"
                  class="w-full px-3 py-2 rounded-xl bg-[#15151b] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div class="space-y-1">
                <label for="modal-acc-num" class="font-bold text-slate-300">Numéro de compte (Login) :</label>
                <input 
                  id="modal-acc-num"
                  type="text" 
                  [value]="newAccountNumber()"
                  (input)="newAccountNumber.set($any($event.target).value)"
                  placeholder="ex: 5092184"
                  class="w-full px-3 py-2 rounded-xl bg-[#15151b] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div class="space-y-1">
                <label for="modal-pwd" class="font-bold text-slate-300">Mot de passe Trader MT5 :</label>
                <input 
                  id="modal-pwd"
                  type="password" 
                  [value]="newAccountPassword()"
                  (input)="newAccountPassword.set($any($event.target).value)"
                  placeholder="••••••••••••"
                  class="w-full px-3 py-2 rounded-xl bg-[#15151b] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div class="space-y-1">
                <span class="block font-bold text-slate-300">Environnement :</span>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    (click)="newAccountEnv.set('DEMO')"
                    [class]="newAccountEnv() === 'DEMO' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' : 'bg-[#15151b] text-slate-400 border-slate-800'"
                    class="p-2 rounded-xl border text-xs text-center cursor-pointer transition-colors">
                    DÉMO (Sandbox)
                  </button>
                  <button 
                    type="button"
                    (click)="newAccountEnv.set('LIVE')"
                    [class]="newAccountEnv() === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' : 'bg-[#15151b] text-slate-400 border-slate-800'"
                    class="p-2 rounded-xl border text-xs text-center cursor-pointer transition-colors">
                    RÉEL (Live)
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                type="button" 
                (click)="closeAddAccountModal()"
                class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
                Annuler
              </button>
              <button 
                type="button" 
                (click)="confirmAddAccount()"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md">
                Connecter la passerelle
              </button>
            </div>

          </div>
        </div>
      }

      <!-- ============================================================ -->
      <!-- MODAL: UPGRADE PRO                                            -->
      <!-- ============================================================ -->
      @if (showUpgradeModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div class="relative bg-[#0e0e13] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full text-left shadow-2xl shadow-emerald-950/40 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <div class="flex items-center gap-2">
                <span class="mat-icon text-emerald-400 text-xl">workspace_premium</span>
                <h3 class="text-base font-bold text-white">Adhérer au Forfait Pro</h3>
              </div>
              <button type="button" (click)="showUpgradeModal.set(false)" class="text-slate-400 hover:text-white">
                <span class="mat-icon text-lg">close</span>
              </button>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed">
              Passez à la version Pro permanente avec jusqu'à 5 comptes connectés, routage ultra-faible latence et analyses institutionnelles illimitées.
            </p>

            <div class="p-4 rounded-xl bg-[#141419] border border-slate-800 space-y-2 text-xs">
              <div class="flex justify-between items-center text-white font-bold">
                <span>Forfait Pro Annuel (2 mois offerts)</span>
                <span class="text-emerald-400 font-mono text-sm">39 € / mois</span>
              </div>
              <div class="text-[11px] text-slate-400">&bull; Facturation annuelle de 468 €</div>
              <div class="text-[11px] text-slate-400">&bull; Garantie satisfait ou remboursé 14 jours</div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                (click)="showUpgradeModal.set(false)"
                class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Fermer
              </button>
              <button 
                type="button" 
                (click)="confirmUpgrade()"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40">
                Confirmer l'adhésion
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class SettingsComponent implements OnInit {
  authService = inject(AuthService);
  userStorage = inject(MockUserStorageService);
  onboardingService = inject(OnboardingService);
  dashboardService = inject(DashboardService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Active Tab
  activeTab = signal<SettingsTab>('pairs');

  // Available Forex Pairs and Instruments
  forexPairs = DEFAULT_FOREX_PAIRS;
  otherInstruments = OTHER_UPCOMING_INSTRUMENTS;
  automationLevels = AUTOMATION_LEVELS;
  popularBrokers = POPULAR_BROKERS;

  // Search queries
  pairSearchQuery = signal<string>('');

  // Draft state (signals)
  draftSelectedPairs = signal<string[]>([]);
  draftRiskRules = signal({
    riskPerTradePercent: 1.0,
    maxDailyLossPercent: 3.0,
    maxOpenPositions: 3,
    maxExposurePercent: 4.0,
    newsFilterActive: true,
    weekendLockActive: false
  });
  draftAccounts = signal<MockUserAccountRecord[]>([]);
  draftAutomationLevel = signal<AutomationLevel>(2);
  draftManualConfirmation = signal<boolean>(true);
  draftMaxDailyTrades = signal<number>(4);

  // Profile fields
  profileFirstName = signal<string>('');
  profileLastName = signal<string>('');
  profileEmail = signal<string>('');

  // Password fields
  oldPassword = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  passwordFeedback = signal<{ message: string; isError: boolean } | null>(null);

  // Ping Latency state
  accountPingResult = signal<Record<string, string>>({});

  // Modals & Feedback
  showAddAccountModal = signal<boolean>(false);
  showUpgradeModal = signal<boolean>(false);
  toastMessage = signal<string | null>(null);

  // New Account Form State
  newAccountBroker = signal<string>('Deriv MT5');
  newAccountServer = signal<string>('Deriv-Demo');
  newAccountNumber = signal<string>('');
  newAccountPassword = signal<string>('');
  newAccountEnv = signal<'DEMO' | 'LIVE'>('DEMO');

  // Tabs navigation definition
  tabs = [
    { id: 'pairs' as SettingsTab, label: 'Paires & Univers de Trading', icon: 'candlestick_chart' },
    { id: 'risk' as SettingsTab, label: 'Moteur de Risque', icon: 'shield' },
    { id: 'accounts' as SettingsTab, label: 'Comptes MT5', icon: 'account_balance' },
    { id: 'automation' as SettingsTab, label: 'Automatisation', icon: 'psychology' },
    { id: 'profile' as SettingsTab, label: 'Profil & Sécurité', icon: 'person' },
    { id: 'subscription' as SettingsTab, label: 'Abonnement & Quotas', icon: 'credit_card', badge: 'PRO' }
  ];

  // Computed properties
  currentUser = computed(() => this.userStorage.currentUser());

  filteredForexPairs = computed(() => {
    const q = this.pairSearchQuery().toLowerCase().trim();
    if (!q) return this.forexPairs;
    return this.forexPairs.filter(p => 
      p.symbol.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
  });

  filteredOtherInstruments = computed(() => {
    const q = this.pairSearchQuery().toLowerCase().trim();
    if (!q) return this.otherInstruments;
    return this.otherInstruments.filter(i => 
      i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)
    );
  });

  hasUnsavedChanges = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tabParam = params.get('tab') as SettingsTab | null;
      if (tabParam && ['pairs', 'risk', 'accounts', 'automation', 'profile', 'subscription'].includes(tabParam)) {
        this.activeTab.set(tabParam);
      }
    });
    this.loadFromStorage();
  }

  loadFromStorage() {
    const user = this.userStorage.getActiveUser();
    if (!user) return;

    const prefs = user.preferences;
    this.profileFirstName.set(user.firstName || '');
    this.profileLastName.set(user.lastName || '');
    this.profileEmail.set(user.email || '');

    if (prefs) {
      this.draftSelectedPairs.set([...(prefs.selectedPairs || ['EUR/USD', 'GBP/USD', 'USD/JPY'])]);
      
      this.draftRiskRules.set({
        riskPerTradePercent: prefs.riskRules?.riskPerTradePercent ?? 1.0,
        maxDailyLossPercent: prefs.riskRules?.maxDailyLossPercent ?? 3.0,
        maxOpenPositions: prefs.riskRules?.maxOpenPositions ?? 3,
        maxExposurePercent: prefs.riskRules?.maxExposurePercent ?? 4.0,
        newsFilterActive: prefs.riskRules?.newsFilterActive ?? true,
        weekendLockActive: prefs.riskRules?.weekendLockActive ?? false
      });

      this.draftAccounts.set(prefs.tradingAccounts ? [...prefs.tradingAccounts] : []);

      let lvl: AutomationLevel = 2;
      if (prefs.automation?.level === 'ANALYSIS') lvl = 1;
      else if (prefs.automation?.level === 'SIGNALS') lvl = 2;
      else if (prefs.automation?.level === 'PAPER_TRADING') lvl = 3;
      else if (prefs.automation?.level === 'DEMO_AUTO') lvl = 4;
      else if (prefs.automation?.level === 'LIVE_AUTO') lvl = 5;

      this.draftAutomationLevel.set(lvl);
      this.draftManualConfirmation.set(prefs.automation?.manualConfirmation ?? true);
      this.draftMaxDailyTrades.set(prefs.automation?.maxDailyTrades ?? 4);
    }

    this.hasUnsavedChanges.set(false);
  }

  setActiveTab(tab: SettingsTab) {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  onPairSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.pairSearchQuery.set(target?.value || '');
  }

  isPairSelected(symbol: string): boolean {
    return this.draftSelectedPairs().includes(symbol);
  }

  togglePair(symbol: string) {
    this.draftSelectedPairs.update(current => {
      const exists = current.includes(symbol);
      const updated = exists ? current.filter(s => s !== symbol) : [...current, symbol];
      return updated;
    });
    this.hasUnsavedChanges.set(true);
  }

  selectAllPairs() {
    const all = [
      ...this.forexPairs.map(p => p.symbol),
      ...this.otherInstruments.map(i => i.symbol)
    ];
    this.draftSelectedPairs.set(Array.from(new Set(all)));
    this.hasUnsavedChanges.set(true);
  }

  selectDefaultPairs() {
    this.draftSelectedPairs.set(['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD', 'AUD/USD']);
    this.hasUnsavedChanges.set(true);
  }

  clearAllPairs() {
    this.draftSelectedPairs.set([]);
    this.hasUnsavedChanges.set(true);
  }

  updateRiskRule(field: 'riskPerTradePercent' | 'maxDailyLossPercent' | 'maxOpenPositions' | 'maxExposurePercent', event: Event) {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target?.value || '0');
    this.draftRiskRules.update(r => ({
      ...r,
      [field]: val
    }));
    this.hasUnsavedChanges.set(true);
  }

  toggleNewsFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.draftRiskRules.update(r => ({ ...r, newsFilterActive: target.checked }));
    this.hasUnsavedChanges.set(true);
  }

  toggleWeekendLock(event: Event) {
    const target = event.target as HTMLInputElement;
    this.draftRiskRules.update(r => ({ ...r, weekendLockActive: target.checked }));
    this.hasUnsavedChanges.set(true);
  }

  toggleAccountTrading(accountId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.draftAccounts.update(accs => 
      accs.map(a => a.id === accountId ? { ...a, tradingEnabled: target.checked } : a)
    );
    this.hasUnsavedChanges.set(true);
  }

  removeAccount(accountId: string) {
    this.draftAccounts.update(accs => accs.filter(a => a.id !== accountId));
    this.hasUnsavedChanges.set(true);
  }

  testAccountPing(accountId: string) {
    // Generate realistic low latency
    const pingMs = Math.floor(Math.random() * 12) + 12; // 12-24ms
    this.accountPingResult.update(map => ({
      ...map,
      [accountId]: `${pingMs} ms (Optimal)`
    }));
  }

  setAutomationLevel(lvl: AutomationLevel) {
    this.draftAutomationLevel.set(lvl);
    this.hasUnsavedChanges.set(true);
  }

  toggleManualConfirmation(event: Event) {
    const target = event.target as HTMLInputElement;
    this.draftManualConfirmation.set(target.checked);
    this.hasUnsavedChanges.set(true);
  }

  updateMaxDailyTrades(event: Event) {
    const target = event.target as HTMLInputElement;
    this.draftMaxDailyTrades.set(parseInt(target.value, 10) || 4);
    this.hasUnsavedChanges.set(true);
  }

  openAddAccountModal() {
    this.newAccountNumber.set('');
    this.newAccountPassword.set('');
    this.showAddAccountModal.set(true);
  }

  closeAddAccountModal() {
    this.showAddAccountModal.set(false);
  }

  onBrokerSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const found = this.popularBrokers.find(b => b.name === target.value);
    this.newAccountBroker.set(target.value);
    if (found) {
      this.newAccountServer.set(found.defaultServer);
    }
  }

  confirmAddAccount() {
    const accNum = this.newAccountNumber().trim() || Math.floor(1000000 + Math.random() * 9000000).toString();
    const newAcc: MockUserAccountRecord = {
      id: 'acc_' + Date.now(),
      broker: this.newAccountBroker(),
      server: this.newAccountServer() || 'DemoServer-01',
      accountNumber: accNum,
      environment: this.newAccountEnv(),
      tradingEnabled: true
    };

    this.draftAccounts.update(accs => [...accs, newAcc]);
    this.hasUnsavedChanges.set(true);
    this.closeAddAccountModal();
  }

  handleUpdatePassword() {
    const oldP = this.oldPassword();
    const newP = this.newPassword();
    const confP = this.confirmPassword();

    if (!oldP || !newP || !confP) {
      this.passwordFeedback.set({ message: 'Veuillez renseigner tous les champs de mot de passe', isError: true });
      return;
    }

    if (newP !== confP) {
      this.passwordFeedback.set({ message: 'Les nouveaux mots de passe ne correspondent pas', isError: true });
      return;
    }

    const res = this.userStorage.updatePassword(oldP, newP);
    if (!res.success) {
      this.passwordFeedback.set({ message: res.error || 'Erreur lors de la mise à jour', isError: true });
    } else {
      this.passwordFeedback.set({ message: 'Mot de passe mis à jour avec succès', isError: false });
      this.oldPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
    }
  }

  disconnectOtherSessions() {
    this.toastMessage.set('Toutes les autres sessions actives ont été révoquées avec succès.');
    setTimeout(() => {
      if (this.toastMessage()?.includes('sessions')) {
        this.toastMessage.set(null);
      }
    }, 4000);
  }

  openUpgradeModal() {
    this.showUpgradeModal.set(true);
  }

  confirmUpgrade() {
    this.showUpgradeModal.set(false);
    this.toastMessage.set('Félicitations ! Votre souscription au Forfait Pro Annuel a été confirmée.');
    setTimeout(() => this.toastMessage.set(null), 5000);
  }

  resetDraftToSaved() {
    this.loadFromStorage();
  }

  saveAllChanges() {
    // 1. Convert automation level to code
    let lvlCode: AutomationLevelCode = 'ANALYSIS';
    const num = this.draftAutomationLevel();
    if (num === 1) lvlCode = 'ANALYSIS';
    else if (num === 2) lvlCode = 'SIGNALS';
    else if (num === 3) lvlCode = 'PAPER_TRADING';
    else if (num === 4) lvlCode = 'DEMO_AUTO';
    else if (num === 5) lvlCode = 'LIVE_AUTO';

    const selectedPairs = this.draftSelectedPairs().length > 0 
      ? this.draftSelectedPairs() 
      : ['EUR/USD']; // Fallback safety

    const fullPrefs: MockUserPreferences = {
      selectedPairs,
      riskRules: {
        riskPerTradePercent: this.draftRiskRules().riskPerTradePercent,
        maxDailyLossPercent: this.draftRiskRules().maxDailyLossPercent,
        maxOpenPositions: this.draftRiskRules().maxOpenPositions,
        maxExposurePercent: this.draftRiskRules().maxExposurePercent,
        newsFilterActive: this.draftRiskRules().newsFilterActive,
        weekendLockActive: this.draftRiskRules().weekendLockActive
      },
      automation: {
        level: lvlCode,
        manualConfirmation: this.draftManualConfirmation(),
        maxDailyTrades: this.draftMaxDailyTrades()
      },
      tradingAccounts: this.draftAccounts()
    };

    // 2. Persist to MockUserStorageService
    this.userStorage.updateFullPreferences(fullPrefs);
    this.userStorage.updateUserProfile({
      firstName: this.profileFirstName(),
      lastName: this.profileLastName(),
      email: this.profileEmail()
    });

    // 3. Trigger reload in OnboardingService to refresh all derived signals throughout the app
    this.onboardingService.loadFromUserStorage();

    // 4. Update UI status
    this.hasUnsavedChanges.set(false);
    this.toastMessage.set('Vos paramètres ont été mis à jour avec succès et appliqués au Dashboard.');
    
    // Auto-dismiss toast
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }
}
