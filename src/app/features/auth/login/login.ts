import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="w-full max-w-5xl mx-auto">
      
      <!-- Asymmetric Dual-Zone Layout for Desktop / Single-Column Responsive -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        <!-- ============================================================ -->
        <!-- ZONE A : BRANDING & CONTEXTE PRODUIT (Left Column)           -->
        <!-- ============================================================ -->
        <div class="lg:col-span-5 space-y-6 text-left hidden sm:block">
          
          <!-- Platform Brand Header -->
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              MARKET INTELLIGENCE PLATFORM
            </div>

            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-emerald-500 rounded flex items-center justify-center font-bold text-black text-sm italic tracking-tighter shadow-md">
                FI
              </div>
              <h1 class="text-2xl font-bold tracking-tight text-white uppercase font-sans">
                Forex Intel
              </h1>
            </div>
          </div>

          <!-- Main Value Proposition Heading -->
          <h2 class="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Chaque décision commence par une meilleure lecture du marché.
          </h2>

          <!-- Short Descriptive Text -->
          <p class="text-sm text-slate-400 leading-relaxed">
            Analysez les marchés, centralisez les informations essentielles et gardez le contrôle de vos règles de trading.
          </p>

          <!-- Discreet Demonstration Status Indicators -->
          <div class="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              État du Système & Télémétrie
            </div>

            <div class="grid grid-cols-1 gap-2">
              
              <!-- Indicator 1 -->
              <div class="flex items-center justify-between p-2.5 rounded bg-[#111115] border border-slate-800/90 text-xs font-mono">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span class="font-semibold">MARKET ANALYSIS</span>
                </div>
                <span class="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <!-- Indicator 2 -->
              <div class="flex items-center justify-between p-2.5 rounded bg-[#111115] border border-slate-800/90 text-xs font-mono">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span class="font-semibold">RISK ENGINE</span>
                </div>
                <span class="text-cyan-400 font-bold text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  READY
                </span>
              </div>

              <!-- Indicator 3 -->
              <div class="flex items-center justify-between p-2.5 rounded bg-[#111115] border border-slate-800/90 text-xs font-mono">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span class="font-semibold">USER CONTROL</span>
                </div>
                <span class="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ENABLED
                </span>
              </div>

            </div>
          </div>

          <!-- Abstract Decorative Market Line -->
          <div class="pt-1 opacity-70">
            <svg class="w-full h-8 text-slate-700" viewBox="0 0 300 30" fill="none">
              <path d="M0 20 L40 22 L80 15 L120 18 L160 8 L200 12 L240 4 L280 9 L300 2" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"/>
              <circle cx="300" cy="2" r="3" fill="#10b981" />
            </svg>
          </div>

        </div>

        <!-- ============================================================ -->
        <!-- ZONE B : FORMULAIRE DE CONNEXION (Right Column)              -->
        <!-- ============================================================ -->
        <div class="lg:col-span-7 w-full max-w-md mx-auto lg:max-w-none">
          
          <!-- Mobile Brand Banner (Visible only on very small screens) -->
          <div class="sm:hidden mb-6 text-center space-y-2">
            <div class="inline-flex items-center justify-center w-10 h-10 bg-emerald-500 rounded font-bold text-black text-sm italic shadow-md">
              FI
            </div>
            <h1 class="text-xl font-bold tracking-tight text-white uppercase font-sans">
              Forex Intel
            </h1>
            <p class="text-xs text-slate-400">
              Plateforme d'Intelligence de Marché & Infrastructure Trading
            </p>
          </div>

          <!-- Main Login Card Container -->
          <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
            
            <!-- Top Card Glow Accent -->
            <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

            <!-- Header of Login Card -->
            <div class="mb-8 text-left">
              <h2 class="text-2xl font-bold text-white tracking-tight">
                Bienvenue
              </h2>
              <p class="text-sm text-slate-400 mt-1.5">
                Connectez-vous pour accéder à votre espace.
              </p>
            </div>

            <!-- Demonstration / Feedback Alert Notice -->
            @if (authService.demoFeedbackMessage(); as feedback) {
              <div class="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-3 animate-in fade-in duration-200">
                <span class="mat-icon text-emerald-400 text-lg flex-shrink-0 mt-0.5">check_circle</span>
                <div class="space-y-1">
                  <div class="font-bold text-emerald-200 uppercase tracking-wider text-[10px]">
                    Validation Frontend Réussie
                  </div>
                  <p class="text-slate-300 leading-relaxed">
                    {{ feedback }}
                  </p>
                </div>
              </div>
            }

            <!-- Server/Network Error Banner Placeholder -->
            @if (authService.lastAuthError(); as err) {
              <div class="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3 animate-in fade-in duration-200">
                <span class="mat-icon text-rose-400 text-lg flex-shrink-0 mt-0.5">error_outline</span>
                <div class="space-y-1">
                  <div class="font-bold text-rose-200 uppercase tracking-wider text-[10px]">
                    Erreur de connexion
                  </div>
                  <p class="text-slate-300 leading-relaxed">
                    {{ err.message }}
                  </p>
                </div>
              </div>
            }

            <!-- Reactive Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
              
              <!-- EMAIL FIELD -->
              <div class="space-y-1.5 text-left">
                <label for="login-email" class="block text-xs font-semibold text-slate-300 tracking-wide">
                  Adresse e-mail <span class="text-emerald-500">*</span>
                </label>
                
                <div class="relative">
                  <input
                    id="login-email"
                    type="email"
                    formControlName="email"
                    placeholder="vous@exemple.com"
                    autocomplete="email"
                    [attr.aria-invalid]="isFieldInvalid('email')"
                    [attr.aria-describedby]="isFieldInvalid('email') ? 'email-error' : null"
                    [class]="inputClasses('email')"
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <span class="mat-icon text-base">mail</span>
                  </div>
                </div>

                <!-- Email Error Messages -->
                @if (isFieldInvalid('email')) {
                  <div id="email-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5 animate-in fade-in duration-150" role="alert">
                    <span class="mat-icon text-[14px]">warning</span>
                    <span>{{ getEmailErrorMessage() }}</span>
                  </div>
                }
              </div>

              <!-- PASSWORD FIELD -->
              <div class="space-y-1.5 text-left">
                <label for="login-password" class="block text-xs font-semibold text-slate-300 tracking-wide">
                  Mot de passe <span class="text-emerald-500">*</span>
                </label>

                <div class="relative">
                  <input
                    id="login-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Votre mot de passe"
                    autocomplete="current-password"
                    [attr.aria-invalid]="isFieldInvalid('password')"
                    [attr.aria-describedby]="isFieldInvalid('password') ? 'password-error' : null"
                    [class]="inputClasses('password')"
                  />
                  
                  <!-- Show/Hide Password Toggle Button -->
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded"
                    [attr.aria-label]="showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                    tabindex="0">
                    <span class="mat-icon text-base">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>

                <!-- Password Error Messages -->
                @if (isFieldInvalid('password')) {
                  <div id="password-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5 animate-in fade-in duration-150" role="alert">
                    <span class="mat-icon text-[14px]">warning</span>
                    <span>{{ getPasswordErrorMessage() }}</span>
                  </div>
                }
              </div>

              <!-- OPTIONS ROW: REMEMBER ME & FORGOT PASSWORD -->
              <div class="flex items-center justify-between pt-1 text-xs">
                
                <!-- Remember Me Checkbox -->
                <label for="remember-me" class="flex items-center gap-2.5 cursor-pointer select-none text-slate-300 hover:text-slate-100 transition-colors group">
                  <input
                    id="remember-me"
                    type="checkbox"
                    formControlName="rememberMe"
                    class="w-4 h-4 rounded border-slate-700 bg-[#141417] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-emerald-500"
                  />
                  <span class="text-xs">Se souvenir de moi</span>
                </label>

                <!-- Forgot Password Link -->
                <a
                  routerLink="/auth/forgot-password"
                  class="text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors focus:outline-none focus-visible:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              <!-- SUBMIT BUTTON (Primary Full Width) -->
              <div class="pt-2">
                <app-button
                  variant="primary"
                  size="lg"
                  type="submit"
                  [fullWidth]="true"
                  [loading]="authService.isLoading()"
                  [disabled]="authService.isLoading()">
                  Se connecter
                </app-button>
              </div>

            </form>

            <!-- REGISTER / SIGN UP REDIRECT -->
            <div class="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
              <span>Vous n'avez pas encore de compte ?</span>
              <a
                routerLink="/auth/register"
                class="ml-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors focus:outline-none focus-visible:underline">
                Créer un compte
              </a>
            </div>

            <!-- DISCREET SECURITY BADGE NOTICE -->
            <div class="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono text-center">
              <span class="mat-icon text-emerald-400 text-sm">shield</span>
              <span>Connexion sécurisée &bull; Votre sécurité et vos données sont importantes.</span>
            </div>

          </div>

          <!-- DISCREET BACK TO HOME LINK (Below Card) -->
          <div class="mt-6 text-center">
            <a
              routerLink="/"
              class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus-visible:underline">
              <span>←</span>
              <span>Retour à l'accueil</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: ``
})
export class LoginComponent {
  authService = inject(AuthService);

