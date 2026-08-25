import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-forgot-password',
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
          <!-- REQUEST FORM STATE                                           -->
          <!-- ============================================================ -->
          <div class="mb-8 text-left">
            <div class="w-10 h-10 rounded-lg bg-[#16161b] border border-slate-800 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
              <span class="mat-icon text-xl">lock_reset</span>
            </div>
            
            <h1 class="text-2xl font-bold text-white tracking-tight">
              Mot de passe oublié ?
            </h1>
            <p class="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Indiquez votre adresse e-mail et nous vous enverrons les instructions de réinitialisation.
            </p>
          </div>

          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
            
            <!-- EMAIL FIELD -->
            <div class="space-y-1.5 text-left">
              <label for="forgot-email" class="block text-xs font-semibold text-slate-300 tracking-wide">
                Adresse e-mail <span class="text-emerald-500">*</span>
              </label>
              
              <div class="relative">
                <input
                  id="forgot-email"
                  type="email"
                  formControlName="email"
                  placeholder="vous@exemple.com"
                  autocomplete="email"
                  [attr.aria-invalid]="isFieldInvalid('email')"
                  [attr.aria-describedby]="isFieldInvalid('email') ? 'forgot-email-error' : null"
                  [class]="inputClasses('email')"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <span class="mat-icon text-base">mail</span>
                </div>
              </div>

              @if (isFieldInvalid('email')) {
                <div id="forgot-email-error" class="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                  <span class="mat-icon text-[14px]">warning</span>
                  <span>{{ getEmailErrorMessage() }}</span>
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
                Envoyer les instructions
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
          <!-- SUCCESS CONFIRMATION STATE (Neutral Message)                 -->
          <!-- ============================================================ -->
          <div class="text-left space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <span class="mat-icon text-2xl">mark_email_read</span>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-bold text-white tracking-tight">
                Vérifiez votre boîte de réception
              </h2>
              <p class="text-sm text-slate-300 leading-relaxed">
                Si un compte est associé à l'adresse <strong class="text-white font-mono">{{ submittedEmail() }}</strong>, les instructions de réinitialisation pourront y être envoyées.
              </p>
            </div>

            <div class="p-4 rounded-lg bg-[#131317] border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div class="font-semibold text-slate-300">Vous ne recevez rien ?</div>
              <p>Pensez à vérifier votre dossier de courriers indésirables (spam) ou assurez-vous d'avoir saisi l'adresse exacte liée à votre compte.</p>
            </div>

            <div class="space-y-3 pt-2">
              <a routerLink="/auth/login" class="block">
                <app-button
                  variant="primary"
                  size="lg"
                  [fullWidth]="true">
                  Retour à la connexion
                </app-button>
              </a>

              <button
                type="button"
                (click)="resetForm()"
                class="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors py-2">
                Renvoyer à une autre adresse
              </button>
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
export class ForgotPasswordComponent {
  authService = inject(AuthService);

  isSubmitted = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  submittedEmail = signal<string>('');

  forgotForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  isFieldInvalid(fieldName: 'email'): boolean {
    const control = this.forgotForm.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty || this.isSubmitted());
  }

  getEmailErrorMessage(): string {
    const control = this.forgotForm.get('email');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Veuillez renseigner votre adresse e-mail.';
    if (control.errors['email']) return 'Veuillez saisir une adresse e-mail valide.';
    return 'Adresse e-mail invalide.';
  }

  inputClasses(fieldName: 'email'): string {
    const isInvalid = this.isFieldInvalid(fieldName);
    const base = 'w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#121216] text-white placeholder-slate-400 border transition-all duration-150 focus:outline-none';

    if (isInvalid) {
      return `${base} border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 bg-rose-500/[0.02]`;
    }

    return `${base} border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50`;
  }

  async onSubmit() {
    this.isSubmitted.set(true);

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotForm.getRawValue().email.trim();
    this.submittedEmail.set(email);

    // Call AuthService abstraction (ready for Spring Boot POST /api/auth/forgot-password)
    await this.authService.forgotPassword({ email });
    this.isSuccess.set(true);
  }

  resetForm() {
    this.isSuccess.set(false);
    this.isSubmitted.set(false);
    this.forgotForm.reset();
  }
}
