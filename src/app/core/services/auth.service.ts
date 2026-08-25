import { Injectable, signal } from '@angular/core';
import { 
  AuthErrorState, 
  AuthResponse, 
  AuthUser, 
  ForgotPasswordRequest, 
  LoginRequest, 
  RegisterRequest, 
  ResetPasswordRequest 
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive Authentication State Signals
  readonly isLoading = signal<boolean>(false);
  readonly currentUser = signal<AuthUser | null>(null);
  readonly lastAuthError = signal<AuthErrorState | null>(null);
  readonly demoFeedbackMessage = signal<string | null>(null);

  /**
   * Authenticate user with credentials.
   * Architecture prepared for future Spring Boot endpoint: POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);

    // Simulate network latency / authentication handshake for frontend demonstration
    await new Promise(resolve => setTimeout(resolve, 800));

    this.isLoading.set(false);

    const user: AuthUser = {
      id: 'demo-usr-01',
      email: credentials.email,
      name: credentials.email.split('@')[0] || 'Trader',
      role: 'PRO_TRADER',
      createdAt: new Date().toISOString()
    };

    this.currentUser.set(user);

    const response: AuthResponse = {
      success: true,
      message: `Connexion validée pour ${credentials.email}. L'intégration API Spring Boot (POST /api/auth/login) sera branchée au backend.`,
      user
    };

    this.demoFeedbackMessage.set(response.message || null);
    return response;
  }

  /**
   * Register a new user account and initiate trial.
   * Architecture prepared for future Spring Boot endpoint: POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);

    // Simulate network latency for registration flow
    await new Promise(resolve => setTimeout(resolve, 800));

    this.isLoading.set(false);

    const user: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      role: 'PRO_TRADER',
      createdAt: new Date().toISOString()
    };

    this.currentUser.set(user);

    const response: AuthResponse = {
      success: true,
      message: `Compte initié avec succès pour ${user.name} (${data.email}). Période d'essai gratuit de 15 jours activée.`,
      user
    };

    this.demoFeedbackMessage.set(response.message || null);
    return response;
  }

  /**
   * Request password reset instructions.
   * Architecture prepared for future Spring Boot endpoint: POST /api/auth/forgot-password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);

    await new Promise(resolve => setTimeout(resolve, 750));

    this.isLoading.set(false);

    const response: AuthResponse = {
      success: true,
      message: `Si un compte est associé à ${data.email}, les instructions de réinitialisation y seront transmises.`
    };

    this.demoFeedbackMessage.set(response.message || null);
    return response;
  }

  /**
   * Reset password with token.
   * Architecture prepared for future Spring Boot endpoint: POST /api/auth/reset-password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);

    await new Promise(resolve => setTimeout(resolve, 800));

    this.isLoading.set(false);

    const tokenInfo = data.token ? ` (Token validé : ${data.token.slice(0, 8)}...)` : '';
    const response: AuthResponse = {
      success: true,
      message: `Votre mot de passe a été réinitialisé avec succès.${tokenInfo}`
    };

    this.demoFeedbackMessage.set(response.message || null);
    return response;
  }

  /**
   * Helper to set simulated or API error states
   */
  setError(error: AuthErrorState | null) {
    this.lastAuthError.set(error);
  }

  /**
   * Reset feedback messages and errors
   */
  clearFeedback() {
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);
  }

  /**
   * Log out current session
   */
  logout() {
    this.currentUser.set(null);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);
  }
}

