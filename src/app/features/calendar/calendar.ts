import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketDemoService } from '../../core/services/market-demo.service';

@Component({
  selector: 'app-calendar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto text-left">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">calendar_today</span>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Calendrier Économique Macro</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Annonces de banques centrales, IPC/CPI, PMI et filtres automatiques de volatilité.
          </p>
        </div>
        <span class="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          FILTRE AUTO ACTIF (45 MIN)
        </span>
      </div>

      <!-- Events List -->
      <div class="space-y-3">
        @for (event of marketService.upcomingEvents(); track event.id) {
          <div class="p-5 rounded-2xl bg-[#0e0e12] border border-slate-800 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="px-3 py-1.5 rounded-lg bg-[#141419] border border-slate-800 text-xs font-mono font-bold text-white">
                {{ event.time }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-white">
                    {{ event.currency }}
                  </span>
                  <h3 class="text-sm font-bold text-white">{{ event.event }}</h3>
                </div>
                <div class="text-xs text-slate-400 font-mono mt-1">
                  Prévision : <strong class="text-slate-200">{{ event.forecast }}</strong> &bull; Précédent : {{ event.previous }}
                </div>
              </div>
            </div>

            <span 
              class="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase"
              [class.bg-rose-500/10]="event.impact === 'HIGH'"
              [class.text-rose-400]="event.impact === 'HIGH'"
              [class.border]="true"
              [class.border-rose-500/30]="event.impact === 'HIGH'"
              [class.bg-amber-500/10]="event.impact === 'MEDIUM'"
              [class.text-amber-400]="event.impact === 'MEDIUM'"
              [class.border-amber-500/30]="event.impact === 'MEDIUM'">
              {{ event.impact }} IMPACT
            </span>
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
export class CalendarComponent {
  marketService = inject(MarketDemoService);
}
