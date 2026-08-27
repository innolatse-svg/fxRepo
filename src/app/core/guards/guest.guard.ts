import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockUserStorageService } from '../services/mock-user-storage.service';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userStorage = inject(MockUserStorageService);
  
  const token = userStorage.currentUser() || localStorage.getItem('token');
  
  if (token) {
    return router.createUrlTree(['/app/dashboard']);
  }
  
  return true;
};
