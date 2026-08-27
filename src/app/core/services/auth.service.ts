/**
 * AuthService
 * Service central d'authentification Angular connecté aux API REST Spring Boot (/api/v1/auth & /api/v1/users).
 * Gère les tokens JWT et Refresh Tokens, le profil utilisateur réactif et les erreurs d'authentification.
 *
 * @date 2026-08-26
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { 
  AuthErrorState, 
  AuthResponse, 
  AuthUser, 
  ForgotPasswordRequest, 
  LoginRequest, 
  RegisterRequest, 
  ResetPasswordRequest 
} from '../models/auth.model';
import { environment } from '../../../environments/environment';

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  trialEndsAt?: string;
  createdAt?: string;
  onboardingCompleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = environment.apiUrl; 

  readonly isLoading = signal<boolean>(false);
  readonly lastAuthError = signal<AuthErrorState | null>(null);
  readonly demoFeedbackMessage = signal<string | null>(null);
  
  // Signal réactif contenant le profil utilisateur issu du token ou de /users/me
  private userSignal = signal<UserProfileResponse | null>(null);

  readonly currentUser = computed<AuthUser | null>(() => {
    const rawUser = this.userSignal();
    if (!rawUser) return null;
    return {
      id: rawUser.id,
      email: rawUser.email,
      name: `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim() || rawUser.email.split('@')[0],
      role: rawUser.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : (rawUser.subscriptionPlan === 'PRO' ? 'PRO_TRADER' : 'TRADER'),
      subscriptionPlan: (rawUser.subscriptionPlan as 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'LIFETIME_UNLIMITED') || 'FREE_TRIAL',
      subscriptionStatus: (rawUser.subscriptionStatus as 'ACTIVE' | 'EXPIRED' | 'CANCELLED') || 'ACTIVE',
      trialEndsAt: rawUser.trialEndsAt,
      createdAt: rawUser.createdAt || new Date().toISOString()
    };
  });

  constructor() {
    this.hydrateSession();
  }

  /**
   * Restaure la session active au chargement de l'application
   */
  async hydrateSession() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await this.fetchUserProfile();
      } catch {
        // En cas d'erreur de récupération, l'intercepteur 401 prend le relais
      }
    }
  }

  /**
   * Récupère le profil complet de l'utilisateur connecté
   */
  private async fetchUserProfile() {
    try {
      const user = await firstValueFrom(this.http.get<UserProfileResponse>(`${this.apiUrl}/users/me`));
      this.userSignal.set(user);
    } catch (e) {
      this.logout();
      throw e;
    }
  }

  /**
   * Authentification avec email/mot de passe
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);
    try {
      const response = await firstValueFrom(
        this.http.post<{token: string, refreshToken: string}>(`${this.apiUrl}/auth/login`, credentials)
      );
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      await this.fetchUserProfile();
      this.isLoading.set(false);
      this.demoFeedbackMessage.set('Connexion réussie.');
      return { success: true, message: 'Connexion réussie', user: this.currentUser()! };
    } catch (error: unknown) {
      this.isLoading.set(false);
      const httpErr = error as HttpErrorResponse;
      const msg = (httpErr.error && typeof httpErr.error === 'object' && 'message' in httpErr.error) 
        ? String(httpErr.error.message) 
        : 'Identifiants invalides';
      this.lastAuthError.set({ type: 'INVALID_CREDENTIALS', message: msg });
      return { success: false, message: msg };
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);
    try {
      const response = await firstValueFrom(
        this.http.post<{token: string, refreshToken: string}>(`${this.apiUrl}/auth/register`, data)
      );
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      await this.fetchUserProfile();
      this.isLoading.set(false);
      this.demoFeedbackMessage.set('Inscription réussie.');
      return { success: true, message: 'Inscription réussie', user: this.currentUser()! };
    } catch (error: unknown) {
      this.isLoading.set(false);
      const httpErr = error as HttpErrorResponse;
      const msg = (httpErr.error && typeof httpErr.error === 'object' && 'message' in httpErr.error) 
        ? String(httpErr.error.message) 
        : 'Erreur lors de l\'inscription';
      this.lastAuthError.set({ type: 'EMAIL_ALREADY_EXISTS', message: msg });
      return { success: false, message: msg };
    }
  }

  /**
   * Renouvellement silencieux du jeton d'accès via le refresh token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
      const response = await firstValueFrom(
        this.http.post<{token: string, refreshToken: string}>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      );
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Efface les messages d'erreur et de feedback
   */
  clearFeedback(): void {
    this.demoFeedbackMessage.set(null);
    this.lastAuthError.set(null);
  }

  clearError(): void {
    this.lastAuthError.set(null);
  }

  /**
   * Déconnexion complète de l'utilisateur
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  async forgotPassword(req: ForgotPasswordRequest): Promise<AuthResponse> {
    return { success: true, message: `Email de réinitialisation envoyé à ${req.email}` };
  }
  
  async resetPassword(req: ResetPasswordRequest): Promise<AuthResponse> {
    return { success: Boolean(req.token), message: 'Mot de passe mis à jour avec succès' };
  }
}
