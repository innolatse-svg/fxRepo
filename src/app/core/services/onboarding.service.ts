import { Injectable, signal, computed } from '@angular/core';
import { 
  AutomationLevelDetails, 
  ForexPairOption, 
  OnboardingState, 
  RiskPreferences, 
  TradingAccountOption, 
  TradingPreferences, 
  AutomationPreferences 
} from '../models/onboarding.model';

export const DEFAULT_FOREX_PAIRS: ForexPairOption[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'MAJORS', description: 'La paire la plus liquide du marché mondial', spreadAvgPips: 0.2 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'MAJORS', description: 'Volatilité active, session de Londres / NY', spreadAvgPips: 0.6 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'MAJORS', description: 'Sensible aux taux et aux flux asiatiques', spreadAvgPips: 0.4 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'MAJORS', description: 'Actif refuge européen historique', spreadAvgPips: 0.8 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'MAJORS', description: 'Devise liée aux matières premières et Chine', spreadAvgPips: 0.5 },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'MAJORS', description: 'Forte corrélation avec le pétrole brut WTI', spreadAvgPips: 0.7 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'MAJORS', description: 'Haut rendement océanien et cycles agricoles', spreadAvgPips: 0.9 },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'MINORS', description: 'Flux économiques de la zone transmanche', spreadAvgPips: 0.8 },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'MINORS', description: 'Croisement à haute vélocité intraday', spreadAvgPips: 0.9 },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'MINORS', description: 'Paire à fort range moyen journalier (Dragon)', spreadAvgPips: 1.2 }
];

export const OTHER_UPCOMING_INSTRUMENTS = [
  { symbol: 'XAU/USD', name: 'Gold Spot', type: 'COMMODITIES', note: 'Disponible au Level 3+' },
  { symbol: 'US30', name: 'Dow Jones Index', type: 'INDICES', note: 'Intégration Pro' },
  { symbol: 'NAS100', name: 'Nasdaq Index', type: 'INDICES', note: 'Intégration Pro' },
  { symbol: 'BTC/USD', name: 'Bitcoin Spot', type: 'CRYPTO', note: 'Intégration Pro' }
];

