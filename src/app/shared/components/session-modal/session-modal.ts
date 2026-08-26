import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-session-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @if (sessionService.isSessionExpiredModalOpen()) {
      <div 
        id="session-expired-modal-backdrop"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        
        <div 
          id="session-expired-modal"
          class="w-full max-w-md bg-[#0e0e12] border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-5 relative overflow-hidden">
          
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500"></div>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <span class="mat-icon text-2xl">timer</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-tight">Session Expirée ou Inactive</h3>
              <p class="text-xs text-slate-400">Votre jeton d'authentification de sécurité a expiré.</p>
            </div>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed">
            Pour garantir la protection de vos clés brokers MT5 et de vos règles de risque, la plateforme verrouille l'interface après une période d'inactivité.
          </p>

          <div class="p-3 rounded-xl bg-[#141419] border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400">Statut du compte :</span>
            <span class="text-amber-400 font-bold">Verrouillé temporairement</span>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button 
              id="session-logout-btn"
              type="button"
              (click)="sessionService.logoutAndRedirect()"
              class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
              Se déconnecter
            </button>
            <button 
              id="session-extend-btn"
              type="button"
              (click)="sessionService.extendSession()"
              class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20">
              Prolonger la session
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class SessionModalComponent {
  sessionService = inject(SessionService);
}
