import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NetworkService } from '../../../core/services/network.service';

@Component({
  selector: 'app-network-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @if (!networkService.isOnline() || networkService.showOfflineAlert()) {
      <div 
        id="network-offline-banner"
        class="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between shadow-lg sticky top-0 z-50 animate-in slide-in-from-top-2 duration-300">
        <div class="flex items-center gap-2.5 max-w-7xl mx-auto w-full justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-lg animate-pulse">wifi_off</span>
            <span>
              <strong>Connexion réseau interrompue.</strong> Flux de cotations en temps réel et exécutions d'ordres MT5 suspendus par sécurité.
            </span>
          </div>
          <div class="flex items-center gap-3">
            <button 
              id="retry-network-btn"
              type="button"
              (click)="networkService.checkConnectionNow()"
              class="px-2.5 py-1 rounded bg-black/30 hover:bg-black/50 text-[11px] font-bold font-mono transition-colors">
              Reconnexion
            </button>
            <button 
              id="dismiss-network-btn"
              type="button"
              (click)="networkService.dismissAlert()"
              class="text-white/80 hover:text-white"
              aria-label="Fermer l'alerte">
              <span class="mat-icon text-base">close</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class NetworkBannerComponent {
  networkService = inject(NetworkService);
}