  showPassword = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  // Strictly Typed Angular Reactive Form
  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    }),
    rememberMe: new FormControl<boolean>(false, {
      nonNullable: true
    })
  });

  togglePasswordVisibility() {
    this.showPassword.update(prev => !prev);
  }

  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const control = this.loginForm.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty || this.isSubmitted());
  }

  getEmailErrorMessage(): string {
    const control = this.loginForm.get('email');
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Veuillez renseigner votre adresse e-mail.';
    }
    if (control.errors['email']) {
      return 'Veuillez saisir une adresse e-mail valide.';
    }
    return 'Adresse e-mail invalide.';
  }

  getPasswordErrorMessage(): string {
    const control = this.loginForm.get('password');
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Veuillez renseigner votre mot de passe.';
    }
    if (control.errors['minlength']) {
      return 'Le mot de passe doit comporter au moins 8 caractères.';
    }
    return 'Mot de passe invalide.';
  }

  inputClasses(fieldName: 'email' | 'password'): string {
    const isInvalid = this.isFieldInvalid(fieldName);
    const base = 'w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#121216] text-white placeholder-slate-400 border transition-all duration-150 focus:outline-none';

    if (isInvalid) {
      return `${base} border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 bg-rose-500/[0.02]`;
    }

    return `${base} border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50`;
  }

  async onSubmit() {
    this.isSubmitted.set(true);
    this.authService.clearFeedback();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formVal = this.loginForm.getRawValue();
    
    // Call AuthService abstraction (ready for Spring Boot POST /api/auth/login)
    await this.authService.login({
      email: formVal.email.trim(),
      password: formVal.password,
      rememberMe: formVal.rememberMe
    });
  }
}
