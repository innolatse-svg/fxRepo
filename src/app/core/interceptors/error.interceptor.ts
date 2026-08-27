import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, from } from 'rxjs';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
          console.warn('[HTTP 401] Session expiré ou non authentifié. Tentative de refresh...');
          return from(authService.refreshToken()).pipe(
            switchMap(success => {
              if (success) {
                const token = localStorage.getItem('token');
                const cloned = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next(cloned);
              } else {
                authService.logout();
                sessionService.triggerSessionExpired();
                return throwError(() => error);
              }
            })
          );
      } else if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 403:
            console.error('[HTTP 403] Accès refusé - permissions insuffisantes');
            router.navigate(['/auth/login']);
            break;
          case 429:
            console.warn('[HTTP 429] Trop de requêtes envoyées, limitation temporaire active');
            break;
          case 500:
          case 502:
          case 503:
            console.error(`[HTTP ${error.status}] Erreur interne du serveur backend`);
            break;
          default:
            console.error('[HTTP Error]', error);
        }
      }
      return throwError(() => error);
    })
  );
};
