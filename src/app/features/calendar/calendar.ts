import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CalendarService, EconomicEvent } from '../../core/services/calendar.service';

export const INITIAL_EVENTS: EconomicEvent[] = [
  {
    id: 'ev-1',
    time: '14:30 GMT+1',
    currency: 'USD',
    countryCode: 'US',
    title: 'Indice des Prix à la Consommation (Core CPI YoY)',
    impact: 'HIGH',
    forecast: '2.9%',
    previous: '3.1%',
    affectedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD'],
    historicalPipMove: 65,
    aiNote: 'Volatilité extrême attendue. Une publication sous le consensus (<2.8%) affaiblira fortement le dollar en augmentant les anticipations de baisse de taux Fed.'
  },
  {
    id: 'ev-2',
    time: '15:45 GMT+1',
    currency: 'USD',
    countryCode: 'US',
    title: 'PMI Manufacturier S&P Global',
    impact: 'MEDIUM',
    forecast: '50.8',
    previous: '50.5',
    affectedPairs: ['USD/CAD', 'EUR/USD'],
    historicalPipMove: 25,
    aiNote: 'Baromètre d\'activité industrielle. Au-dessus de 50 = expansion.'
  },
  {
    id: 'ev-3',
    time: '10:00 GMT+1',
    currency: 'EUR',
    countryCode: 'EU',
    title: 'Indice ZEW du Sentiment Économique Allemand',
    impact: 'MEDIUM',
    actual: '15.2',
    forecast: '14.0',
    previous: '12.8',
    affectedPairs: ['EUR/USD', 'EUR/GBP', 'EUR/JPY'],
    historicalPipMove: 30,
    aiNote: 'Surprise positive (+15.2 vs 14.0) soutenant l\'euro sur les paires croisées.'
  },
  {
    id: 'ev-4',
    time: 'Demain 08:00',
    currency: 'GBP',
    countryCode: 'GB',
    title: 'PIB Mensuel (MoM)',
    impact: 'HIGH',
    forecast: '0.2%',
    previous: '0.1%',
    affectedPairs: ['GBP/USD', 'EUR/GBP'],
    historicalPipMove: 45,
    aiNote: 'Clé pour la politique monétaire de la Bank of England (BoE).'
  },
  {
    id: 'ev-5',
    time: 'Demain 14:30',
    currency: 'USD',
    countryCode: 'US',
    title: 'Inscriptions Hebdomadaires au Chômage',
    impact: 'HIGH',
    forecast: '215K',
    previous: '220K',
    affectedPairs: ['EUR/USD', 'USD/JPY'],
    historicalPipMove: 35,
    aiNote: 'Mesure de tension du marché du travail US.'
  }
];

