import { Injectable, signal, computed } from '@angular/core';
import { 
  MockUserRecord, 
  MockUsersDatabase, 
  MockUserPreferences,
  MockUserAccountRecord,
  AutomationLevelCode
} from '../models/user-storage.model';

export const STORAGE_KEY = 'fx_intel_mock_db';

export const DEFAULT_DEMO_USER: MockUserRecord = {
  id: 'usr-demo-001',
  firstName: 'Alexandre',
  lastName: 'Dubois',
  email: 'demo@forexintel.com',
  passwordHash: 'Demo1234!',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  subscription: {
    plan: 'FREE_TRIAL',
    status: 'ACTIVE',
    trialDaysRemaining: 15,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  onboardingCompleted: true,
  preferences: {
    selectedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
    riskRules: {
      riskPerTradePercent: 1.0,
      maxDailyLossPercent: 3.0,
      maxOpenPositions: 3,
      maxExposurePercent: 4.0
    },
    automation: {
      level: 'SIGNALS',
      manualConfirmation: true
    },
    tradingAccounts: [
      {
        id: 'acc-deriv-01',
        broker: 'Deriv / MT5 Sandbox',
        server: 'Deriv-Demo',
        accountNumber: '5082194',
        environment: 'DEMO',
        tradingEnabled: true
      }
    ]
  }
};

export const INITIAL_DATABASE_STATE: MockUsersDatabase = {
  users: [DEFAULT_DEMO_USER],
  activeSessionUserId: 'usr-demo-001'
};

@Injectable({
  providedIn: 'root'
})
export class MockUserStorageService {
  // Reactive Signal holding the entire mock database
  readonly database = signal<MockUsersDatabase>(INITIAL_DATABASE_STATE);

  // Computed signal for the currently authenticated user record
  readonly currentUser = computed<MockUserRecord | null>(() => {
    const db = this.database();
    if (!db.activeSessionUserId) return null;
    return db.users.find(u => u.id === db.activeSessionUserId) || null;
  });

  // Computed helper for quick auth status
  readonly isAuthenticated = computed<boolean>(() => this.currentUser() !== null);

  constructor() {
    this.initDatabase();
  }

  /**
   * Initialize Database from localStorage or seed initial default state
   */
  initDatabase(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MockUsersDatabase;
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          this.database.set(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('[MockUserStorage] Could not parse stored DB, resetting to defaults', e);
    }

    // Seed default state
    this.saveDatabase(INITIAL_DATABASE_STATE);
  }

  /**
   * Save database state to reactive signal and localStorage
   */
  private saveDatabase(db: MockUsersDatabase): void {
    this.database.set(db);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db, null, 2));
      } catch (e) {
        console.error('[MockUserStorage] Failed to save DB to localStorage', e);
      }
    }
  }

  /**
   * Register a new user
   */
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): { success: boolean; user?: MockUserRecord; error?: string } {
    const normalizedEmail = userData.email.trim().toLowerCase();
    const currentDb = this.database();

    // Check if email already exists
    const exists = currentDb.users.some(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (exists) {
      return {
        success: false,
        error: 'Cet e-mail est déjà utilisé'
      };
    }

    const newUser: MockUserRecord = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim(),
      passwordHash: userData.password, // In real backend: bcrypt hash
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      subscription: {
        plan: 'FREE_TRIAL',
        status: 'ACTIVE',
        trialDaysRemaining: 15,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      onboardingCompleted: false,
      preferences: {
        selectedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        riskRules: {
          riskPerTradePercent: 1.0,
          maxDailyLossPercent: 3.0,
          maxOpenPositions: 3,
          maxExposurePercent: 4.0
        },
        automation: {
          level: 'ANALYSIS',
          manualConfirmation: true
        },
        tradingAccounts: []
      }
    };

    const updatedDb: MockUsersDatabase = {
      users: [...currentDb.users, newUser],
      activeSessionUserId: newUser.id
    };

    this.saveDatabase(updatedDb);

    return {
      success: true,
      user: newUser
    };
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): { success: boolean; user?: MockUserRecord; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const currentDb = this.database();

    const user = currentDb.users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (!user) {
      return {
        success: false,
        error: 'Identifiants invalides'
      };
    }

    // Check password matching (supports raw or hash comparison)
    if (user.passwordHash !== password && user.passwordHash !== `hash_${password}`) {
      return {
        success: false,
        error: 'Identifiants invalides'
      };
    }

    // Update lastLoginAt and active session
    const updatedUsers = currentDb.users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          lastLoginAt: new Date().toISOString()
        };
      }
      return u;
    });

    const activeUser = updatedUsers.find(u => u.id === user.id)!;

    const updatedDb: MockUsersDatabase = {
      users: updatedUsers,
      activeSessionUserId: user.id
    };

    this.saveDatabase(updatedDb);

    return {
      success: true,
      user: activeUser
    };
  }

  /**
   * Update preferences and mark onboarding completed for the active user
   */
  updateOnboardingPreferences(prefs: Partial<MockUserPreferences>): boolean {
    const currentDb = this.database();
    const activeId = currentDb.activeSessionUserId;
    if (!activeId) return false;

    const updatedUsers = currentDb.users.map(u => {
      if (u.id === activeId) {
        return {
          ...u,
          onboardingCompleted: true,
          preferences: {
            selectedPairs: prefs.selectedPairs ?? u.preferences.selectedPairs,
            riskRules: {
              ...u.preferences.riskRules,
              ...(prefs.riskRules || {})
            },
            automation: {
              ...u.preferences.automation,
              ...(prefs.automation || {})
            },
            tradingAccounts: prefs.tradingAccounts ?? u.preferences.tradingAccounts
          }
        };
      }
      return u;
    });

    this.saveDatabase({
      ...currentDb,
      users: updatedUsers
    });

    return true;
  }

  /**
   * Update partial user profile (firstName, lastName, etc.)
   */
  updateUserProfile(updates: { firstName?: string; lastName?: string; email?: string }): boolean {
    const currentDb = this.database();
    const activeId = currentDb.activeSessionUserId;
    if (!activeId) return false;

    const updatedUsers = currentDb.users.map(u => {
      if (u.id === activeId) {
        return {
          ...u,
          firstName: updates.firstName ?? u.firstName,
          lastName: updates.lastName ?? u.lastName,
          email: updates.email ?? u.email
        };
      }
      return u;
    });

    this.saveDatabase({
      ...currentDb,
      users: updatedUsers
    });

    return true;
  }

  /**
   * Update full preferences for the active user
   */
  updateFullPreferences(prefs: MockUserPreferences): boolean {
    const currentDb = this.database();
    const activeId = currentDb.activeSessionUserId;
    if (!activeId) return false;

    const updatedUsers = currentDb.users.map(u => {
      if (u.id === activeId) {
        return {
          ...u,
          preferences: {
            ...prefs
          }
        };
      }
      return u;
    });

    this.saveDatabase({
      ...currentDb,
      users: updatedUsers
    });

    return true;
  }

  /**
   * Reset the active user's preferences back to initial onboarding defaults without deleting the user account
   */
  resetActiveUserPreferences(): boolean {
    const currentDb = this.database();
    const activeId = currentDb.activeSessionUserId;
    if (!activeId) return false;

    const updatedUsers = currentDb.users.map(u => {
      if (u.id === activeId) {
        return {
          ...u,
          preferences: {
            ...DEFAULT_DEMO_USER.preferences,
            riskRules: {
              riskPerTradePercent: 1.0,
              maxDailyLossPercent: 3.0,
              maxOpenPositions: 3,
              maxExposurePercent: 4.0,
              newsFilterActive: true,
              weekendLockActive: false
            },
            automation: {
              level: 'SIGNALS' as AutomationLevelCode,
              manualConfirmation: true,
              maxDailyTrades: 4
            }
          }
        };
      }
      return u;
    });

    this.saveDatabase({
      ...currentDb,
      users: updatedUsers
    });

    return true;
  }

  /**
   * Update password for active user
   */
  updatePassword(oldPass: string, newPass: string): { success: boolean; error?: string } {
    const currentDb = this.database();
    const activeUser = this.getActiveUser();
    if (!activeUser) {
      return { success: false, error: 'Aucun utilisateur connecté' };
    }

    if (activeUser.passwordHash !== oldPass && activeUser.passwordHash !== `hash_${oldPass}`) {
      return { success: false, error: 'L\'ancien mot de passe est incorrect' };
    }

    if (!newPass || newPass.length < 8) {
      return { success: false, error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' };
    }

    const updatedUsers = currentDb.users.map(u => {
      if (u.id === activeUser.id) {
        return {
          ...u,
          passwordHash: newPass
        };
      }
      return u;
    });

    this.saveDatabase({
      ...currentDb,
      users: updatedUsers
    });

    return { success: true };
  }

  /**
   * Add a new trading account to the active user profile
   */
  addTradingAccount(account: MockUserAccountRecord): boolean {
    const activeUser = this.getActiveUser();
    if (!activeUser) return false;

    const currentAccounts = activeUser.preferences.tradingAccounts || [];
    const updatedAccounts = [...currentAccounts, account];

    return this.updateFullPreferences({
      ...activeUser.preferences,
      tradingAccounts: updatedAccounts
    });
  }

  /**
   * Remove a trading account from active user
   */
  removeTradingAccount(accountId: string): boolean {
    const activeUser = this.getActiveUser();
    if (!activeUser) return false;

    const currentAccounts = activeUser.preferences.tradingAccounts || [];
    const updatedAccounts = currentAccounts.filter(a => a.id !== accountId);

    return this.updateFullPreferences({
      ...activeUser.preferences,
      tradingAccounts: updatedAccounts
    });
  }

  /**
   * Toggle trading authorization for a specific account
   */
  toggleAccountTrading(accountId: string, enabled: boolean): boolean {
    const activeUser = this.getActiveUser();
    if (!activeUser) return false;

    const currentAccounts = activeUser.preferences.tradingAccounts || [];
    const updatedAccounts = currentAccounts.map(a => 
      a.id === accountId ? { ...a, tradingEnabled: enabled } : a
    );

    return this.updateFullPreferences({
      ...activeUser.preferences,
      tradingAccounts: updatedAccounts
    });
  }

  /**
   * Get all registered users from mock database
   */
  getAllUsers(): MockUserRecord[] {
    return this.database().users;
  }

  /**
   * Get active user record
   */
  getActiveUser(): MockUserRecord | null {
    return this.currentUser();
  }

  /**
   * Logout active session
   */
  logout(): void {
    const currentDb = this.database();
    this.saveDatabase({
      ...currentDb,
      activeSessionUserId: null
    });
  }

  /**
   * Instant Switch to Demo Account
   */
  switchDemoUser(): MockUserRecord {
    const currentDb = this.database();
    let demoUser = currentDb.users.find(u => u.email === 'demo@forexintel.com');

    if (!demoUser) {
      demoUser = { ...DEFAULT_DEMO_USER };
      const updatedDb: MockUsersDatabase = {
        users: [...currentDb.users, demoUser],
        activeSessionUserId: demoUser.id
      };
      this.saveDatabase(updatedDb);
      return demoUser;
    }

    this.saveDatabase({
      ...currentDb,
      activeSessionUserId: demoUser.id
    });
    return demoUser;
  }

  /**
   * Reset database back to default initial state
   */
  resetDatabase(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('[MockUserStorage] Failed to remove DB from localStorage', e);
      }
    }
    this.saveDatabase(INITIAL_DATABASE_STATE);
  }

  /**
   * Return formatted raw JSON for inspection modal
   */
  getRawDatabaseJson(): string {
    return JSON.stringify(this.database(), null, 2);
  }
}
