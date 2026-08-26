export interface ForexPairOption {
  symbol: string;
  name: string;
  category: 'MAJORS' | 'MINORS' | 'EXOTICS';
  description: string;
  spreadAvgPips: number;
}

export interface TradingPreferences {
  authorizedForexPairs: string[];
  otherInstruments: string[];
  customNotes?: string;
}

export interface RiskPreferences {
  maxRiskPerTradePct: number; // e.g. 1.0 %
  maxDailyLossPct: number;    // e.g. 3.0 %
  maxOpenPositions: number;    // e.g. 3
  maxSimultaneousExposurePct: number; // e.g. 6.0 %
  newsFilterActive?: boolean;
  weekendLockActive?: boolean;
}

export interface TradingAccountOption {
  id: string;
  brokerName: string;
  server: string;
  accountNumber: string;
  accountType: 'DEMO' | 'LIVE';
  status: 'NOT_CONNECTED' | 'CONNECTED' | 'SAMPLE';
  activeForExecution: boolean;
  currency: string;
  balanceDemo?: number;
}

export type AutomationLevel = 1 | 2 | 3 | 4 | 5;

export interface AutomationLevelDetails {
  level: AutomationLevel;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  executionMode: string;
  isAvailableNow: boolean;
  statusNote?: string;
}

export interface AutomationPreferences {
  selectedLevel: AutomationLevel;
  manualConfirmationRequired: boolean;
  maxDailyTradesAllowed: number;
}

export interface OnboardingState {
  currentStepIndex: number;
  tradingPreferences: TradingPreferences;
  riskPreferences: RiskPreferences;
  tradingAccounts: TradingAccountOption[];
  automationPreferences: AutomationPreferences;
  isCompleted: boolean;
  completedAt?: string;
}