export const AUTOMATION_LEVELS: AutomationLevelDetails[] = [
  {
    level: 1,
    title: 'Analyse Uniquement',
    badge: 'NIVEAU 1',
    badgeColor: 'emerald',
    description: 'La plateforme analyse les structures de marché, détecte les tendances multi-timeframe et centralise vos indicateurs clés.',
    executionMode: 'Lecteur seul & Dashboard décisionnel',
    isAvailableNow: true
  },
  {
    level: 2,
    title: 'Signaux Assistés',
    badge: 'NIVEAU 2',
    badgeColor: 'cyan',
    description: 'Alertes en temps réel sur configurations validées (Order Blocks, FVG, Breakouts) selon vos propres filtres de risque.',
    executionMode: 'Notifications & Recommandations de dimensionnement',
    isAvailableNow: true
  },
  {
    level: 3,
    title: 'Paper Trading Virtuel',
    badge: 'NIVEAU 3',
    badgeColor: 'indigo',
    description: 'Testez vos règles de trading et la vitesse d\'exécution dans un environnement de marché simulé sans risque en capital réel.',
    executionMode: 'Simulation complète in-app',
    isAvailableNow: true
  },
  {
    level: 4,
    title: 'Automatisation Démo',
    badge: 'NIVEAU 4',
    badgeColor: 'amber',
    description: 'Routage automatique des ordres sur votre compte broker MT5 de démonstration avec respect absolu du Risk Engine.',
    executionMode: 'Passerelle MT5 Sandbox (Fonctionnalité Pro)',
    isAvailableNow: false,
    statusNote: 'Selon connecteur broker'
  },
  {
    level: 5,
    title: 'Automatisation Contrôlée (Live)',
    badge: 'NIVEAU 5',
    badgeColor: 'rose',
    description: 'Exécution d\'ordres sur compte réel strictement bornée par vos limites de perte quotidienne et vos paires autorisées.',
    executionMode: 'Passerelle MT5 Live & Protection Hard Stop',
    isAvailableNow: false,
    statusNote: 'Nécessite passerelle configurée'
  }
];

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStepIndex: 1,
  tradingPreferences: {
    authorizedForexPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD'],
    otherInstruments: []
  },
  riskPreferences: {
    maxRiskPerTradePct: 1.0,
    maxDailyLossPct: 3.0,
    maxOpenPositions: 3,
    maxSimultaneousExposurePct: 6.0
  },
  tradingAccounts: [
    {
      id: 'acc-demo-preview',
      brokerName: 'IC Markets / Pepperstone (Exemple)',
      server: 'ICMarketsSC-Demo02',
      accountNumber: '8942105',
      accountType: 'DEMO',
      status: 'SAMPLE',
      activeForExecution: false,
      currency: 'USD',
      balanceDemo: 10000
    }
  ],
  automationPreferences: {
    selectedLevel: 1,
    manualConfirmationRequired: true,
    maxDailyTradesAllowed: 4
  },
  isCompleted: false
};

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  // In-memory reactive state signal
  readonly state = signal<OnboardingState>(INITIAL_ONBOARDING_STATE);

  // Computed properties
  readonly currentStep = computed(() => this.state().currentStepIndex);
  readonly tradingPreferences = computed(() => this.state().tradingPreferences);
  readonly riskPreferences = computed(() => this.state().riskPreferences);
  readonly tradingAccounts = computed(() => this.state().tradingAccounts);
  readonly automationPreferences = computed(() => this.state().automationPreferences);
  readonly isCompleted = computed(() => this.state().isCompleted);

  /**
   * Update Trading Preferences
   */
  setTradingPreferences(prefs: Partial<TradingPreferences>) {
    this.state.update(current => ({
      ...current,
      tradingPreferences: {
        ...current.tradingPreferences,
        ...prefs
      }
    }));
  }

  /**
   * Toggle Forex Pair authorization
   */
  togglePair(symbol: string) {
    this.state.update(current => {
      const existing = current.tradingPreferences.authorizedForexPairs;
      const isSelected = existing.includes(symbol);
      const updated = isSelected 
        ? existing.filter(p => p !== symbol)
        : [...existing, symbol];
      
      return {
        ...current,
        tradingPreferences: {
          ...current.tradingPreferences,
          authorizedForexPairs: updated
        }
      };
    });
  }

  /**
   * Select all standard forex pairs
   */
  selectAllPairs() {
    this.state.update(current => ({
      ...current,
      tradingPreferences: {
        ...current.tradingPreferences,
        authorizedForexPairs: DEFAULT_FOREX_PAIRS.map(p => p.symbol)
      }
    }));
  }

  /**
   * Clear all selected pairs
   */
  clearAllPairs() {
    this.state.update(current => ({
      ...current,
      tradingPreferences: {
        ...current.tradingPreferences,
        authorizedForexPairs: []
      }
    }));
  }

  /**
   * Update Risk Preferences
   */
  setRiskPreferences(risk: Partial<RiskPreferences>) {
    this.state.update(current => ({
      ...current,
      riskPreferences: {
        ...current.riskPreferences,
        ...risk
      }
    }));
  }

  /**
   * Update Automation Preferences
   */
  setAutomationPreferences(auto: Partial<AutomationPreferences>) {
    this.state.update(current => ({
      ...current,
      automationPreferences: {
        ...current.automationPreferences,
        ...auto
      }
    }));
  }

  /**
   * Add a demo trading account
   */
  addDemoAccount(account: Omit<TradingAccountOption, 'id'>) {
    const newAcc: TradingAccountOption = {
      ...account,
      id: `acc-${Date.now().toString(36)}`
    };

    this.state.update(current => ({
      ...current,
      tradingAccounts: [...current.tradingAccounts, newAcc]
    }));
  }

  /**
   * Set current step index
   */
  setStep(index: number) {
    this.state.update(current => ({
      ...current,
      currentStepIndex: index
    }));
  }

  /**
   * Mark onboarding as completed
   */
  completeOnboarding() {
    this.state.update(current => ({
      ...current,
      isCompleted: true,
      completedAt: new Date().toISOString()
    }));
  }

  /**
   * Reset onboarding state back to initial defaults
   */
  reset() {
    this.state.set(INITIAL_ONBOARDING_STATE);
  }
}
