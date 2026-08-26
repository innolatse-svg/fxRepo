import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';

/**
 * ErrorInterceptor
 * Global HTTP Error handling for 401 Unauthorized, 403 Forbidden, 429 Rate Limit, and 500 Server Errors
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Token expired or invalid -> trigger session timeout modal
            console.warn('[HTTP 401] Session expiré ou non authentifié');
            sessionService.triggerSessionExpired();
            break;
          case 403:
            // Forbidden access
            console.error('[HTTP 403] Accès refusé - permissions insuffisantes');
            break;
          case 429:
            // Rate limiting from Spring Boot backend
            console.warn('[HTTP 429] Trop de requêtes envoyées, limitation temporaire active');
            break;
          case 500:
          case 502:
          case 503:
            // Server error
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
