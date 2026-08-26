import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationsService, NotificationCategory } from '../../core/services/notifications.service';

@Component({
  selector: 'app-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto text-left">
      
      <!-- ============================================================ -->
      <!-- HEADER & BULK ACTIONS                                        -->
      <!-- ============================================================ -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="mat-icon text-emerald-400 text-2xl">notifications</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Centre de Notifications & Alertes
            </h1>
            @if (notificationsService.unreadCount() > 0) {
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500 text-black">
                {{ notificationsService.unreadCount() }} non lue{{ notificationsService.unreadCount() > 1 ? 's' : '' }}
              </span>
            }
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Historique complet des signaux générés, interventions du Risk Engine, annonces macro et passerelles MT5.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button 
            id="mark-all-read-btn"
            type="button"
            (click)="notificationsService.markAllAsRead()"
            class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1">
            <span class="mat-icon text-sm text-emerald-400">done_all</span>
            <span>Tout marquer comme lu</span>
          </button>

          <button 
            id="clear-all-notifs-btn"
            type="button"
            (click)="notificationsService.clearAll()"
            class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Tout effacer">
            <span class="mat-icon text-lg">delete_sweep</span>
          </button>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- CATEGORY FILTER PILLS                                        -->
      <!-- ============================================================ -->
      <div class="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0e0e12] border border-slate-800 w-fit">
        <button 
          type="button"
          (click)="selectedCategory.set('ALL')"
          [class.bg-emerald-500]="selectedCategory() === 'ALL'"
          [class.text-black]="selectedCategory() === 'ALL'"
          [class.font-bold]="selectedCategory() === 'ALL'"
          class="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 transition-colors">
          Toutes
        </button>

        <button 
          type="button"
          (click)="selectedCategory.set('SIGNAL')"
          [class.bg-emerald-500]="selectedCategory() === 'SIGNAL'"
          [class.text-black]="selectedCategory() === 'SIGNAL'"
          [class.font-bold]="selectedCategory() === 'SIGNAL'"
          class="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5">
          <span class="mat-icon text-sm text-emerald-400">psychology</span>
          <span>Signaux IA</span>
        </button>

        <button 
          type="button"
          (click)="selectedCategory.set('RISK')"
          [class.bg-emerald-500]="selectedCategory() === 'RISK'"
          [class.text-black]="selectedCategory() === 'RISK'"
          [class.font-bold]="selectedCategory() === 'RISK'"
          class="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5">
          <span class="mat-icon text-sm text-amber-400">shield</span>
          <span>Risk Engine</span>
        </button>

        <button 
          type="button"
          (click)="selectedCategory.set('CALENDAR')"
          [class.bg-emerald-500]="selectedCategory() === 'CALENDAR'"
          [class.text-black]="selectedCategory() === 'CALENDAR'"
          [class.font-bold]="selectedCategory() === 'CALENDAR'"
          class="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5">
          <span class="mat-icon text-sm text-cyan-400">calendar_month</span>
          <span>Macro & News</span>
        </button>

        <button 
          type="button"
          (click)="selectedCategory.set('SYSTEM')"
          [class.bg-emerald-500]="selectedCategory() === 'SYSTEM'"
          [class.text-black]="selectedCategory() === 'SYSTEM'"
          [class.font-bold]="selectedCategory() === 'SYSTEM'"
          class="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5">
          <span class="mat-icon text-sm text-indigo-400">dns</span>
          <span>Système & MT5</span>
        </button>
      </div>

      <!-- ============================================================ -->
      <!-- NOTIFICATIONS LIST                                           -->
      <!-- ============================================================ -->
      @if (filteredList().length === 0) {
        <div class="p-12 rounded-2xl bg-[#0e0e12] border border-slate-800 text-center space-y-3">
          <span class="mat-icon text-4xl text-slate-400">notifications_off</span>
          <h3 class="text-base font-bold text-white">Aucune notification dans cette catégorie</h3>
          <p class="text-xs text-slate-400">
            Toutes les alertes système et alertes de confluence ont été traitées.
          </p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (notif of filteredList(); track notif.id) {
            <div 
              class="p-5 rounded-2xl bg-[#0e0e12] border transition-all text-left space-y-3 relative overflow-hidden"
              [class.border-emerald-500/40]="!notif.read"
              [class.border-slate-800]="notif.read">
              
              @if (!notif.read) {
                <div class="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500"></div>
              }

              <!-- Notification Top Row -->
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div 
                    class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    [class.bg-emerald-500/15]="notif.category === 'SIGNAL'"
                    [class.text-emerald-400]="notif.category === 'SIGNAL'"
                    [class.bg-amber-500/15]="notif.category === 'RISK'"
                    [class.text-amber-400]="notif.category === 'RISK'"
                    [class.bg-cyan-500/15]="notif.category === 'CALENDAR'"
                    [class.text-cyan-400]="notif.category === 'CALENDAR'"
                    [class.bg-indigo-500/15]="notif.category === 'SYSTEM'"
                    [class.text-indigo-400]="notif.category === 'SYSTEM'">
                    <span class="mat-icon text-lg">
                      {{ getCategoryIcon(notif.category) }}
                    </span>
                  </div>

                  <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="text-sm font-bold text-white tracking-tight">{{ notif.title }}</h4>
                      
                      @if (notif.priority === 'HIGH') {
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          PRIORITÉ HAUTE
                        </span>
                      }
                      
                      @if (!notif.read) {
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                      }
                    </div>

                    <p class="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {{ notif.message }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-[11px] font-mono text-slate-400">{{ notif.timestamp }}</span>
                  <button 
                    type="button"
                    (click)="notificationsService.deleteNotification(notif.id)"
                    class="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                    title="Supprimer">
                    <span class="mat-icon text-base">close</span>
                  </button>
                </div>
              </div>

              <!-- Action Link & Mark Read -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  @if (notif.actionUrl) {
                    <a 
                      [routerLink]="notif.actionUrl"
                      (click)="notificationsService.markAsRead(notif.id)"
                      class="text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                      <span>{{ notif.actionLabel || 'Consulter les détails' }}</span>
                      <span class="mat-icon text-xs">arrow_forward</span>
                    </a>
                  }
                </div>

                @if (!notif.read) {
                  <button 
                    type="button"
                    (click)="notificationsService.markAsRead(notif.id)"
                    class="text-[11px] text-slate-400 hover:text-white transition-colors">
                    Marquer comme lu
                  </button>
                }
              </div>

            </div>
          }
        </div>
      }

      <!-- Bottom Return Link -->
      <div class="text-center pt-6">
        <a routerLink="/app/dashboard" class="text-xs text-emerald-400 hover:underline">
          ← Retourner au Dashboard principal
        </a>
      </div>

    </div>
  `
})
export class NotificationsComponent {
  notificationsService = inject(NotificationsService);

  readonly selectedCategory = signal<string>('ALL');

  readonly filteredList = computed(() => {
    const all = this.notificationsService.notifications();
    const cat = this.selectedCategory();
    if (cat === 'ALL') return all;
    return all.filter(n => n.category === cat);
  });

  getCategoryIcon(cat: NotificationCategory): string {
    switch (cat) {
      case 'SIGNAL': return 'psychology';
      case 'RISK': return 'shield';
      case 'CALENDAR': return 'calendar_month';
      case 'SYSTEM': return 'dns';
    }
  }
}
