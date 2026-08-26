import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button';
import { LogoComponent } from '../../../shared/components/logo/logo';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;
  if (!confirmPassword.value) return null;

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, LogoComponent],
  template: `
    <div class="w-full max-w-5xl mx-auto py-4">
      
      <!-- Asymmetric Dual-Zone Layout for Desktop / Single-Column Responsive -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        <!-- ============================================================ -->
        <!-- ZONE A : BRANDING & OFFRE D'ESSAI (Left Column)             -->
        <!-- ============================================================ -->
        <div class="lg:col-span-5 space-y-6 text-left hidden sm:block">
          
          <!-- Platform Brand Header -->
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ESSAI GRATUIT 15 JOURS
            </div>

            <div>
              <app-logo routerLink="/" size="lg" badge="PRO"></app-logo>
            </div>
          </div>

          <!-- Value Proposition -->
          <h2 class="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Découvrez une lecture claire et rigoureuse du marché des devises.
          </h2>

          <p class="text-sm text-slate-400 leading-relaxed">
            Centralisez vos analyses techniques, vos calculs de risque et préparez vos règles de trading en toute sérénité.
          </p>

          <!-- Free Trial Feature Highlights -->
          <div class="pt-4 border-t border-slate-800/80 space-y-3">
            <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Inclus dans vos 15 jours d'accès
            </div>

            <div class="space-y-2.5">
              <div class="flex items-start gap-2.5 text-xs text-slate-300">
                <span class="mat-icon text-emerald-400 text-base flex-shrink-0">check_circle</span>
                <span>Analyse multi-timeframe sur toutes les paires Forex majeures</span>
              </div>
              <div class="flex items-start gap-2.5 text-xs text-slate-300">
                <span class="mat-icon text-emerald-400 text-base flex-shrink-0">check_circle</span>
                <span>Calculateur de risque et de taille de lot intégré</span>
              </div>
              <div class="flex items-start gap-2.5 text-xs text-slate-300">
                <span class="mat-icon text-emerald-400 text-base flex-shrink-0">check_circle</span>
                <span>Aucune carte bancaire requise pour débuter</span>
              </div>
            </div>
          </div>

          <!-- Discreet Trading Risk Warning -->
          <div class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-300/80 flex items-start gap-2">
            <span class="mat-icon text-amber-400 text-sm flex-shrink-0 mt-0.5">info</span>
            <span>Avertissement : Le trading sur devises comporte des risques significatifs de perte en capital. N'investissez que du capital que vous pouvez vous permettre de perdre.</span>
          </div>

        </div>

        <!-- ============================================================ -->
        <!-- ZONE B : FORMULAIRE D'INSCRIPTION (Right Column)             -->
        <!-- ============================================================ -->
        <div class="lg:col-span-7 w-full max-w-md mx-auto lg:max-w-none">
          
          <!-- Mobile Brand Banner -->
          <div class="sm:hidden mb-6 text-center space-y-2 flex flex-col items-center">
            <app-logo routerLink="/" size="md" badge="PRO"></app-logo>
            <p class="text-xs text-emerald-400 font-mono">
              15 jours d'accès gratuit &bull; Sans carte bancaire
            </p>
          </div>

          <!-- Main Register Card -->
          <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
            
            <!-- Top Glow Accent -->
            <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

            <!-- Header of Card -->
            <div class="mb-6 text-left">
              <h2 class="text-2xl font-bold text-white tracking-tight">
                Créez votre espace
              </h2>
              <p class="text-sm text-slate-400 mt-1">
                Commencez avec 15 jours d'accès gratuit.
              </p>
            </div>

            <!-- Demonstration / Feedback Alert Notice -->
            @if (authService.demoFeedbackMessage(); as feedback) {
              <div class="mb-5 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-3 animate-in fade-in duration-200">
                <span class="mat-icon text-emerald-400 text-lg flex-shrink-0 mt-0.5">check_circle</span>
                <div class="space-y-1">
                  <div class="font-bold text-emerald-200 uppercase tracking-wider text-[10px]">
                    Inscription Validée
                  </div>
                  <p class="text-slate-300 leading-relaxed">
                    {{ feedback }}
                  </p>
                </div>
              </div>
            }

            <!-- Server/Validation Error Banner -->
            @if (authService.lastAuthError(); as err) {
              <div class="mb-5 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3 animate-in fade-in duration-200">
                <span class="mat-icon text-rose-400 text-lg flex-shrink-0 mt-0.5">error_outline</span>
                <div class="space-y-1">
                  <div class="font-bold text-rose-200 uppercase tracking-wider text-[10px]">
                    Erreur d'inscription
                  </div>
                  <p class="text-slate-300 leading-relaxed">
                    {{ err.message }}
                  </p>
                </div>
              </div>
            }

            <!-- Reactive Register Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4" novalidate>
              
              <!-- NAME ROW (First Name & Last Name) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <!-- FIRST NAME -->
                <div class="space-y-1.5 text-left">
                  <label for="reg-firstname" class="block text-xs font-semibold text-slate-300 tracking-wide">
                    Prénom <span class="text-emerald-500">*</span>
                  </label>
                  <input
                    id="reg-firstname"
                    type="text"
                    formControlName="firstName"
                    placeholder="Votre prénom"
                    autocomplete="given-name"
                    [attr.aria-invalid]="isFieldInvalid('firstName')"
                    [attr.aria-describedby]="isFieldInvalid('firstName') ? 'firstname-error' : null"
                    [class]="inputClasses('firstName')"
                  />
                  @if (isFieldInvalid('firstName')) {
                    <div id="firstname-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5" role="alert">
                      <span class="mat-icon text-[13px]">warning</span>
                      <span>Veuillez renseigner votre prénom.</span>
                    </div>
                  }
                </div>

                <!-- LAST NAME -->
                <div class="space-y-1.5 text-left">
                  <label for="reg-lastname" class="block text-xs font-semibold text-slate-300 tracking-wide">
                    Nom <span class="text-emerald-500">*</span>
                  </label>
                  <input
                    id="reg-lastname"
                    type="text"
                    formControlName="lastName"
                    placeholder="Votre nom"
                    autocomplete="family-name"
                    [attr.aria-invalid]="isFieldInvalid('lastName')"
                    [attr.aria-describedby]="isFieldInvalid('lastName') ? 'lastname-error' : null"
                    [class]="inputClasses('lastName')"
                  />
                  @if (isFieldInvalid('lastName')) {
                    <div id="lastname-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5" role="alert">
                      <span class="mat-icon text-[13px]">warning</span>
                      <span>Veuillez renseigner votre nom.</span>
                    </div>
                  }
                </div>

              </div>

              <!-- EMAIL FIELD -->
              <div class="space-y-1.5 text-left">
                <label for="reg-email" class="block text-xs font-semibold text-slate-300 tracking-wide">
                  Adresse e-mail <span class="text-emerald-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="reg-email"
                    type="email"
                    formControlName="email"
                    placeholder="vous@exemple.com"
                    autocomplete="email"
                    [attr.aria-invalid]="isFieldInvalid('email')"
                    [attr.aria-describedby]="isFieldInvalid('email') ? 'reg-email-error' : null"
                    [class]="inputClasses('email')"
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <span class="mat-icon text-base">mail</span>
                  </div>
                </div>
                @if (isFieldInvalid('email')) {
                  <div id="reg-email-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5" role="alert">
                    <span class="mat-icon text-[13px]">warning</span>
                    <span>{{ getEmailErrorMessage() }}</span>
                  </div>
                }
              </div>

              <!-- PASSWORD FIELD -->
              <div class="space-y-1.5 text-left">
                <div class="flex items-center justify-between">
                  <label for="reg-password" class="block text-xs font-semibold text-slate-300 tracking-wide">
                    Mot de passe <span class="text-emerald-500">*</span>
                  </label>
                  <span class="text-[10px] text-slate-400 font-mono">Min. 8 caractères</span>
                </div>

                <div class="relative">
                  <input
                    id="reg-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Créez un mot de passe"
                    autocomplete="new-password"
                    [attr.aria-invalid]="isFieldInvalid('password')"
                    [attr.aria-describedby]="isFieldInvalid('password') ? 'reg-password-error' : null"
                    [class]="inputClasses('password')"
                  />
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded"
                    [attr.aria-label]="showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                    tabindex="0">
                    <span class="mat-icon text-base">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
                @if (isFieldInvalid('password')) {
                  <div id="reg-password-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5" role="alert">
                    <span class="mat-icon text-[13px]">warning</span>
                    <span>{{ getPasswordErrorMessage() }}</span>
                  </div>
                }
              </div>

              <!-- CONFIRM PASSWORD FIELD -->
              <div class="space-y-1.5 text-left">
                <label for="reg-confirm-password" class="block text-xs font-semibold text-slate-300 tracking-wide">
                  Confirmer le mot de passe <span class="text-emerald-500">*</span>
                </label>

                <div class="relative">
                  <input
                    id="reg-confirm-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="confirmPassword"
                    placeholder="Confirmez votre mot de passe"
                    autocomplete="new-password"
                    [attr.aria-invalid]="isPasswordMismatch() || isFieldInvalid('confirmPassword')"
                    [attr.aria-describedby]="isPasswordMismatch() ? 'confirm-password-error' : null"
                    [class]="inputClasses('confirmPassword')"
                  />
                </div>
                @if (isPasswordMismatch()) {
                  <div id="confirm-password-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5" role="alert">
                    <span class="mat-icon text-[13px]">warning</span>
                    <span>Les deux mots de passe ne correspondent pas.</span>
                  </div>
                } @else if (isFieldInvalid('confirmPassword')) {
                  <div class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5" role="alert">
                    <span class="mat-icon text-[13px]">warning</span>
                    <span>Veuillez confirmer votre mot de passe.</span>
                  </div>
                }
              </div>

              <!-- TERMS AND CONDITIONS CHECKBOX -->
              <div class="pt-1 text-left">
                <label for="accept-terms" class="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-300 group">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    formControlName="acceptTerms"
                    class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-[#141417] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                  />
                  <span class="leading-snug">
                    J'accepte les 
                    <a 
                      routerLink="/legal/terms" 
                      target="_blank" 
                      (click)="$event.stopPropagation()" 
                      class="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                      Conditions d'utilisation
                    </a> 
                    et la 
                    <a 
                      routerLink="/legal/privacy" 
                      target="_blank" 
                      (click)="$event.stopPropagation()" 
                      class="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                      Politique de confidentialité
                    </a>.
                  </span>
                </label>

                @if (isFieldInvalid('acceptTerms')) {
                  <div class="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-1" role="alert">
                    <span class="mat-icon text-[13px]">warning</span>
                    <span>Vous devez accepter les conditions pour créer votre compte.</span>
                  </div>
                }
              </div>

              <!-- SUBMIT BUTTON -->
              <div class="pt-3">
                <app-button
                  variant="primary"
                  size="lg"
                  type="submit"
                  [fullWidth]="true"
                  [loading]="authService.isLoading()"
                  [disabled]="authService.isLoading()">
                  Créer mon compte
                </app-button>
              </div>

            </form>

            <!-- SUB-CTA FOOTER NOTICE -->
            <div class="mt-4 text-center">
              <p class="text-[11px] text-slate-400 font-mono">
                15 jours d'accès gratuit. Aucune carte bancaire requise pour commencer.
              </p>
            </div>

            <!-- LOGIN REDIRECT -->
            <div class="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
              <span>Vous avez déjà un compte ?</span>
              <a
                routerLink="/auth/login"
                class="ml-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors focus:outline-none focus-visible:underline">
                Se connecter
              </a>
            </div>

          </div>

          <!-- DISCREET BACK TO HOME -->
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
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  showPassword = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  registerForm = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    acceptTerms: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue]
    })
  }, { validators: passwordMatchValidator });

  togglePasswordVisibility() {
    this.showPassword.update(prev => !prev);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty || this.isSubmitted());
  }

  isPasswordMismatch(): boolean {
    const confirmControl = this.registerForm.get('confirmPassword');
    const hasMismatch = this.registerForm.hasError('passwordMismatch');
    return hasMismatch && ((confirmControl?.touched && confirmControl?.dirty) || this.isSubmitted());
  }

  getEmailErrorMessage(): string {
    const control = this.registerForm.get('email');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Veuillez renseigner votre adresse e-mail.';
    if (control.errors['email']) return 'Veuillez saisir une adresse e-mail valide.';
    return 'Adresse e-mail invalide.';
  }

  getPasswordErrorMessage(): string {
    const control = this.registerForm.get('password');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Veuillez renseigner un mot de passe.';
    if (control.errors['minlength']) return 'Le mot de passe doit comporter au moins 8 caractères.';
    return 'Mot de passe invalide.';
  }

  inputClasses(fieldName: string): string {
    const isInvalid = this.isFieldInvalid(fieldName) || (fieldName === 'confirmPassword' && this.isPasswordMismatch());
    const base = 'w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#121216] text-white placeholder-slate-400 border transition-all duration-150 focus:outline-none';

    if (isInvalid) {
      return `${base} border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 bg-rose-500/[0.02]`;
    }

    return `${base} border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50`;
  }

  async onSubmit() {
    this.isSubmitted.set(true);
    this.authService.clearFeedback();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formVal = this.registerForm.getRawValue();

    // Call registration abstraction backed by MockUserStorageService
    const response = await this.authService.register({
      firstName: formVal.firstName.trim(),
      lastName: formVal.lastName.trim(),
      email: formVal.email.trim(),
      password: formVal.password,
      confirmPassword: formVal.confirmPassword,
      acceptTerms: formVal.acceptTerms
    });

    if (response.success) {
      // Advance user into Onboarding Wizard
      this.router.navigate(['/onboarding/welcome']);
    }
  }
}
