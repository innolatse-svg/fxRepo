import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MockUserStorageService } from '../services/mock-user-storage.service';

/**
 * AuthInterceptor
 * Injects Authorization Bearer token into all outgoing HTTP requests
 * Prepared for Spring Boot backend integration
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStorage = inject(MockUserStorageService);
  const currentUser = userStorage.currentUser();

  // If a user is logged in, attach simulated or real JWT token
  const token = localStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Client-Version': '1.0.0',
        'X-Client-Platform': 'Web-Angular'
      }
    });
    return next(authReq);
  }
  else if (currentUser) {
    // Fallback to mock for testing without actual login
    const mockToken = `Bearer mock-jwt-token-${currentUser.id}-${currentUser.email}`;
    const authReq = req.clone({
      setHeaders: {
        Authorization: mockToken,
        'X-Client-Version': '1.0.0',
        'X-Client-Platform': 'Web-Angular'
      }
    });
    return next(authReq);
  }

  return next(req);
};
