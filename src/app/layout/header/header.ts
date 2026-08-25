import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketDemoService } from '../../core/services/market-demo.service';
import { ButtonComponent } from '../../shared/components/button/button';
import { StatusIndicatorComponent } from '../../shared/components/status-indicator/status-indicator';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-0 z-50 block w-full'
  },
  imports: [RouterLink, ButtonComponent, StatusIndicatorComponent, ThemeToggleComponent],
  template: `
    <!-- Top Micro Bar (System Health & Live Pair Real-Time Feed) -->
    <div class="bg-[#08080a]/95 backdrop-blur-md border-b border-slate-800/60 text-[10px] font-mono text-slate-400 py-1.5 px-4 sm:px-8 overflow-hidden">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <!-- Static Label: APERÇU MARCHÉ (DÉMO) (Pinned Left, never moves) -->
        <div class="flex items-center gap-2 shrink-0 z-10 bg-[#08080a] pr-2.5 border-r border-slate-800/80">
          <app-status-indicator status="ACTIVE" label="APERÇU MARCHÉ (DÉMO)"></app-status-indicator>
        </div>

        <!-- Auto-Scrolling Ticker Track -->
        <div class="relative overflow-hidden flex-1 flex items-center min-w-0 py-0.5" 
             style="mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent);">
          
          <div class="animate-ticker flex items-center gap-4 will-change-transform">
            
            <!-- First Cycle of Pairs -->
            @for (pair of marketService.pairs(); track 'p1-' + pair.symbol) {
              <button 
                type="button"
                (click)="marketService.setActivePair(pair.symbol)"
                title="Cliquer pour afficher {{ pair.symbol }}"
                class="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded transition-all cursor-pointer hover:bg-[#141417] border border-transparent hover:border-slate-800">
                <span class="text-slate-300 font-bold uppercase flex items-center gap-1">
                  @if (pair.category === 'COMMODITY') {
                    <span class="text-amber-400 text-[9px]">★ Or (Aperçu)</span>
                  } @else if (pair.category === 'CRYPTO') {
                    <span class="text-indigo-400 text-[9px]">₿ Crypto (Aperçu)</span>
                  }
                  {{ pair.symbol }}
                </span>
                <span [class]="pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="font-bold flex items-center gap-0.5">
                  {{ pair.bid }}
                  <span class="text-[9px] font-normal" [class]="pair.change24h >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'">
                    ({{ pair.change24h >= 0 ? '+' : '' }}{{ pair.change24h }}%)
                  </span>
                  @if (pair.lastTickDirection === 'UP') {
                    <span class="mat-icon text-[10px] text-emerald-400">arrow_drop_up</span>
                  } @else if (pair.lastTickDirection === 'DOWN') {
                    <span class="mat-icon text-[10px] text-rose-400">arrow_drop_down</span>
                  }
                </span>
              </button>
              <span class="text-slate-800 shrink-0 select-none">•</span>
            }

            <!-- Duplicate Cycle for Seamless Infinite Loop -->
            @for (pair of marketService.pairs(); track 'p2-' + pair.symbol) {
              <button 
                type="button"
                (click)="marketService.setActivePair(pair.symbol)"
                title="Cliquer pour afficher {{ pair.symbol }}"
                class="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded transition-all cursor-pointer hover:bg-[#141417] border border-transparent hover:border-slate-800">
                <span class="text-slate-300 font-bold uppercase flex items-center gap-1">
                  @if (pair.category === 'COMMODITY') {
                    <span class="text-amber-400 text-[9px]">★ Or (Aperçu)</span>
                  } @else if (pair.category === 'CRYPTO') {
                    <span class="text-indigo-400 text-[9px]">₿ Crypto (Aperçu)</span>
                  }
                  {{ pair.symbol }}
                </span>
                <span [class]="pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="font-bold flex items-center gap-0.5">
                  {{ pair.bid }}
                  <span class="text-[9px] font-normal" [class]="pair.change24h >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'">
                    ({{ pair.change24h >= 0 ? '+' : '' }}{{ pair.change24h }}%)
                  </span>
                  @if (pair.lastTickDirection === 'UP') {
                    <span class="mat-icon text-[10px] text-emerald-400">arrow_drop_up</span>
                  } @else if (pair.lastTickDirection === 'DOWN') {
                    <span class="mat-icon text-[10px] text-rose-400">arrow_drop_down</span>
                  }
                </span>
              </button>
              <span class="text-slate-800 shrink-0 select-none">•</span>
            }

          </div>
        </div>

        <!-- Static System Status & Controls (Pinned Right, never moves) -->
        <div class="hidden sm:flex items-center gap-3 shrink-0 z-10 bg-[#08080a] pl-2.5 border-l border-slate-800/80">
          <button 
            type="button"
            (click)="marketService.fetchRealMarketData()"
            title="Actualiser les cotations réelles"
            class="flex items-center gap-1 text-[9px] uppercase tracking-wider font-mono text-slate-300 hover:text-white bg-[#141417] hover:bg-[#1e1e24] px-2 py-0.5 rounded border border-slate-800 transition-colors cursor-pointer">
            <span class="mat-icon text-[11px]" [class.animate-spin]="marketService.isFetching()">refresh</span>
            <span>ACTUALISER DÉMO</span>
          </button>

          <span class="text-emerald-400 font-mono text-[10px] flex items-center gap-1 font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> PASSERELLE DÉMO MT5
          </span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="bg-[#0a0a0b]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Brand / Logo -->
        <a href="#" class="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1">
          <div class="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-black text-xs italic tracking-tighter shadow-sm group-hover:bg-emerald-400 transition-colors">
            FI
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold tracking-tight text-white uppercase font-sans">
              Forex Intel
            </span>
            <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold tracking-widest uppercase border border-emerald-500/20">
              PRO
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <a href="#product-preview" class="hover:text-emerald-400 transition-colors">
            Produit
          </a>
          <a href="#market-intelligence" class="hover:text-emerald-400 transition-colors">
            Fonctionnalités
          </a>
          <a href="#risk-management" class="hover:text-emerald-400 transition-colors">
            Sécurité
          </a>
          <a href="#trading-accounts" class="hover:text-emerald-400 transition-colors">
            Comptes MT5
          </a>
          <a href="#automation" class="hover:text-emerald-400 transition-colors">
            Automatisation
          </a>
          <a href="#how-it-works" class="hover:text-emerald-400 transition-colors">
            Guide
          </a>
        </nav>

        <!-- Right Side Actions -->
        <div class="hidden sm:flex items-center gap-3">
          <app-theme-toggle></app-theme-toggle>
          
          <a routerLink="/auth/login" class="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white px-2 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
            Connexion
          </a>
          <a routerLink="/auth/register">
            <app-button variant="primary" size="md">
              Commencer Gratuitement
            </app-button>
          </a>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="flex items-center gap-2 lg:hidden">
          <app-theme-toggle [variant]="'compact'"></app-theme-toggle>
          
          <button 
            type="button"
            (click)="toggleMobileMenu()" 
            class="p-2 text-slate-400 hover:text-white bg-[#141417] border border-slate-800 rounded transition-colors focus:outline-none"
            aria-label="Menu principal">
            <span class="mat-icon text-xl">{{ isMobileMenuOpen() ? 'close' : 'menu' }}</span>
          </button>
        </div>

      </div>

      <!-- Mobile Navigation Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="lg:hidden bg-[#0a0a0b]/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav class="flex flex-col space-y-1">
            <a 
              (click)="closeMobileMenu()" 
              href="#product-preview" 
              class="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-emerald-400 hover:bg-[#141417] rounded transition-colors">
              <span class="mat-icon text-slate-400 text-base">insights</span>
              Produit & Visualisation
            </a>
            <a 
              (click)="closeMobileMenu()" 
              href="#market-intelligence" 
              class="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-emerald-400 hover:bg-[#141417] rounded transition-colors">
              <span class="mat-icon text-slate-400 text-base">psychology</span>
              Intelligence de Marché
            </a>
            <a 
              (click)="closeMobileMenu()" 
              href="#risk-management" 
              class="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-emerald-400 hover:bg-[#141417] rounded transition-colors">
              <span class="mat-icon text-slate-400 text-base">shield</span>
              Gestion du Risque
            </a>
            <a 
              (click)="closeMobileMenu()" 
              href="#trading-accounts" 
              class="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-emerald-400 hover:bg-[#141417] rounded transition-colors">
              <span class="mat-icon text-slate-400 text-base">account_tree</span>
              Comptes & MT5
            </a>
            <a 
              (click)="closeMobileMenu()" 
              href="#automation" 
              class="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-emerald-400 hover:bg-[#141417] rounded transition-colors">
              <span class="mat-icon text-slate-400 text-base">tune</span>
              Niveaux d'Automatisation
            </a>
          </nav>

          <div class="pt-3 border-t border-slate-800 flex flex-col gap-3">
            <div class="flex items-center justify-between px-2 text-[10px] uppercase font-mono text-slate-400">
              <span>Mode d'affichage</span>
              <app-theme-toggle [showLabel]="true"></app-theme-toggle>
            </div>
            <div class="flex items-center justify-between px-2 text-[10px] uppercase font-mono text-slate-400">
              <span>Essai gratuit : 15 jours</span>
              <span class="text-emerald-500 font-bold">Sans carte bancaire</span>
            </div>
            <a routerLink="/auth/register" (click)="closeMobileMenu()">
              <app-button variant="primary" size="md" [fullWidth]="true">
                COMMENCER GRATUITEMENT
              </app-button>
            </a>
          </div>
        </div>
      }
    </header>
  `,
  styles: ``
})
export class HeaderComponent {
  marketService = inject(MarketDemoService);
  isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
