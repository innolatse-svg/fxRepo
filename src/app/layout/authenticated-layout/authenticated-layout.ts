import { ChangeDetectionStrategy, Component, inject, signal, computed, ElementRef, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { MockUserStorageService } from '../../core/services/mock-user-storage.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { NetworkService } from '../../core/services/network.service';
import { LogoComponent } from '../../shared/components/logo/logo';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';
import { NetworkBannerComponent } from '../../shared/components/network-banner/network-banner';
import { SessionModalComponent } from '../../shared/components/session-modal/session-modal';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-authenticated-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    LogoComponent, 
    ThemeToggleComponent, 
    NetworkBannerComponent, 
    SessionModalComponent
  ],
  template: `
    <!-- Top Network Status Banner -->
    <app-network-banner></app-network-banner>

    <div class="h-screen w-full flex overflow-hidden bg-[#08080a] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      <!-- ============================================================ -->
      <!-- 1. RESPONSIVE SIDEBAR                                         -->
      <!-- ============================================================ -->
      
      <!-- Mobile Backdrop -->
      @if (mobileMenuOpen()) {
        <button 
          type="button"
          aria-label="Fermer le menu de navigation"
          class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200 w-full h-full border-0 cursor-default"
          (click)="closeMobileMenu()">
        </button>
      }

      <!-- Sidebar Container -->
      <aside 
        class="fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0c0c0f] border-r border-slate-800/80 transition-all duration-300 ease-in-out lg:static lg:h-full lg:translate-x-0 flex-shrink-0"
        [class.translate-x-0]="mobileMenuOpen()"
        [class.-translate-x-full]="!mobileMenuOpen()"
        [class.w-64]="!sidebarCollapsed()"
        [class.w-20]="sidebarCollapsed()">
        
        <!-- SIDEBAR HEADER: LOGO & BADGE -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          
          <app-logo 
            routerLink="/app/dashboard" 
            [showText]="!sidebarCollapsed()" 
            badge="DEMO" 
            badgeVariant="amber" 
            subtitle="MARKET INTELLIGENCE" 
            size="md">
          </app-logo>

          <!-- Collapse toggle on desktop -->
          <button 
            type="button" 
            (click)="toggleSidebarCollapse()"
            class="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            [title]="sidebarCollapsed() ? 'Agrandir la barre latérale' : 'Réduire la barre latérale'">
            <span class="mat-icon text-lg">
              {{ sidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}
            </span>
          </button>

          <!-- Mobile close button -->
          <button 
            type="button" 
            (click)="closeMobileMenu()"
            class="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span class="mat-icon text-lg">close</span>
          </button>
        </div>

        <!-- SIDEBAR NAVIGATION MENU -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1.5" aria-label="Navigation principale">
          @for (item of computedNavItems(); track item.route) {
            <a 
              [routerLink]="item.route"
              routerLinkActive="bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-semibold shadow-sm"
              [routerLinkActiveOptions]="{ exact: item.route === '/app/dashboard' }"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-[#141419] transition-all group relative"
              [title]="sidebarCollapsed() ? item.label : ''">
              
              <span class="mat-icon text-[19px] flex-shrink-0 group-hover:scale-110 transition-transform">
                {{ item.icon }}
              </span>

              @if (!sidebarCollapsed()) {
                <span class="truncate">{{ item.label }}</span>

                @if (item.badge) {
                  <span 
                    class="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                    [class]="item.badgeColor || 'bg-slate-800 text-slate-300'">
                    {{ item.badge }}
                  </span>
                }
              }
            </a>
          }
        </nav>

        <!-- SIDEBAR FOOTER: TRIAL & LOGOUT -->
        <div class="p-3 border-t border-slate-800/80 space-y-3 bg-[#0a0a0d]">
          
          @if (!sidebarCollapsed()) {
            <!-- Subscription Pro Trial Widget -->
            <div class="p-3 rounded-xl subscription-progress-box border text-left space-y-2.5 shadow-sm">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold plan-title flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></span>
                  Essai {{ subscriptionPlan() }} Actif
                </span>
                <span class="font-mono plan-progress-value font-bold">{{ trialDaysRemaining() }}j restants</span>
              </div>
              
              <div class="w-full subscription-progress-track h-2 rounded-full overflow-hidden p-0.5 border shadow-inner">
                <div 
                  class="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                  [style.width.%]="trialProgressPercent()">
                </div>
              </div>
              
              <div class="text-[10px] plan-subtitle flex items-center justify-between">
                <span class="truncate max-w-[130px] font-medium">{{ userName() }}</span>
                <span class="subscription-badge font-bold uppercase text-[9px] font-mono px-1.5 py-0.5 rounded border">{{ subscriptionPlan() }}</span>
              </div>
            </div>
          }

          <!-- Logout Button -->
          <button 
            type="button"
            (click)="handleLogout()"
            class="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
            [title]="sidebarCollapsed() ? 'Déconnexion' : ''">
            <span class="mat-icon text-[18px]">logout</span>
            @if (!sidebarCollapsed()) {
              <span>Déconnexion</span>
            }
          </button>

        </div>
      </aside>

      <!-- ============================================================ -->
      <!-- 2. MAIN APPLICATION CONTENT AREA                              -->
      <!-- ============================================================ -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <!-- TOPBAR -->
        <header class="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#0c0c0f]/90 backdrop-blur-md border-b border-slate-800/80 z-30 sticky top-0">
          
          <!-- Left: Mobile Menu Toggle & MT5 Gateway Status -->
          <div class="flex items-center gap-2 sm:gap-3">
            <button 
              type="button" 
              (click)="openMobileMenu()"
              class="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-300 hover:text-white bg-[#141419] border border-slate-800 hover:bg-slate-800 transition-colors touch-target cursor-pointer"
              aria-label="Ouvrir le menu">
              <span class="mat-icon text-2xl">menu</span>
            </button>

            <!-- MT5 Gateway Status Pill -->
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141419] border border-slate-800 text-[11px] font-mono">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-slate-300 font-semibold">MT5 Gateway</span>
              <span class="text-slate-400">&bull;</span>
              <span class="text-emerald-400 font-bold">Connectée (Demo)</span>
            </div>

            <!-- Mobile Mini Gateway Pill -->
            <div class="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#141419] border border-slate-800 text-[10px] font-mono text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-bold">MT5</span>
            </div>
          </div>

          <!-- Center/Right: Account Selector, Exposure, Emergency Stop & Profile -->
          <div class="flex items-center gap-1.5 sm:gap-3">
            
            <!-- Quick Active Account Selector -->
            <div class="relative">
              <select 
                [value]="dashboardService.selectedAccountId()"
                (change)="onAccountChange($event)"
                class="bg-[#141419] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-2 sm:px-2.5 py-2 pr-6 sm:pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[110px] xs:max-w-[140px] sm:max-w-none truncate">
                @for (acc of onboardingService.tradingAccounts(); track acc.id) {
                  <option [value]="acc.id">
                    {{ acc.brokerName }} · #{{ acc.accountNumber }} ({{ acc.accountType }})
                  </option>
                }
              </select>
              <span class="mat-icon text-sm text-slate-400 absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>

            <!-- Real-time Exposure Ticker (Medium+ Screens) -->
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141419] border border-slate-800 text-xs font-mono">
              <span class="text-slate-400">Exposition:</span>
              <span class="text-emerald-400 font-bold">{{ dashboardService.metrics().currentExposurePct }}%</span>
              <span class="text-slate-400">/ {{ dashboardService.metrics().maxExposureLimitPct }}%</span>
            </div>

            <!-- Topbar Notification Bell -->
            <a 
              id="topbar-notifications-btn"
              routerLink="/app/notifications"
              class="relative p-2 rounded-xl bg-[#141419] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center justify-center"
              title="Centre de notifications">
              <span class="mat-icon text-lg text-slate-300">notifications</span>
              @if (notificationsService.unreadCount() > 0) {
                <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                  {{ notificationsService.unreadCount() }}
                </span>
              }
            </a>

            <!-- EMERGENCY STOP BUTTON -->
            @if (dashboardService.emergencyStopActive()) {
              <button 
                type="button" 
                (click)="dashboardService.resumeOperations()"
                class="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/30 animate-pulse hover:bg-rose-600 transition-colors cursor-pointer min-h-[40px]"
                title="L'arrêt d'urgence est actif. Cliquez pour reprendre les opérations normales.">
                <span class="mat-icon text-base">lock</span>
                <span class="hidden sm:inline">ARRÊT ACTIF (Reprendre)</span>
                <span class="sm:hidden font-mono text-[11px]">ARRÊT</span>
              </button>
            } @else {
              <button 
                type="button" 
                (click)="openEmergencyModal()"
                class="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all shadow-sm cursor-pointer group min-h-[40px]"
                title="Déclencher l'arrêt d'urgence et bloquer immédiatement toute exécution d'ordre">
                <span class="mat-icon text-base group-hover:scale-110 transition-transform">power_settings_new</span>
                <span class="hidden sm:inline">EMERGENCY STOP</span>
                <span class="sm:hidden font-mono text-[11px]">STOP</span>
              </button>
            }

            <!-- Theme Toggle -->
            <app-theme-toggle [variant]="'compact'"></app-theme-toggle>

            <!-- User Avatar & Profile Dropdown -->
            <div class="relative pl-2 border-l border-slate-800">
              <button 
                type="button" 
                (click)="toggleUserMenu()"
                class="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/60 transition-colors text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                aria-haspopup="true"
                [attr.aria-expanded]="userMenuOpen()">
                <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-emerald-400">
                  {{ userInitials() }}
                </div>
                <div class="hidden lg:block text-left">
                  <div class="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                    <span class="max-w-[120px] truncate">{{ userName() }}</span>
                    <span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20">
                      {{ subscriptionPlan() }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono">{{ trialDaysRemaining() }}j restants</div>
                </div>
                <span class="mat-icon text-slate-400 text-sm hidden sm:inline">expand_more</span>
              </button>

              <!-- Profile Dropdown Menu -->
              @if (userMenuOpen()) {
                <button 
                  type="button"
                  aria-label="Fermer le menu utilisateur"
                  class="fixed inset-0 z-40 bg-transparent border-0 cursor-default w-full h-full" 
                  (click)="closeUserMenu()">
                </button>

                <div 
                  class="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e0e13] border border-slate-700/80 shadow-2xl shadow-black/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                  
                  <div class="px-3 py-2 border-b border-slate-800 mb-1">
                    <div class="text-xs font-bold text-white truncate">{{ userName() }}</div>
                    <div class="text-[11px] text-slate-400 truncate">{{ userEmail() }}</div>
                    <div class="mt-1 flex items-center justify-between text-[10px]">
                      <span class="text-emerald-400 font-bold">Plan {{ subscriptionPlan() }}</span>
                      <span class="text-slate-400 font-mono">{{ trialDaysRemaining() }}j restants</span>
                    </div>
                  </div>

                  <a 
                    routerLink="/app/settings" 
                    [queryParams]="{ tab: 'profile' }"
                    (click)="navigateToSettings('profile')"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all cursor-pointer">
                    <span class="mat-icon text-emerald-400 text-[18px]">manage_accounts</span>
                    <span class="font-medium">Mon Profil / Paramètres</span>
                  </a>

                  <a 
                    routerLink="/app/notifications" 
                    (click)="closeUserMenu()"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all">
                    <span class="mat-icon text-amber-400 text-[18px]">notifications</span>
                    <span>Notifications & Alertes</span>
                  </a>

                  <a 
                    routerLink="/app/risk" 
                    (click)="closeUserMenu()"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all">
                    <span class="mat-icon text-cyan-400 text-[18px]">shield</span>
                    <span>Moteur de Risque</span>
                  </a>

                  <a 
                    routerLink="/app/accounts" 
                    (click)="closeUserMenu()"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all">
                    <span class="mat-icon text-indigo-400 text-[18px]">account_balance</span>
                    <span>Comptes MT5</span>
                  </a>

                  <div class="h-px bg-slate-800 my-1"></div>

                  <button 
                    type="button" 
                    (click)="closeUserMenu(); handleLogout()"
                    class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer">
                    <span class="mat-icon text-[18px]">logout</span>
                    <span>Déconnexion</span>
                  </button>

                </div>
              }
            </div>

          </div>

        </header>

        <!-- EMERGENCY STOP GLOBAL WARNING BANNER -->
        @if (dashboardService.emergencyStopActive()) {
          <div class="bg-rose-500/15 border-b border-rose-500/40 px-4 py-2.5 text-xs text-rose-300 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
            <div class="flex items-center gap-2">
              <span class="mat-icon text-rose-400 text-lg flex-shrink-0">warning</span>
              <div>
                <strong class="font-bold text-white">COUPE-CIRCUIT D'URGENCE ACTIVÉ :</strong>
                <span>Tout nouvel ordre ou signal est verrouillé. Les exécutions sont suspendues.</span>
              </div>
            </div>
            <button 
              type="button" 
              (click)="dashboardService.resumeOperations()"
              class="px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex-shrink-0">
              Réactiver l'orchestrateur
            </button>
          </div>
        }

        <!-- SCROLLABLE PAGE BODY -->
        <main #mainContent class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>

      </div>

    </div>

    <!-- ============================================================ -->
    <!-- SESSION EXPIRED / RENEWAL MODAL                              -->
    <!-- ============================================================ -->
    <app-session-modal></app-session-modal>

    <!-- ============================================================ -->
    <!-- EMERGENCY STOP CONFIRMATION MODAL                             -->
    <!-- ============================================================ -->
    @if (showEmergencyModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div class="relative bg-[#0e0e12] border border-rose-500/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-left shadow-2xl shadow-rose-950/50 space-y-5">
          
          <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <span class="mat-icon text-2xl">power_settings_new</span>
          </div>

          <div class="space-y-2">
            <h2 class="text-xl font-bold text-white tracking-tight">
              Déclencher l'EMERGENCY STOP ?
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cette action verrouille immédiatement la passerelle MT5 et le moteur d'exécution. Aucun nouvel ordre ne sera routé tant que vous n'aurez pas réactivé le système manuellement.
            </p>
          </div>

          <div class="p-3 rounded-lg bg-[#141419] border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div class="text-rose-300 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Actions appliquées :
            </div>
            <div>&bull; Blocage de l'envoi d'ordres MT5</div>
            <div>&bull; Maintien des Stop Loss / Take Profit actifs chez le broker</div>
            <div>&bull; Alerte visuelle de sécurité sur le Dashboard</div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              (click)="closeEmergencyModal()"
              class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Annuler
            </button>

            <button 
              type="button" 
              (click)="confirmEmergencyStop()"
              class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/30">
              Confirmer l'arrêt d'urgence
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `
})
export class AuthenticatedLayoutComponent {
  authService = inject(AuthService);
  mockUserStorage = inject(MockUserStorageService);
  dashboardService = inject(DashboardService);
  onboardingService = inject(OnboardingService);
  notificationsService = inject(NotificationsService);
  networkService = inject(NetworkService);
  router = inject(Router);
  mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (!event.url.includes('#')) {
          const el = this.mainContent()?.nativeElement;
          if (el) {
            try {
              if (typeof el.scrollTo === 'function') {
                el.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              } else {
                el.scrollTop = 0;
              }
            } catch {
              el.scrollTop = 0;
            }
          }
        }
      });
  }

  sidebarCollapsed = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  showEmergencyModal = signal<boolean>(false);
  userMenuOpen = signal<boolean>(false);

  currentMockUser = computed(() => this.mockUserStorage.currentUser());

  userName = computed(() => {
    const raw = this.currentMockUser();
    if (raw?.firstName || raw?.lastName) {
      return `${raw.firstName} ${raw.lastName}`.trim();
    }
    return this.authService.currentUser()?.name || 'Trader Pro';
  });

  userEmail = computed(() => this.currentMockUser()?.email || this.authService.currentUser()?.email || 'demo@forexintel.com');

  subscriptionPlan = computed(() => this.currentMockUser()?.subscription.plan || 'PRO');

  trialDaysRemaining = computed(() => this.currentMockUser()?.subscription.trialDaysRemaining ?? 15);
  trialProgressPercent = computed(() => {
    const days = this.trialDaysRemaining();
    return Math.min(100, Math.max(0, Math.round((days / 30) * 100)));
  });

  userInitials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (name.length >= 2) {
      return name.slice(0, 2).toUpperCase();
    }
    return 'FI';
  });

  readonly computedNavItems = computed<NavItem[]>(() => {
    const unread = this.notificationsService.unreadCount();
    return [
      { label: 'Vue d\'ensemble', route: '/app/dashboard', icon: 'dashboard' },
      { label: 'Surveillance Marché', route: '/app/market', icon: 'candlestick_chart' },
      { label: 'Signaux & IA', route: '/app/signals', icon: 'psychology', badge: 'LIVE', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' },
      { label: 'Gestion du Risque', route: '/app/risk', icon: 'shield' },
      { label: 'Comptes MT5 & Brokers', route: '/app/accounts', icon: 'account_balance' },
      { label: 'Laboratoire Backtesting', route: '/app/backtesting', icon: 'science' },
      { label: 'Calendrier Macro', route: '/app/calendar', icon: 'calendar_today' },
      { 
        label: 'Notifications', 
        route: '/app/notifications', 
        icon: 'notifications', 
        badge: unread > 0 ? `${unread}` : undefined,
        badgeColor: 'bg-emerald-500 text-black font-bold'
      },
      { label: 'Paramètres & Profil', route: '/app/settings', icon: 'settings' }
    ];
  });

  toggleSidebarCollapse() {
    this.sidebarCollapsed.update(v => !v);
  }

  openMobileMenu() {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.userMenuOpen.set(false);
  }

  navigateToSettings(tab?: string) {
    this.closeUserMenu();
    if (tab) {
      this.router.navigate(['/app/settings'], { queryParams: { tab } });
    } else {
      this.router.navigate(['/app/settings']);
    }
  }

  openEmergencyModal() {
    this.showEmergencyModal.set(true);
  }

  closeEmergencyModal() {
    this.showEmergencyModal.set(false);
  }

  confirmEmergencyStop() {
    this.dashboardService.triggerEmergencyStop('Intervention manuelle utilisateur');
    this.showEmergencyModal.set(false);
  }

  onAccountChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.dashboardService.selectedAccountId.set(target.value);
    }
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
