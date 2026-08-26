export interface TradeSignal {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  timeframe: string;
  alignmentScore: number; // e.g. 88%
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: string; // e.g. '1:2.4'
  pipsRisk: number;
  pipsReward: number;
  status: 'PENDING_CONFIRMATION' | 'EXECUTED_DEMO' | 'CANCELLED' | 'CLOSED_PROFIT';
  timestamp: string;
  confluence: {
    technical: {
      title: string;
      bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
      detail: string;
      indicators: string[];
    };
    macro: {
      title: string;
      bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
      detail: string;
      interestRateDiff: string;
    };
    news: {
      title: string;
      status: 'CLEAR' | 'CAUTION' | 'RESTRICTED';
      detail: string;
      nextEventInMinutes: number;
    };
    ai: {
      title: string;
      winrateEstimate: number; // e.g. 71%
      historicalSampleSize: number;
      patternConfidence: string;
    };
  };
}

export interface OpenPosition {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  volumeLots: number;
  openPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  pnlDollar: number;
  pnlPips: number;
  openTime: string;
  riskPct: number;
}

export interface DashboardMetricSummary {
  accountBalance: number;
  accountEquity: number;
  dailyProfitDollar: number;
  dailyProfitPct: number;
  currentExposurePct: number;
  maxExposureLimitPct: number;
  consumedDailyLossPct: number;
  maxDailyLossLimitPct: number;
  openPositionsCount: number;
  maxPositionsLimit: number;
  circuitBreakerStatus: 'NORMAL' | 'TRIGGERED' | 'EMERGENCY_STOPPED';
}
