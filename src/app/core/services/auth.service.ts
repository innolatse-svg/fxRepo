import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  AuthErrorState, 
  AuthResponse, 
  AuthUser, 
  ForgotPasswordRequest, 
  LoginRequest, 
  RegisterRequest, 
  ResetPasswordRequest 
} from '../models/auth.model';
import { MockUserStorageService } from './mock-user-storage.service';
import { MockUserRecord } from '../models/user-storage.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userStorage = inject(MockUserStorageService);

  // Reactive Authentication State Signals
  readonly isLoading = signal<boolean>(false);
  readonly lastAuthError = signal<AuthErrorState | null>(null);
  readonly demoFeedbackMessage = signal<string | null>(null);

  // Computed signal directly backed by MockUserStorageService
  readonly currentUser = computed<AuthUser | null>(() => {
    const rawUser = this.userStorage.currentUser();
    if (!rawUser) return null;
    return this.mapMockUserToAuthUser(rawUser);
  });

  // Access the raw MockUserRecord if needed
  readonly currentMockUser = computed<MockUserRecord | null>(() => {
    return this.userStorage.currentUser();
  });

  /**
   * Helper to map MockUserRecord into AuthUser
   */
  private mapMockUserToAuthUser(mockUser: MockUserRecord): AuthUser {
    return {
      id: mockUser.id,
      email: mockUser.email,
      name: `${mockUser.firstName} ${mockUser.lastName}`.trim() || mockUser.email.split('@')[0],
      role: mockUser.subscription.plan === 'PRO' || mockUser.subscription.plan === 'PREMIUM' ? 'PRO_TRADER' : 'TRADER',
      createdAt: mockUser.createdAt
    };
  }

  /**
   * Authenticate user with credentials using MockUserStorageService.
   * Architecture prepared for future Spring Boot endpoint: POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);

    // Simulate short network latency for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    this.isLoading.set(false);

    const result = this.userStorage.login(credentials.email, credentials.password);

    if (!result.success || !result.user) {
      const errorMsg = result.error || 'Identifiants invalides';
      this.lastAuthError.set({
        type: 'INVALID_CREDENTIALS',
        message: errorMsg
      });
      return {
        success: false,
        message: errorMsg
      };
    }

    const authUser = this.mapMockUserToAuthUser(result.user);

    const response: AuthResponse = {
      success: true,
      message: `Connexion réussie pour ${authUser.name} (${authUser.email}).`,
      user: authUser
    };

    this.demoFeedbackMessage.set(response.message || null);
    return response;
  }

  /**
   * Register a new user account and initiate trial in MockUserStorageService.
   * Architecture prepared for future Spring Boot endpoint: POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    this.isLoading.set(true);
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);

    // Simulate short network latency for registration flow
    await new Promise(resolve => setTimeout(resolve, 600));

    this.isLoading.set(false);

    const result = this.userStorage.register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password
    });

    if (!result.success || !result.user) {
      const errorMsg = result.error || 'Cet e-mail est déjà utilisé';
      this.lastAuthError.set({
        type: 'EMAIL_ALREADY_EXISTS',
        message: errorMsg
      });
      return {
        success: false,
        message: errorMsg
      };
    }

    const authUser = this.mapMockUserToAuthUser(result.user);

    const response: AuthResponse = {
      success: true,
      message: `Compte initié avec succès pour ${authUser.name} (${data.email}). Période d'essai gratuit de 15 jours activée.`,
      user: authUser
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

    await new Promise(resolve => setTimeout(resolve, 500));

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

    await new Promise(resolve => setTimeout(resolve, 500));

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
    this.userStorage.logout();
    this.lastAuthError.set(null);
    this.demoFeedbackMessage.set(null);
  }
}

