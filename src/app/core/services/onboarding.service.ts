import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  AutomationLevel,
  AutomationLevelDetails, 
  ForexPairOption, 
  OnboardingState, 
  RiskPreferences, 
  TradingAccountOption, 
  TradingPreferences, 
  AutomationPreferences 
} from '../models/onboarding.model';
import { MockUserStorageService } from './mock-user-storage.service';
import { AutomationLevelCode, MockUserAccountRecord, MockUserPreferences } from '../models/user-storage.model';

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
  { symbol: 'XAU/USD', name: 'Gold Spot / Dollar', type: 'MÉTAUX', note: 'Or au comptant & métal refuge', spreadAvg: '1.5 pts', ready: true },
  { symbol: 'XAG/USD', name: 'Silver Spot / Dollar', type: 'MÉTAUX', note: 'Argent métal haute vélocité', spreadAvg: '2.0 pts', ready: true },
  { symbol: 'US30', name: 'Dow Jones Industrial 30', type: 'INDICES', note: 'Indice Wall Street majeur', spreadAvg: '2.0 pts', ready: true },
  { symbol: 'NAS100', name: 'Nasdaq 100 Tech', type: 'INDICES', note: 'Grandes capitalisations tech US', spreadAvg: '1.2 pts', ready: true },
  { symbol: 'GER40', name: 'DAX 40 Allemagne', type: 'INDICES', note: 'Indice de référence européen', spreadAvg: '1.0 pt', ready: true },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', type: 'CRYPTO', note: 'Actif numérique haute volatilité', spreadAvg: '15 pts', ready: true },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', type: 'CRYPTO', note: 'Smart contracts & DeFi liquidité', spreadAvg: '1.8 pts', ready: true },
  { symbol: 'WTI/USD', name: 'US Oil (Crude WTI)', type: 'COMMODITIES', note: 'Pétrole brut américain', spreadAvg: '3.0 pts', ready: true }
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
    authorizedForexPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
    otherInstruments: []
  },
  riskPreferences: {
    maxRiskPerTradePct: 1.0,
    maxDailyLossPct: 3.0,
    maxOpenPositions: 3,
    maxSimultaneousExposurePct: 4.0
  },
  tradingAccounts: [
    {
      id: 'acc-deriv-01',
      brokerName: 'Deriv / MT5 Sandbox',
      server: 'Deriv-Demo',
      accountNumber: '5082194',
      accountType: 'DEMO',
      status: 'CONNECTED',
      activeForExecution: true,
      currency: 'USD',
      balanceDemo: 10000
    }
  ],
  automationPreferences: {
    selectedLevel: 2,
    manualConfirmationRequired: true,
    maxDailyTradesAllowed: 4
  },
  isCompleted: false
};

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private userStorage = inject(MockUserStorageService);

  // In-memory reactive state signal
  readonly state = signal<OnboardingState>(INITIAL_ONBOARDING_STATE);

  // Computed properties
  readonly currentStep = computed(() => this.state().currentStepIndex);
  readonly tradingPreferences = computed(() => this.state().tradingPreferences);
  readonly riskPreferences = computed(() => this.state().riskPreferences);
  readonly tradingAccounts = computed(() => this.state().tradingAccounts);
  readonly automationPreferences = computed(() => this.state().automationPreferences);
  readonly isCompleted = computed(() => this.state().isCompleted);

  constructor() {
    this.loadFromUserStorage();
  }

  /**
   * Load active user preferences from MockUserStorageService
   */
  loadFromUserStorage() {
    const user = this.userStorage.getActiveUser();
    if (!user) return;

    const prefs = user.preferences;
    if (!prefs) return;

    // Convert level code to number
    let levelNum: AutomationLevel = 2;
    if (prefs.automation.level === 'ANALYSIS') levelNum = 1;
    else if (prefs.automation.level === 'SIGNALS') levelNum = 2;
    else if (prefs.automation.level === 'PAPER_TRADING') levelNum = 3;
    else if (prefs.automation.level === 'DEMO_AUTO') levelNum = 4;
    else if (prefs.automation.level === 'LIVE_AUTO') levelNum = 5;

    const accounts: TradingAccountOption[] = (prefs.tradingAccounts || []).map(acc => ({
      id: acc.id,
      brokerName: acc.broker,
      server: acc.server,
      accountNumber: acc.accountNumber,
      accountType: acc.environment,
      status: 'CONNECTED',
      activeForExecution: acc.tradingEnabled,
      currency: 'USD',
      balanceDemo: 10000
    }));

    this.state.set({
      currentStepIndex: user.onboardingCompleted ? 6 : 1,
      tradingPreferences: {
        authorizedForexPairs: prefs.selectedPairs?.length ? prefs.selectedPairs : ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        otherInstruments: []
      },
      riskPreferences: {
        maxRiskPerTradePct: prefs.riskRules?.riskPerTradePercent ?? 1.0,
        maxDailyLossPct: prefs.riskRules?.maxDailyLossPercent ?? 3.0,
        maxOpenPositions: prefs.riskRules?.maxOpenPositions ?? 3,
        maxSimultaneousExposurePct: prefs.riskRules?.maxExposurePercent ?? 4.0,
        newsFilterActive: prefs.riskRules?.newsFilterActive ?? true,
        weekendLockActive: prefs.riskRules?.weekendLockActive ?? false
      },
      tradingAccounts: accounts.length > 0 ? accounts : INITIAL_ONBOARDING_STATE.tradingAccounts,
      automationPreferences: {
        selectedLevel: levelNum,
        manualConfirmationRequired: prefs.automation?.manualConfirmation ?? true,
        maxDailyTradesAllowed: prefs.automation?.maxDailyTrades ?? 4
      },
      isCompleted: user.onboardingCompleted
    });
  }

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
   * Toggle Other Option Instrument authorization (Metals, Indices, Crypto)
   */
  toggleOtherInstrument(symbol: string) {
    this.state.update(current => {
      const existing = current.tradingPreferences.otherInstruments || [];
      const isSelected = existing.includes(symbol);
      const updated = isSelected 
        ? existing.filter(p => p !== symbol)
        : [...existing, symbol];
      
      return {
        ...current,
        tradingPreferences: {
          ...current.tradingPreferences,
          otherInstruments: updated
        }
      };
    });
  }

  /**
   * Select all other option instruments
   */
  selectAllOtherInstruments() {
    this.state.update(current => ({
      ...current,
      tradingPreferences: {
        ...current.tradingPreferences,
        otherInstruments: OTHER_UPCOMING_INSTRUMENTS.map(i => i.symbol)
      }
    }));
  }

  /**
   * Clear all other option instruments
   */
  clearAllOtherInstruments() {
    this.state.update(current => ({
      ...current,
      tradingPreferences: {
        ...current.tradingPreferences,
        otherInstruments: []
      }
    }));
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
   * Convert local state to MockUserPreferences and persist to MockUserStorageService
   */
  saveToStorage(): boolean {
    const current = this.state();

    let levelCode: AutomationLevelCode = 'ANALYSIS';
    if (current.automationPreferences.selectedLevel === 2) levelCode = 'SIGNALS';
    else if (current.automationPreferences.selectedLevel === 3) levelCode = 'PAPER_TRADING';
    else if (current.automationPreferences.selectedLevel === 4) levelCode = 'DEMO_AUTO';
    else if (current.automationPreferences.selectedLevel === 5) levelCode = 'LIVE_AUTO';

    const accounts: MockUserAccountRecord[] = current.tradingAccounts.map(a => ({
      id: a.id,
      broker: a.brokerName,
      server: a.server,
      accountNumber: a.accountNumber,
      environment: a.accountType,
      tradingEnabled: a.activeForExecution
    }));

    const allSelected = Array.from(new Set([
      ...(current.tradingPreferences.authorizedForexPairs || []),
      ...(current.tradingPreferences.otherInstruments || [])
    ]));

    const prefs: MockUserPreferences = {
      selectedPairs: allSelected,
      riskRules: {
        riskPerTradePercent: current.riskPreferences.maxRiskPerTradePct,
        maxDailyLossPercent: current.riskPreferences.maxDailyLossPct,
        maxOpenPositions: current.riskPreferences.maxOpenPositions,
        maxExposurePercent: current.riskPreferences.maxSimultaneousExposurePct,
        newsFilterActive: current.riskPreferences.newsFilterActive ?? true,
        weekendLockActive: current.riskPreferences.weekendLockActive ?? false
      },
      automation: {
        level: levelCode,
        manualConfirmation: current.automationPreferences.manualConfirmationRequired,
        maxDailyTrades: current.automationPreferences.maxDailyTradesAllowed ?? 4
      },
      tradingAccounts: accounts
    };

    return this.userStorage.updateOnboardingPreferences(prefs);
  }

  /**
   * Mark onboarding as completed and persist to mock JSON storage
   */
  completeOnboarding() {
    this.state.update(current => ({
      ...current,
      isCompleted: true,
      completedAt: new Date().toISOString()
    }));

    this.saveToStorage();
  }

  /**
   * Reset onboarding state back to initial defaults
   */
  reset() {
    this.state.set(INITIAL_ONBOARDING_STATE);
  }
}
