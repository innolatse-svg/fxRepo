import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_FOREX_PAIRS, OTHER_UPCOMING_INSTRUMENTS, OnboardingService } from '../../../core/services/onboarding.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-onboarding-trading-preferences',
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
            <span>Étape 2 &bull; Forex-First Focus</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sélectionnez vos instruments autorisés
          </h1>
          
          <p class="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Le système ne prendra en compte, n'analysera et ne proposera d'alertes que sur les instruments que vous autorisez explicitement.
          </p>
        </div>

        <!-- Search & Quick Selection Row -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-xs">
            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Rechercher une paire (ex: EUR, JPY)..."
              class="w-full pl-9 pr-3.5 py-2 rounded-lg text-xs bg-[#131317] text-white placeholder-slate-400 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
            />
            <span class="mat-icon text-slate-400 text-sm absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
          </div>

          <!-- Quick Toggle Actions -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="selectAll()"
              class="px-3 py-1.5 rounded-lg bg-[#141418] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Tout sélectionner
            </button>
            <button
              type="button"
              (click)="clearAll()"
              class="px-3 py-1.5 rounded-lg bg-[#141418] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors">
              Tout désélectionner
            </button>
          </div>

        </div>

        <!-- Forex Major & Minor Pairs Grid -->
        <div class="space-y-2 mb-8">
          <div class="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold text-left">
            <span>PAIRES FOREX PRINCIPALES & CROISEMENTS ({{ filteredPairs().length }})</span>
            <span class="text-emerald-400 font-bold font-mono">{{ selectedPairs().length }} sélectionnée(s)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            @for (pair of filteredPairs(); track pair.symbol) {
              <button
                type="button"
                (click)="togglePair(pair.symbol)"
                class="p-3.5 rounded-xl border text-left transition-all duration-150 relative overflow-hidden flex flex-col justify-between"
                [class]="isPairSelected(pair.symbol) 
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm' 
                  : 'bg-[#121216] border-slate-800 hover:border-slate-700'">
                
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span class="text-sm font-extrabold text-white font-mono tracking-tight">{{ pair.symbol }}</span>
                    <span class="ml-2 text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                      {{ pair.category }}
                    </span>
                  </div>

                  <!-- Active Checkbox Icon -->
                  <div
                    class="w-5 h-5 rounded flex items-center justify-center transition-colors"
                    [class.bg-emerald-500]="isPairSelected(pair.symbol)"
                    [class.text-white]="isPairSelected(pair.symbol)"
                    [class.bg-slate-800]="!isPairSelected(pair.symbol)"
                    [class.text-slate-400]="!isPairSelected(pair.symbol)">
                    @if (isPairSelected(pair.symbol)) {
                      <span class="mat-icon text-sm font-bold text-white">check</span>
                    }
                  </div>
                </div>

                <p class="text-[11px] text-slate-400 line-clamp-1 mb-2">
                  {{ pair.description }}
                </p>

                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                  <span>Spread moyen : <strong class="text-slate-300">{{ pair.spreadAvgPips }} pip</strong></span>
                  <span class="text-emerald-400/80">MT5 Bridge Ready</span>
                </div>
              </button>
            }
          </div>

          <!-- Validation Warning if 0 selected -->
          @if (totalSelectedCount() === 0) {
            <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 mt-3 animate-in fade-in" role="alert">
              <span class="mat-icon text-sm flex-shrink-0">error</span>
              <span>Veuillez sélectionner au moins un instrument ou une paire pour continuer.</span>
            </div>
          }
        </div>

        <!-- OTHER ASSET CLASSES & OPTIONS (Fully Selectable & Configurable) -->
        <div class="pt-6 border-t border-slate-800 space-y-3 mb-8 text-left">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                OPTIONS & EXTENSIONS MULTI-ACTIFS ({{ filteredUpcoming().length }})
              </span>
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                [class]="selectedOtherCount() > 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-[#17171d] text-slate-400 border border-slate-700/60'">
                {{ selectedOtherCount() }} sélectionné(s)
              </span>
            </div>

            <!-- Mini Quick Actions -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="selectAllOther()"
                class="text-[11px] font-semibold text-emerald-400/90 hover:text-emerald-300 transition-colors cursor-pointer">
                + Activer toutes les options
              </button>
              <span class="text-slate-600 text-xs">&bull;</span>
              <button
                type="button"
                (click)="clearAllOther()"
                class="text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
                Désactiver
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            @for (item of filteredUpcoming(); track item.symbol) {
              <button
                type="button"
                (click)="toggleOtherInstrument(item.symbol)"
                class="p-3 rounded-xl border text-left transition-all duration-150 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
                [class]="isOtherSelected(item.symbol) 
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30' 
                  : 'bg-[#121216] border-slate-800 hover:border-slate-700'">
                
                <div class="flex items-start justify-between gap-1.5 mb-1.5">
                  <div>
                    <div class="text-xs font-extrabold text-white font-mono tracking-tight flex items-center gap-1.5">
                      <span>{{ item.symbol }}</span>
                    </div>
                    <span class="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded inline-block mt-0.5">
                      {{ item.type }}
                    </span>
                  </div>

                  <!-- Active Checkbox Icon -->
                  <div
                    class="w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0"
                    [class.bg-emerald-500]="isOtherSelected(item.symbol)"
                    [class.text-white]="isOtherSelected(item.symbol)"
                    [class.bg-slate-800]="!isOtherSelected(item.symbol)"
                    [class.text-slate-500]="!isOtherSelected(item.symbol)">
                    @if (isOtherSelected(item.symbol)) {
                      <span class="mat-icon text-sm font-bold text-white">check</span>
                    } @else {
                      <span class="mat-icon text-xs opacity-0 group-hover:opacity-100 transition-opacity">add</span>
                    }
                  </div>
                </div>

                <p class="text-[10.5px] text-slate-400 line-clamp-1 mb-2">
                  {{ item.note }}
                </p>

                <div class="flex items-center justify-between text-[9.5px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                  <span>Spread : <strong class="text-slate-300">{{ item.spreadAvg }}</strong></span>
                  <span class="text-emerald-400/90 font-medium">Activable</span>
                </div>
              </button>
            }
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-slate-800">
          <button
            type="button"
            (click)="goBack()"
            class="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-800 bg-[#121216] sm:bg-transparent sm:border-transparent text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-center">
            ← Étape précédente
          </button>

          <app-button
            variant="primary"
            size="lg"
            [disabled]="totalSelectedCount() === 0"
            (btnClick)="continue()">
            Continuer : Règles de risque →
          </app-button>
        </div>

      </div>

    </div>
  `,
  styles: `
    .bg-emerald-500-10 {
      background-color: rgba(16, 185, 129, 0.08);
    }
    .border-emerald-500-40 {
      border-color: rgba(16, 185, 129, 0.4);
    }
  `
})
export class OnboardingTradingPreferencesComponent implements OnInit {
  onboardingService = inject(OnboardingService);
  router = inject(Router);

  allPairs = DEFAULT_FOREX_PAIRS;
  upcomingInstruments = OTHER_UPCOMING_INSTRUMENTS;

  searchQuery = signal<string>('');

  ngOnInit() {
    this.onboardingService.setStep(2);
  }

  selectedPairs = computed(() => {
    return this.onboardingService.tradingPreferences().authorizedForexPairs;
  });

  selectedOtherInstruments = computed(() => {
    return this.onboardingService.tradingPreferences().otherInstruments || [];
  });

  selectedOtherCount = computed(() => this.selectedOtherInstruments().length);

  totalSelectedCount = computed(() => this.selectedPairs().length + this.selectedOtherCount());

  filteredPairs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allPairs;
    return this.allPairs.filter(p => 
      p.symbol.toLowerCase().includes(q) || 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  filteredUpcoming = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.upcomingInstruments;
    return this.upcomingInstruments.filter(i => 
      i.symbol.toLowerCase().includes(q) || 
      i.name.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      i.note.toLowerCase().includes(q)
    );
  });

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  isPairSelected(symbol: string): boolean {
    return this.selectedPairs().includes(symbol);
  }

  isOtherSelected(symbol: string): boolean {
    return this.selectedOtherInstruments().includes(symbol);
  }

  togglePair(symbol: string) {
    this.onboardingService.togglePair(symbol);
  }

  toggleOtherInstrument(symbol: string) {
    this.onboardingService.toggleOtherInstrument(symbol);
  }

  selectAll() {
    this.onboardingService.selectAllPairs();
  }

  clearAll() {
    this.onboardingService.clearAllPairs();
  }

  selectAllOther() {
    this.onboardingService.selectAllOtherInstruments();
  }

  clearAllOther() {
    this.onboardingService.clearAllOtherInstruments();
  }

  goBack() {
    this.router.navigate(['/onboarding/welcome']);
  }

  continue() {
    if (this.totalSelectedCount() === 0) return;
    this.onboardingService.setStep(3);
    this.router.navigate(['/onboarding/risk-management']);
  }
}
