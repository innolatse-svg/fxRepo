import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MockUserStorageService } from './mock-user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly router = inject(Router);
  private readonly userStorage = inject(MockUserStorageService);

  readonly isSessionExpiredModalOpen = signal<boolean>(false);
  readonly sessionTimeRemainingSeconds = signal<number>(300); // 5 minutes warning when idle
  readonly lastActiveTimestamp = signal<number>(Date.now());

  constructor() {
    if (this.isBrowser) {
      this.initActivityListeners();
    }
  }

  private initActivityListeners() {
    const resetIdle = () => {
      this.lastActiveTimestamp.set(Date.now());
    };

    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle, { passive: true });
    window.addEventListener('click', resetIdle, { passive: true });
    window.addEventListener('touchstart', resetIdle, { passive: true });
  }

  triggerSessionExpired() {
    this.isSessionExpiredModalOpen.set(true);
  }

  extendSession() {
    this.isSessionExpiredModalOpen.set(false);
    this.lastActiveTimestamp.set(Date.now());
  }

  logoutAndRedirect() {
    this.isSessionExpiredModalOpen.set(false);
    this.userStorage.logout();
    this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: 'true' } });
  }
}
