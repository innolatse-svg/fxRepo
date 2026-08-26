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

  // Authenticated App Shell & Dashboard (/app)
  {
    path: 'app',
    loadComponent: () => import('./layout/authenticated-layout/authenticated-layout').then(m => m.AuthenticatedLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
        title: 'Tableau de bord — Forex Intel'
      },
      {
        path: 'market/:symbol',
        loadComponent: () => import('./features/market/market').then(m => m.MarketComponent),
        title: 'Analyse Détaillée de Marché — Forex Intel'
      },
      {
        path: 'market',
        loadComponent: () => import('./features/market/market').then(m => m.MarketComponent),
        title: 'Surveillance Marché — Forex Intel'
      },
      {
        path: 'signals',
        loadComponent: () => import('./features/signals/signals').then(m => m.SignalsComponent),
        title: 'Signaux & IA — Forex Intel'
      },
      {
        path: 'risk',
        loadComponent: () => import('./features/risk/risk').then(m => m.RiskComponent),
        title: 'Gestion du Risque — Forex Intel'
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/accounts').then(m => m.AccountsComponent),
        title: 'Comptes MT5 & Brokers — Forex Intel'
      },
      {
        path: 'backtesting',
        loadComponent: () => import('./features/backtesting/backtesting').then(m => m.BacktestingComponent),
        title: 'Laboratoire Backtesting — Forex Intel'
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/calendar/calendar').then(m => m.CalendarComponent),
        title: 'Calendrier Macro — Forex Intel'
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications').then(m => m.NotificationsComponent),
        title: 'Notifications & Alertes — Forex Intel'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then(m => m.SettingsComponent),
        title: 'Paramètres & Profil — Forex Intel'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // 404 Route & Fallback Catch-all
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFoundComponent),
    title: '404 Page Non Trouvée — Forex Intel'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFoundComponent),
    title: '404 Page Non Trouvée — Forex Intel'
  }
];

