import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;
  if (!confirmPassword.value) return null;

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="w-full max-w-lg mx-auto py-6">
      
      <!-- Main Card -->
      <div class="relative bg-[#0d0d10] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        <!-- Top Glow Accent -->
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        @if (!isSuccess()) {
          <!-- ============================================================ -->
          <!-- RESET FORM STATE                                             -->
          <!-- ============================================================ -->
          <div class="mb-8 text-left">
            <div class="w-10 h-10 rounded-lg bg-[#16161b] border border-slate-800 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
              <span class="mat-icon text-xl">key</span>
            </div>

            <h1 class="text-2xl font-bold text-white tracking-tight">
              Créez un nouveau mot de passe
            </h1>
            <p class="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Choisissez un nouveau mot de passe sécurisé pour votre compte.
            </p>
          </div>

          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
            
            <!-- NEW PASSWORD FIELD -->
            <div class="space-y-1.5 text-left">
              <div class="flex items-center justify-between">
                <label for="reset-password" class="block text-xs font-semibold text-slate-300 tracking-wide">
                  Nouveau mot de passe <span class="text-emerald-500">*</span>
                </label>
                <span class="text-[10px] text-slate-400 font-mono">Min. 8 caractères</span>
              </div>

              <div class="relative">
                <input
                  id="reset-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Nouveau mot de passe"
                  autocomplete="new-password"
                  [attr.aria-invalid]="isFieldInvalid('password')"
                  [attr.aria-describedby]="isFieldInvalid('password') ? 'reset-pwd-error' : null"
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
                <div id="reset-pwd-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                  <span class="mat-icon text-[14px]">warning</span>
                  <span>{{ getPasswordErrorMessage() }}</span>
                </div>
              }
            </div>

            <!-- CONFIRM NEW PASSWORD FIELD -->
            <div class="space-y-1.5 text-left">
              <label for="reset-confirm-password" class="block text-xs font-semibold text-slate-300 tracking-wide">
                Confirmer le nouveau mot de passe <span class="text-emerald-500">*</span>
              </label>

              <div class="relative">
                <input
                  id="reset-confirm-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  placeholder="Confirmez le nouveau mot de passe"
                  autocomplete="new-password"
                  [attr.aria-invalid]="isPasswordMismatch() || isFieldInvalid('confirmPassword')"
                  [attr.aria-describedby]="isPasswordMismatch() ? 'reset-confirm-error' : null"
                  [class]="inputClasses('confirmPassword')"
                />
              </div>

              @if (isPasswordMismatch()) {
                <div id="reset-confirm-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                  <span class="mat-icon text-[14px]">warning</span>
                  <span>Les deux mots de passe ne correspondent pas.</span>
                </div>
              } @else if (isFieldInvalid('confirmPassword')) {
                <div class="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                  <span class="mat-icon text-[14px]">warning</span>
                  <span>Veuillez confirmer votre mot de passe.</span>
                </div>
              }
            </div>

            <!-- SUBMIT BUTTON -->
            <div class="pt-2">
              <app-button
                variant="primary"
                size="lg"
                type="submit"
                [fullWidth]="true"
                [loading]="authService.isLoading()"
                [disabled]="authService.isLoading()">
                Mettre à jour le mot de passe
              </app-button>
            </div>

          </form>

          <!-- BACK TO LOGIN -->
          <div class="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <a
              routerLink="/auth/login"
              class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium focus:outline-none focus-visible:underline">
              <span>←</span>
              <span>Retour à la connexion</span>
            </a>
          </div>

        } @else {
          <!-- ============================================================ -->
          <!-- SUCCESS STATE                                                -->
          <!-- ============================================================ -->
          <div class="text-left space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <span class="mat-icon text-2xl">verified_user</span>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-bold text-white tracking-tight">
                Mot de passe mis à jour
              </h2>
              <p class="text-sm text-slate-300 leading-relaxed">
                Votre nouveau mot de passe a été configuré avec succès. Vous pouvez maintenant vous connecter à votre espace.
              </p>
            </div>

            <div class="pt-3">
              <a routerLink="/auth/login" class="block">
                <app-button
                  variant="primary"
                  size="lg"
                  [fullWidth]="true">
                  Se connecter
                </app-button>
              </a>
            </div>

          </div>
        }

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
  `,
  styles: ``
})
export class ResetPasswordComponent implements OnInit {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  showPassword = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  token = signal<string | null>(null);

  resetForm = new FormGroup({
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  }, { validators: passwordMatchValidator });

  ngOnInit() {
    // Read optional token query param for future backend authentication
    this.route.queryParamMap.subscribe(params => {
      const t = params.get('token');
      if (t) {
        this.token.set(t);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(prev => !prev);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.resetForm.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty || this.isSubmitted());
  }

  isPasswordMismatch(): boolean {
    const confirmControl = this.resetForm.get('confirmPassword');
    const hasMismatch = this.resetForm.hasError('passwordMismatch');
    return hasMismatch && ((confirmControl?.touched && confirmControl?.dirty) || this.isSubmitted());
  }

  getPasswordErrorMessage(): string {
    const control = this.resetForm.get('password');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Veuillez renseigner un nouveau mot de passe.';
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

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const formVal = this.resetForm.getRawValue();

    // Call AuthService abstraction (ready for Spring Boot POST /api/auth/reset-password)
    await this.authService.resetPassword({
      token: this.token() || undefined,
      password: formVal.password,
      confirmPassword: formVal.confirmPassword
    });

    this.isSuccess.set(true);
  }
}
