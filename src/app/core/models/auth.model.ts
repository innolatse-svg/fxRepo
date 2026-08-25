export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'TRADER' | 'PRO_TRADER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

export type AuthErrorType = 
  | 'INVALID_CREDENTIALS' 
  | 'ACCOUNT_NOT_FOUND' 
  | 'ACCOUNT_LOCKED' 
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_TOKEN'
  | 'SERVER_ERROR' 
  | 'NETWORK_ERROR' 
  | 'UNKNOWN';

export interface AuthErrorState {
  type: AuthErrorType;
  message: string;
}

