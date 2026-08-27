import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockUserStorageService } from '../services/mock-user-storage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userStorage = inject(MockUserStorageService);
  
  // Utilisation temporaire du currentUser mocké comme token d'authentification
  const token = userStorage.currentUser() || localStorage.getItem('token');
  
  if (token) {
    return true;
  }
  
  return router.createUrlTree(['/auth/login']);
};
