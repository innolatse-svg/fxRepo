export type SignalType = 'BUY' | 'SELL' | 'WAIT';
export type MarketBias = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type AccountType = 'DEMO' | 'LIVE';
export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'DISABLED';
export type AssetCategory = 'FOREX' | 'COMMODITY' | 'CRYPTO';
export type TimeframeType = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1';

export interface Candle {
  timestamp: number;
  timeLabel: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CurrencyPairQuote {
  symbol: string;
  name: string;
  category: AssetCategory;
  bid: number;
  ask: number;
  spread: number;
  change24h: number;
  high24h: number;
  low24h: number;
  digits: number;
  pipSize: number;
  bias: MarketBias;
  trend: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  aiConfidence: number; // 0 - 100
  lastTickDirection?: 'UP' | 'DOWN' | 'NEUTRAL';
  sparkline: number[];
  lastUpdated: string;
}

export interface PillarScore {
  name: string;
  bias: MarketBias;
  score: number; // 0 - 100
  detail: string;
  icon: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: ImpactLevel;
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface ConnectedAccount {
  id: string;
  broker: string;
  accountNumber: string;
  type: AccountType;
  server: string;
  balance: number;
  equity: number;
  currency: string;
  status: ConnectionStatus;
  isExecutionAllowed: boolean;
  maxRiskAllocation: number; // %
}

export interface RiskProfile {
  riskPerTradePercent: number;
  maxDailyLossPercent: number;
  maxOpenPositions: number;
  manualConfirmationRequired: boolean;
  stopLossMandatory: boolean;
  emergencyKillSwitch: boolean;
  allowedPairs: string[];
}

export interface AutomationLevel {
  step: number;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  requiresManualConfirm: boolean;
  badge: string;
}
