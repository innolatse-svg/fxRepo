export type AutomationLevelCode = 'ANALYSIS' | 'SIGNALS' | 'PAPER_TRADING' | 'DEMO_AUTO' | 'LIVE_AUTO';

export interface MockUserAccountRecord {
  id: string;
  broker: string;
  server: string;
  accountNumber: string;
  environment: 'DEMO' | 'LIVE';
  tradingEnabled: boolean;
}

export interface MockUserPreferences {
  selectedPairs: string[]; // Ex: ['EUR/USD', 'GBP/USD', 'USD/JPY']
  riskRules: {
    riskPerTradePercent: number; // Ex: 1.0
    maxDailyLossPercent: number; // Ex: 3.0
    maxOpenPositions: number;    // Ex: 3
    maxExposurePercent: number;  // Ex: 4.0
    newsFilterActive?: boolean;
    weekendLockActive?: boolean;
  };
  automation: {
    level: AutomationLevelCode;
    manualConfirmation: boolean;
    maxDailyTrades?: number;
  };
  tradingAccounts: MockUserAccountRecord[];
}

export interface MockUserSubscription {
  plan: 'FREE_TRIAL' | 'PRO' | 'PREMIUM';
  status: 'ACTIVE' | 'EXPIRED';
  trialDaysRemaining: number;
  expiresAt: string;
}

export interface MockUserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string; // Simulation de hash
  createdAt: string;
  lastLoginAt: string;
  subscription: MockUserSubscription;
  onboardingCompleted: boolean;
  preferences: MockUserPreferences;
}

export interface MockUsersDatabase {
  users: MockUserRecord[];
  activeSessionUserId: string | null;
}
