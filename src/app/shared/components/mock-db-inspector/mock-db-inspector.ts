import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MockUserStorageService } from '../../../core/services/mock-user-storage.service';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { MockUserRecord } from '../../../core/models/user-storage.model';

@Component({
  selector: 'app-mock-db-inspector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Trigger (FAB on Mobile, Pill on Desktop - Bottom Right) -->
    <aside 
      class="fixed bottom-4 right-4 z-40 flex items-center gap-2 p-1 sm:p-1.5 rounded-full sm:rounded-2xl bg-[#0e0e13]/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 text-xs text-white"
      aria-label="Contrôleur de simulation Mock DB">
      
      <!-- Status Badge / Mobile FAB -->
      <button 
        type="button"
        (click)="openModal()"
        class="flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto px-0 sm:px-3 py-0 sm:py-1.5 rounded-full sm:rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-mono font-semibold transition-all border border-emerald-500/30 cursor-pointer touch-target shadow-lg shadow-emerald-950/30"
        title="Ouvrir l'inspecteur JSON de la base locale">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="hidden sm:inline">MOCK DB</span>
        <span class="hidden sm:inline px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-200">
          {{ userCount() }} usr
        </span>
      </button>

      <!-- Quick Action: Voir JSON (Desktop only) -->
      <button 
        type="button"
        (click)="openModal('json')"
        class="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium transition-colors cursor-pointer text-[11px]"
        title="Voir la Base JSON brute">
        <span class="mat-icon text-[15px] text-cyan-400">data_object</span>
        <span>Voir JSON</span>
      </button>

      <!-- Quick Action: Demo Account Switch (Desktop only) -->
      <button 
        type="button"
        (click)="handleSwitchDemo()"
        class="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium transition-colors cursor-pointer text-[11px]"
        title="Basculer instantanément sur le compte Démo (demo@forexintel.com)">
        <span class="mat-icon text-[15px] text-amber-400">account_circle</span>
        <span>Démo</span>
      </button>

      <!-- Quick Action: Reset DB -->
      <button 
        type="button"
        (click)="handleResetDb()"
        class="hidden sm:inline-flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        title="Réinitialiser la Base JSON (effacer le localStorage)">
        <span class="mat-icon text-[16px] text-rose-400">restart_alt</span>
      </button>

    </aside>

    <!-- Inspection Modal Dialog / Mobile Bottom Sheet -->
    @if (isModalOpen()) {
      <div 
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mock-db-title">
        
        <div class="relative bg-[#0c0c10] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl max-w-4xl w-full max-h-[88vh] sm:max-h-[90vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden text-left animate-in slide-in-from-bottom-4 duration-200">
          
          <!-- Mobile Pull Handle -->
          <div class="sm:hidden flex items-center justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 rounded-full bg-slate-700"></div>
          </div>

          <!-- Modal Header -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-[#121217]">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <span class="mat-icon text-xl">database</span>
              </div>
              <div>
                <h2 id="mock-db-title" class="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Base de Données Locale JSON</span>
                  <span class="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    localStorage: fx_intel_mock_db
                  </span>
                </h2>
                <p class="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
                  Simulation de persistance locale & comptes de test
                </p>
              </div>
            </div>

            <!-- Close Button -->
            <button 
              type="button"
              (click)="closeModal()"
              class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer touch-target"
              aria-label="Fermer la modal">
              <span class="mat-icon text-xl">close</span>
            </button>
          </div>

          <!-- Modal Tabs & Quick Actions Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-[#14141a]">
            
            <!-- Tab Buttons -->
            <div class="flex items-center gap-2">
              <button 
                type="button"
                (click)="activeTab.set('users')"
                [class]="activeTab() === 'users' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' : 'bg-slate-800/60 text-slate-400 border-transparent hover:text-white'"
                class="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <span class="mat-icon text-[15px]">people</span>
                <span>Comptes ({{ userCount() }})</span>
              </button>

              <button 
                type="button"
                (click)="activeTab.set('json')"
                [class]="activeTab() === 'json' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' : 'bg-slate-800/60 text-slate-400 border-transparent hover:text-white'"
                class="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <span class="mat-icon text-[15px]">code</span>
                <span>JSON Brut</span>
              </button>
            </div>

            <!-- Action Buttons (Scrollable on small screens) -->
            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <button 
                type="button"
                (click)="handleResetPreferences()"
                class="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                title="Restaure les choix de trading/risque initiaux sans supprimer l'utilisateur">
                <span class="mat-icon text-[14px]">settings_backup_restore</span>
                <span>Reset Prefs</span>
              </button>

              <button 
                type="button"
                (click)="handleSwitchDemo()"
                class="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
                <span class="mat-icon text-[14px]">account_circle</span>
                <span>Démo</span>
              </button>

              <button 
                type="button"
                (click)="handleResetDb()"
                class="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
                <span class="mat-icon text-[14px]">delete_sweep</span>
                <span>Reset DB</span>
              </button>
            </div>

          </div>

          <!-- Notification/Feedback Toast inside Modal -->
          @if (feedbackMessage(); as feedback) {
            <div class="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-150">
              <div class="flex items-center gap-2">
                <span class="mat-icon text-sm">check_circle</span>
                <span>{{ feedback }}</span>
              </div>
              <button type="button" (click)="feedbackMessage.set(null)" class="text-slate-400 hover:text-white">
                <span class="mat-icon text-xs">close</span>
              </button>
            </div>
          }

          <!-- Modal Body Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">

            <!-- TAB 1: USERS LIST & CURRENT SESSION -->
            @if (activeTab() === 'users') {
              <div class="space-y-6">
                
                <!-- Active Session Card -->
                <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-500/[0.07] to-cyan-500/[0.05] border border-emerald-500/30 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Session Active Actuelle
                    </span>
                    <span class="text-xs font-mono text-slate-400">
                      ID: {{ currentUser()?.id || 'Non connecté' }}
                    </span>
                  </div>

                  @if (currentUser(); as user) {
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div class="p-2.5 rounded-lg bg-[#0e0e13] border border-slate-800">
                        <span class="text-slate-400 block text-[10px]">Utilisateur</span>
                        <span class="font-bold text-white">{{ user.firstName }} {{ user.lastName }}</span>
                        <span class="block text-slate-400 font-mono text-[11px] truncate">{{ user.email }}</span>
                      </div>

                      <div class="p-2.5 rounded-lg bg-[#0e0e13] border border-slate-800">
                        <span class="text-slate-400 block text-[10px]">Abonnement & Statut</span>
                        <span class="font-bold text-emerald-400">{{ user.subscription.plan }} ({{ user.subscription.trialDaysRemaining }}j restants)</span>
                        <span class="block text-slate-400 text-[11px]">
                          Onboarding : {{ user.onboardingCompleted ? 'Terminé ✅' : 'Non terminé ⏳' }}
                        </span>
                      </div>

                      <div class="p-2.5 rounded-lg bg-[#0e0e13] border border-slate-800">
                        <span class="text-slate-400 block text-[10px]">Paires Autorisées</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                          @for (pair of user.preferences.selectedPairs; track pair) {
                            <span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-200">
                              {{ pair }}
                            </span>
                          }
                          @if (!user.preferences.selectedPairs.length) {
                            <span class="text-slate-400 text-[11px]">Aucune paire sélectionnée</span>
                          }
                        </div>
                      </div>
                    </div>
                  } @else {
                    <div class="text-xs text-slate-400 py-2">
                      Aucune session utilisateur active. Connectez-vous ou basculez sur le compte Démo ci-dessus.
                    </div>
                  }
                </div>

                <!-- Users Table -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Tous les utilisateurs dans le Mock JSON ({{ allUsers().length }})
                    </h3>
                  </div>

                  <div class="border border-slate-800 rounded-xl overflow-hidden bg-[#101015]">
                    <table class="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr class="border-b border-slate-800 bg-[#15151c] text-slate-400 text-[11px]">
                          <th class="p-3">Utilisateur</th>
                          <th class="p-3">Plan</th>
                          <th class="p-3">Onboarding</th>
                          <th class="p-3">Paires</th>
                          <th class="p-3">Risque / Trade</th>
                          <th class="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-800/60 font-mono">
                        @for (usr of allUsers(); track usr.id) {
                          <tr class="hover:bg-slate-800/30 transition-colors" [class.bg-emerald-500/[0.04]]="usr.id === currentUser()?.id">
                            
                            <td class="p-3 font-sans">
                              <div class="font-bold text-white flex items-center gap-1.5">
                                <span>{{ usr.firstName }} {{ usr.lastName }}</span>
                                @if (usr.id === currentUser()?.id) {
                                  <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">ACTIF</span>
                                }
                              </div>
                              <div class="text-slate-400 text-[11px] font-mono">{{ usr.email }}</div>
                            </td>

                            <td class="p-3">
                              <span class="px-2 py-0.5 rounded text-[10px] font-bold" [class]="usr.subscription.plan === 'PRO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'">
                                {{ usr.subscription.plan }}
                              </span>
                            </td>

                            <td class="p-3 font-sans">
                              @if (usr.onboardingCompleted) {
                                <span class="text-emerald-400 flex items-center gap-1 text-[11px]">
                                  <span class="mat-icon text-xs">check_circle</span> Terminé
                                </span>
                              } @else {
                                <span class="text-amber-400 flex items-center gap-1 text-[11px]">
                                  <span class="mat-icon text-xs">pending</span> En cours
                                </span>
                              }
                            </td>

                            <td class="p-3 text-[11px] text-slate-300">
                              {{ usr.preferences.selectedPairs.join(', ') || 'N/A' }}
                            </td>

                            <td class="p-3 text-[11px] text-slate-300">
                              {{ usr.preferences.riskRules.riskPerTradePercent }}%
                            </td>

                            <td class="p-3 text-right">
                              @if (usr.id !== currentUser()?.id) {
                                <button 
                                  type="button"
                                  (click)="switchUser(usr)"
                                  class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold transition-colors cursor-pointer">
                                  Se connecter
                                </button>
                              } @else {
                                <span class="text-slate-400 text-[11px] italic font-sans">Connecté</span>
                              }
                            </td>

                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            }

            <!-- TAB 2: RAW JSON VIEWER & COPY -->
            @if (activeTab() === 'json') {
              <div class="space-y-4">
                
                <div class="flex items-center justify-between">
                  <div class="text-xs text-slate-400">
                    Contenu JSON sérialisé dans <code class="text-emerald-400 font-mono">localStorage.getItem('fx_intel_mock_db')</code>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button"
                      (click)="copyJsonToClipboard()"
                      class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                      <span class="mat-icon text-sm">content_copy</span>
                      <span>{{ copied() ? 'Copié !' : 'Copier le JSON' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Code Pre Block -->
                <div class="relative bg-[#07070a] border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-[500px]">
                  <pre class="text-[11px] font-mono text-emerald-300 leading-relaxed whitespace-pre font-normal">{{ rawJsonString() }}</pre>
                </div>

              </div>
            }

          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#121217]">
            <div class="text-xs text-slate-400 flex items-center gap-2">
              <span class="mat-icon text-sm text-emerald-400">verified</span>
              <span>FOREX INTEL Mock User Database v1.0</span>
            </div>
            
            <button 
              type="button" 
              (click)="closeModal()"
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer">
              Fermer
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class MockDbInspectorComponent {
  userStorage = inject(MockUserStorageService);
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  isModalOpen = signal<boolean>(false);
  activeTab = signal<'users' | 'json'>('users');
  copied = signal<boolean>(false);
  feedbackMessage = signal<string | null>(null);

  currentUser = computed(() => this.userStorage.currentUser());
  allUsers = computed(() => this.userStorage.getAllUsers());
  userCount = computed(() => this.userStorage.database().users.length);

  rawJsonString = computed(() => {
    // Read directly from userStorage signal to keep reactive
    const db = this.userStorage.database();
    return JSON.stringify(db, null, 2);
  });

  openModal(tab: 'users' | 'json' = 'users') {
    this.activeTab.set(tab);
    this.isModalOpen.set(true);
    this.copied.set(false);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.feedbackMessage.set(null);
  }

  handleResetPreferences() {
    this.userStorage.resetActiveUserPreferences();
    this.onboardingService.loadFromUserStorage();
    this.feedbackMessage.set('Préférences d\'onboarding restaurées par défaut pour le compte actif.');
  }

  handleSwitchDemo() {
    this.userStorage.switchDemoUser();
    this.onboardingService.loadFromUserStorage();
    this.feedbackMessage.set('Compte Démo (demo@forexintel.com) activé avec succès.');
    this.router.navigate(['/app/dashboard']);
  }

  handleResetDb() {
    this.userStorage.resetDatabase();
    this.onboardingService.loadFromUserStorage();
    this.feedbackMessage.set('Base JSON réinitialisée aux valeurs par défaut.');
    this.router.navigate(['/app/dashboard']);
  }

  switchUser(user: MockUserRecord) {
    this.userStorage.login(user.email, 'Demo1234!'); // or direct session switch
    this.onboardingService.loadFromUserStorage();
    this.feedbackMessage.set(`Connecté en tant que ${user.firstName} ${user.lastName} (${user.email}).`);
    
    if (user.onboardingCompleted) {
      this.router.navigate(['/app/dashboard']);
    } else {
      this.router.navigate(['/onboarding/welcome']);
    }
  }

  async copyJsonToClipboard() {
    try {
      const json = this.rawJsonString();
      await navigator.clipboard.writeText(json);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.copied.set(false);
    }
  }
}