@Component({
  selector: 'app-calendar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="space-y-8 max-w-7xl mx-auto text-left">
      
      <!-- ============================================================ -->
      <!-- HEADER & ACTIONS                                             -->
      <!-- ============================================================ -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">calendar_month</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Calendrier Macro & Protection News
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              FILTRE AUTOMATIQUE DE VOLATILITÉ
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Surveillez les annonces économiques majeures et protégez vos capitaux contre les écarts de spread et de slippage.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a 
            routerLink="/app/dashboard"
            class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1">
            <span>Dashboard</span>
          </a>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- VOLATILITY SHIELD LIVE BANNER                                -->
      <!-- ============================================================ -->
      <div class="p-6 rounded-2xl bg-gradient-to-r from-[#0e0e12] via-[#14141d] to-[#0e0e12] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        
        <div class="space-y-2 relative z-10">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              BOUCLIER ANTI-SLIPPAGE ACTIF
            </span>
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">
            Prochain Impact Majeur : US Core CPI
          </h2>
          <p class="text-xs text-slate-400 max-w-xl">
            Toutes les nouvelles prises de positions seront verrouillées automatiquement <strong>15 minutes avant et après</strong> la publication à 14:30 GMT+1.
          </p>
        </div>

        <!-- Live Countdown Timer -->
        <div class="flex items-center gap-2 bg-[#0B0E14] p-3 rounded-xl border border-slate-800 font-mono text-center flex-shrink-0">
          <div class="px-2">
            <div class="text-xl font-black text-white">01</div>
            <div class="text-[9px] text-slate-400 uppercase">Heures</div>
          </div>
          <span class="text-slate-400 text-lg font-bold">:</span>
          <div class="px-2">
            <div class="text-xl font-black text-emerald-400">42</div>
            <div class="text-[9px] text-slate-400 uppercase">Min</div>
          </div>
          <span class="text-slate-400 text-lg font-bold">:</span>
          <div class="px-2">
            <div class="text-xl font-black text-white">{{ countdownSeconds() }}</div>
            <div class="text-[9px] text-slate-400 uppercase">Sec</div>
          </div>
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- FILTERS TOOLBAR                                              -->
      <!-- ============================================================ -->
      <div class="p-4 rounded-2xl bg-[#0e0e12] border border-slate-800 space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <!-- Currencies -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-mono text-slate-400 mr-1">Devises :</span>
            @for (cur of availableCurrencies; track cur) {
              <button 
                type="button"
                (click)="selectedCurrency.set(cur)"
                [class.bg-emerald-500]="selectedCurrency() === cur"
                [class.text-black]="selectedCurrency() === cur"
                [class.font-bold]="selectedCurrency() === cur"
                class="px-2.5 py-1 rounded-lg bg-[#141419] border border-slate-800 text-slate-300 text-xs font-mono hover:border-slate-700 transition-colors">
                {{ cur }}
              </button>
            }
          </div>

          <!-- Impact Pills -->
          <div class="flex items-center rounded-xl bg-[#141419] border border-slate-800 p-0.5 text-xs font-mono">
            <button 
              type="button"
              (click)="selectedImpact.set('ALL')"
              [class.bg-emerald-500]="selectedImpact() === 'ALL'"
              [class.text-black]="selectedImpact() === 'ALL'"
              [class.font-bold]="selectedImpact() === 'ALL'"
              class="px-2.5 py-1 rounded-lg text-slate-300 transition-colors">
              Tous
            </button>
            <button 
              type="button"
              (click)="selectedImpact.set('HIGH')"
              [class.bg-rose-500]="selectedImpact() === 'HIGH'"
              [class.text-white]="selectedImpact() === 'HIGH'"
              [class.font-bold]="selectedImpact() === 'HIGH'"
              class="px-2.5 py-1 rounded-lg text-rose-400 transition-colors">
              Fort Impact
            </button>
            <button 
              type="button"
              (click)="selectedImpact.set('MEDIUM')"
              [class.bg-amber-500]="selectedImpact() === 'MEDIUM'"
              [class.text-black]="selectedImpact() === 'MEDIUM'"
              [class.font-bold]="selectedImpact() === 'MEDIUM'"
              class="px-2.5 py-1 rounded-lg text-amber-400 transition-colors">
              Moyen
            </button>
          </div>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- EVENTS TABLE & FEED                                          -->
      <!-- ============================================================ -->
      <div class="rounded-2xl bg-[#0e0e12] border border-slate-800 overflow-x-auto shadow-xl">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-[#141419] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
            <tr>
              <th class="p-3.5">Heure</th>
              <th class="p-3.5">Devise</th>
              <th class="p-3.5">Impact</th>
              <th class="p-3.5">Événement & Indicateur</th>
              <th class="p-3.5">Précédent</th>
              <th class="p-3.5">Consensus</th>
              <th class="p-3.5">Publié</th>
              <th class="p-3.5 text-right">Analyse & Paires</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            @for (ev of filteredEvents(); track ev.id) {
              <tr class="hover:bg-slate-800/30 transition-colors">
                <td class="p-3.5 text-slate-300 font-bold whitespace-nowrap">{{ ev.time }}</td>
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded bg-[#181822] text-slate-200 border border-slate-800 font-bold">
                    {{ ev.currency }}
                  </span>
                </td>
                <td class="p-3.5">
                  @if (ev.impact === 'HIGH') {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      FORT
                    </span>
                  } @else if (ev.impact === 'MEDIUM') {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      MOYEN
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                      FAIBLE
                    </span>
                  }
                </td>
                <td class="p-3.5 font-bold text-white">{{ ev.title }}</td>
                <td class="p-3.5 text-slate-400">{{ ev.previous }}</td>
                <td class="p-3.5 text-slate-300 font-bold">{{ ev.forecast }}</td>
                <td class="p-3.5">
                  @if (ev.actual) {
                    <span class="text-emerald-400 font-bold">{{ ev.actual }}</span>
                  } @else {
                    <span class="text-slate-400">--</span>
                  }
                </td>
                <td class="p-3.5 text-right">
                  <button 
                    type="button"
                    (click)="selectedModalEvent.set(ev)"
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold transition-colors">
                    Examiner
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Bottom Return Link -->
      <div class="text-center pt-6">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>

    </div>

    <!-- ============================================================ -->
    <!-- MODAL : EVENT MACRO DETAILS & VOLATILITY RANGE               -->
    <!-- ============================================================ -->
    @if (selectedModalEvent(); as ev) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        
        <div class="w-full max-w-lg bg-[#0e0e12] border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-5">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                {{ ev.currency }} &bull; {{ ev.time }}
              </span>
            </div>
            <button 
              type="button"
              (click)="selectedModalEvent.set(null)"
              class="p-1 text-slate-400 hover:text-white">
              <span class="mat-icon text-lg">close</span>
            </button>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">{{ ev.title }}</h3>
            <p class="text-xs text-slate-400 mt-1">Impact prévu : <strong>±{{ ev.historicalPipMove }} pips</strong> sur les paires corrélées.</p>
          </div>

          <!-- Numbers Matrix -->
          <div class="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#141419] border border-slate-800 text-xs font-mono text-center">
            <div>
              <div class="text-slate-400 text-[10px]">Précédent</div>
              <div class="text-white font-bold mt-0.5">{{ ev.previous }}</div>
            </div>
            <div>
              <div class="text-slate-400 text-[10px]">Consensus</div>
              <div class="text-cyan-400 font-bold mt-0.5">{{ ev.forecast }}</div>
            </div>
            <div>
              <div class="text-slate-400 text-[10px]">Publié</div>
              <div class="text-emerald-400 font-bold mt-0.5">{{ ev.actual || 'En attente' }}</div>
            </div>
          </div>

          <!-- AI Intelligence Analysis -->
          <div class="p-4 rounded-xl bg-[#141419] border border-slate-800 space-y-1.5 text-xs">
            <div class="font-bold text-white flex items-center gap-1.5">
              <span class="mat-icon text-emerald-400 text-sm">psychology</span>
              <span>Analyse & Consignes du Modèle IA</span>
            </div>
            <p class="text-slate-300 leading-relaxed">{{ ev.aiNote }}</p>
          </div>

          <!-- Affected Instruments -->
          <div class="space-y-1.5">
            <span class="text-[11px] font-mono text-slate-400">Paires sous surveillance accrue :</span>
            <div class="flex flex-wrap gap-1.5">
              @for (pair of ev.affectedPairs; track pair) {
                <span class="px-2.5 py-1 rounded-lg bg-[#181822] border border-slate-800 text-xs font-mono text-white">
                  {{ pair }}
                </span>
              }
            </div>
          </div>

          <div class="pt-2">
            <button 
              type="button"
              (click)="selectedModalEvent.set(null)"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">
              Fermer l'Analyse
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarService = inject(CalendarService);

  readonly availableCurrencies = ['TOUS', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  readonly selectedCurrency = signal<string>('TOUS');
  readonly selectedImpact = signal<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  readonly selectedModalEvent = signal<EconomicEvent | null>(null);

  readonly countdownSeconds = signal<number>(45);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly events = computed<EconomicEvent[]>(() => {
    const list = this.calendarService.events();
    return (list && list.length > 0) ? list : INITIAL_EVENTS;
  });

  readonly filteredEvents = computed(() => {
    const cur = this.selectedCurrency();
    const imp = this.selectedImpact();

    return this.events().filter(e => {
      if (cur !== 'TOUS' && e.currency !== cur) return false;
      if (imp !== 'ALL' && e.impact !== imp) return false;
      return true;
    });
  });

  ngOnInit() {
    this.calendarService.fetchCalendar();

    this.timer = setInterval(() => {
      this.countdownSeconds.update(s => s > 0 ? s - 1 : 59);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
