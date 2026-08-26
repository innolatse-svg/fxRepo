import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isOnline = signal<boolean>(true);
  readonly status = signal<ConnectionStatus>('ONLINE');
  readonly pingLatencyMs = signal<number>(24);
  readonly lastOnlineTime = signal<Date>(new Date());
  readonly showOfflineAlert = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      this.isOnline.set(navigator.onLine);
      this.status.set(navigator.onLine ? 'ONLINE' : 'OFFLINE');
      this.showOfflineAlert.set(!navigator.onLine);

      window.addEventListener('online', () => {
        this.isOnline.set(true);
        this.status.set('ONLINE');
        this.lastOnlineTime.set(new Date());
        this.showOfflineAlert.set(false);
      });

      window.addEventListener('offline', () => {
        this.isOnline.set(false);
        this.status.set('OFFLINE');
        this.showOfflineAlert.set(true);
      });

      // Periodically simulate ping check (15 - 35 ms)
      setInterval(() => {
        if (this.isOnline()) {
          const jitter = Math.floor(18 + Math.random() * 16);
          this.pingLatencyMs.set(jitter);
        }
      }, 5000);
    }
  }

  dismissAlert() {
    this.showOfflineAlert.set(false);
  }

  checkConnectionNow(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isBrowser) {
        resolve(true);
        return;
      }
      const online = navigator.onLine;
      this.isOnline.set(online);
      this.status.set(online ? 'ONLINE' : 'OFFLINE');
      this.showOfflineAlert.set(!online);
      resolve(online);
    });
  }
}
