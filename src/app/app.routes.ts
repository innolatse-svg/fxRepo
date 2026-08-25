import { Routes } from '@angular/router';

export const routes: Routes = [
  // Public Layout Shell (Landing Page)
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing').then(m => m.LandingComponent),
        title: 'FOREX INTEL — Plateforme d\'Intelligence de Marché Forex'
      }
    ]
  },

  // Authentication Layout Shell
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
        title: 'Connexion — Forex Intel'
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
        title: 'Créer un compte — Forex Intel'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent),
        title: 'Mot de passe oublié — Forex Intel'
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent),
        title: 'Réinitialisation du mot de passe — Forex Intel'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Onboarding Wizard Layout Shell
  {
    path: 'onboarding',
    loadComponent: () => import('./layout/onboarding-layout/onboarding-layout').then(m => m.OnboardingLayoutComponent),
    children: [
      {
        path: 'welcome',
        loadComponent: () => import('./features/onboarding/welcome/welcome').then(m => m.OnboardingWelcomeComponent),
        title: 'Bienvenue — Configuration de votre espace Forex Intel'
      },
      {
        path: 'trading-preferences',
        loadComponent: () => import('./features/onboarding/trading-preferences/trading-preferences').then(m => m.OnboardingTradingPreferencesComponent),
        title: 'Instruments autorisés — Forex Intel'
      },
      {
        path: 'risk-management',
        loadComponent: () => import('./features/onboarding/risk-management/risk-management').then(m => m.OnboardingRiskManagementComponent),
        title: 'Règles de risque — Forex Intel'
      },
      {
        path: 'trading-accounts',
        loadComponent: () => import('./features/onboarding/trading-accounts/trading-accounts').then(m => m.OnboardingTradingAccountsComponent),
        title: 'Comptes de trading — Forex Intel'
      },
      {
        path: 'automation',
        loadComponent: () => import('./features/onboarding/automation/automation').then(m => m.OnboardingAutomationComponent),
        title: 'Niveau d\'automatisation — Forex Intel'
      },
      {
        path: 'complete',
        loadComponent: () => import('./features/onboarding/complete/complete').then(m => m.OnboardingCompleteComponent),
        title: 'Configuration terminée — Forex Intel'
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      }
    ]
  },

  // Legal Layout Shell (Terms & Privacy)
  {
    path: 'legal',
    loadComponent: () => import('./layout/legal-layout/legal-layout').then(m => m.LegalLayoutComponent),
    children: [
      {
        path: 'terms',
        loadComponent: () => import('./features/legal/terms/terms').then(m => m.LegalTermsComponent),
        title: 'Conditions d\'utilisation — Forex Intel'
      },
      {
        path: 'privacy',
        loadComponent: () => import('./features/legal/privacy/privacy').then(m => m.LegalPrivacyComponent),
        title: 'Politique de confidentialité — Forex Intel'
      },
      {
        path: '',
        redirectTo: 'terms',
        pathMatch: 'full'
      }
    ]
  },

  // Fallback Catch-all
  {
    path: '**',
    redirectTo: ''
  }
];

