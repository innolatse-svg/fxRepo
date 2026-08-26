import { Injectable, signal, computed, inject } from '@angular/core';
import { OnboardingService } from './onboarding.service';
import { MarketDemoService } from './market-demo.service';
import { TradeSignal, OpenPosition } from '../models/dashboard.model';

export const INITIAL_SIGNALS: TradeSignal[] = [
  {
    id: 'sig-eurusd-01',
    symbol: 'EUR/USD',
    direction: 'SELL',
    timeframe: 'H4',
    alignmentScore: 88,
    entryPrice: 1.0845,
    stopLoss: 1.0875,
    takeProfit: 1.0772,
    riskRewardRatio: '1:2.4',
    pipsRisk: 30,
    pipsReward: 73,
    status: 'PENDING_CONFIRMATION',
    timestamp: 'Il y a 8 min',
    confluence: {
      technical: {
        title: 'Cassure de structure + Rejet résistance H4',
        bias: 'BEARISH',
        detail: 'Rejet net sur la zone de résistance 1.0870 avec divergence baissière RSI (14) sur unité H4 et croisement baissier EMA 20/50.',
        indicators: ['EMA 20/50 Bearish Cross', 'RSI Divergence 64 -> 51', 'Order Block H4 Rejected']
      },
      macro: {
        title: 'Biais haussier USD (Différentiel de taux)',
        bias: 'BEARISH',
        detail: 'Maintien des taux Fed au-dessus des taux BCE (différentiel de +150 bps) favorisant le flux acheteur vers le Dollar.',
        interestRateDiff: '+1.50% (USD > EUR)'
      },
      news: {
        title: 'Filtre d\'événements macro validé',
        status: 'CLEAR',
        detail: 'Aucun événement majeur de niveau "High Impact" prévu dans les 45 prochaines minutes. Fenêtre d\'exécution optimale.',
        nextEventInMinutes: 52
      },
      ai: {
        title: 'Modèle Prédictif Multi-Piliers',
        winrateEstimate: 71,
        historicalSampleSize: 1420,
        patternConfidence: 'Très élevée (Confluence 4/4)'
      }
    }
  },
  {
    id: 'sig-gbpusd-02',
    symbol: 'GBP/USD',
    direction: 'BUY',
    timeframe: 'H1',
    alignmentScore: 82,
    entryPrice: 1.2910,
    stopLoss: 1.2875,
    takeProfit: 1.2985,
    riskRewardRatio: '1:2.1',
    pipsRisk: 35,
    pipsReward: 75,
    status: 'PENDING_CONFIRMATION',
    timestamp: 'Il y a 22 min',
    confluence: {
      technical: {
        title: 'Rebond sur support institutionnel & FVG comblé',
        bias: 'BULLISH',
        detail: 'Comblement du Fair Value Gap H1 à 1.2885 avec réaction vive des acheteurs et réintégration du range.',
        indicators: ['Fair Value Gap Filled', 'Support 1.2880 retested', 'Stochastic Oversold 18']
      },
      macro: {
        title: 'Données d\'emploi UK supérieures au consensus',
        bias: 'BULLISH',
        detail: 'Chiffres de l\'emploi britannique plus solides, repoussant les anticipations de baisse rapide des taux de la BoE.',
        interestRateDiff: 'Stable (BoE restrictive)'
      },
      news: {
        title: 'Calendrier économique neutre',
        status: 'CLEAR',
        detail: 'Pas de publication UK / US immédiate avant la session de New York.',
        nextEventInMinutes: 85
      },
      ai: {
        title: 'Modèle de retour à la moyenne',
        winrateEstimate: 68,
        historicalSampleSize: 980,
        patternConfidence: 'Élevée'
      }
    }
  },
  {
    id: 'sig-usdjpy-03',
    symbol: 'USD/JPY',
    direction: 'SELL',
    timeframe: 'H4',
    alignmentScore: 79,
    entryPrice: 154.65,
    stopLoss: 155.30,
    takeProfit: 153.10,
    riskRewardRatio: '1:2.4',
    pipsRisk: 65,
    pipsReward: 155,
    status: 'EXECUTED_DEMO',
    timestamp: 'Il y a 1h 14',
    confluence: {
      technical: {
        title: 'Double sommet & sortie de biseau ascendant',
        bias: 'BEARISH',
        detail: 'Figure de retournement en double sommet à 155.80 confirmée par une rupture de support dynamique.',
        indicators: ['Double Top Confirmed', 'Break of Structure H4', 'MACD Bearish Histogram']
      },
      macro: {
        title: 'Propos hawkish de la Banque du Japon',
        bias: 'BEARISH',
        detail: 'Déclarations soutenant une possible hausse de taux par la BoJ et réductions des achats obligataires.',
        interestRateDiff: 'Rétrécissement du spread JPY'
      },
      news: {
        title: 'Filtre de volatilité actif',
        status: 'CAUTION',
        detail: 'Surveillance des commentaires de politique monétaire asiatique.',
        nextEventInMinutes: 140
      },
      ai: {
        title: 'Modèle de breakout de structure',
        winrateEstimate: 66,
        historicalSampleSize: 1150,
        patternConfidence: 'Modérée à Élevée'
      }
    }
  }
];

export const INITIAL_OPEN_POSITIONS: OpenPosition[] = [
  {
    id: 'pos-01',
    symbol: 'USD/JPY',
    direction: 'SELL',
    volumeLots: 0.50,
    openPrice: 154.68,
    currentPrice: 154.42,
    stopLoss: 155.30,
    takeProfit: 153.10,
    pnlDollar: 84.15,
    pnlPips: 26.0,
    openTime: 'Aujourd\'hui, 10:15',
    riskPct: 0.95
  }
];

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private onboardingService = inject(OnboardingService);
  private marketDemoService = inject(MarketDemoService);

  // Active simulated capital & state
  readonly baseCapital = signal<number>(10000);
  readonly emergencyStopActive = signal<boolean>(false);
  readonly emergencyStopReason = signal<string | null>(null);

  // Active selected trading account id
  readonly selectedAccountId = signal<string>('acc-demo-preview');

  // Signals reactive list
  readonly signals = signal<TradeSignal[]>(INITIAL_SIGNALS);

  // Active open positions
  readonly openPositions = signal<OpenPosition[]>(INITIAL_OPEN_POSITIONS);

  // Active signal selected for explainability Drawer
  readonly activeExplainSignal = signal<TradeSignal | null>(null);

  // Watchlist pair selected for detail view
  readonly selectedWatchlistPair = signal<string>('EUR/USD');

  // Circuit breaker state
  readonly circuitBreaker = computed<'NORMAL' | 'TRIGGERED' | 'EMERGENCY_STOPPED'>(() => {
    if (this.emergencyStopActive()) return 'EMERGENCY_STOPPED';
    return 'NORMAL';
  });

  // Aggregated live metric calculations
  readonly metrics = computed(() => {
    const riskPrefs = this.onboardingService.riskPreferences();
    const positions = this.openPositions();
    
    // Sum unrealized PnL from positions
    const openPnl = positions.reduce((acc, pos) => acc + pos.pnlDollar, 0);
    const realizedDailyProfit = 40.35; // Simulated previous trade profit
    const totalDailyProfitDollar = realizedDailyProfit + openPnl;
    
    const balance = this.baseCapital();
    const equity = balance + openPnl;
    const dailyProfitPct = (totalDailyProfitDollar / balance) * 100;

    // Current total risk exposure
    const currentExposurePct = positions.reduce((acc, pos) => acc + pos.riskPct, 0);
    const maxExposureLimitPct = riskPrefs.maxSimultaneousExposurePct || 6.0;

    // Consumed daily loss (0 if in profit, or positive % if loss)
    const consumedDailyLossPct = totalDailyProfitDollar < 0 ? Math.abs(dailyProfitPct) : 0.0;
    const maxDailyLossLimitPct = riskPrefs.maxDailyLossPct || 3.0;

    return {
      accountBalance: balance,
      accountEquity: equity,
      dailyProfitDollar: totalDailyProfitDollar,
      dailyProfitPct: dailyProfitPct,
      currentExposurePct: Number(currentExposurePct.toFixed(2)),
      maxExposureLimitPct: maxExposureLimitPct,
      consumedDailyLossPct: Number(consumedDailyLossPct.toFixed(2)),
      maxDailyLossLimitPct: maxDailyLossLimitPct,
      openPositionsCount: positions.length,
      maxPositionsLimit: riskPrefs.maxOpenPositions || 3,
      circuitBreakerStatus: this.circuitBreaker()
    };
  });

  // Watchlist pairs computed from onboarding preferences or default
  readonly watchlistPairs = computed(() => {
    const authorized = this.onboardingService.tradingPreferences().authorizedForexPairs;
    const allMarketPairs = this.marketDemoService.pairs();

    // Map each authorized pair with live market quotes and analysis metadata
    const userSymbols = authorized.length > 0 ? authorized : ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD'];

    return userSymbols.map(sym => {
      const liveQuote = allMarketPairs.find(p => p.symbol === sym);
      
      const bid = liveQuote?.bid ?? (sym === 'EUR/USD' ? 1.0845 : sym === 'GBP/USD' ? 1.2912 : sym === 'USD/JPY' ? 154.68 : sym === 'USD/CAD' ? 1.3540 : 1.0000);
      const change24h = liveQuote?.change24h ?? 0.25;
      const spread = liveQuote?.spread ?? 0.8;
      const bias = liveQuote?.bias ?? (change24h >= 0.2 ? 'BULLISH' : change24h <= -0.2 ? 'BEARISH' : 'NEUTRAL');
      
      let recommendation: 'BUY' | 'SELL' | 'WAIT' = 'WAIT';
      if (bias === 'BULLISH' && change24h > 0.15) recommendation = 'BUY';
      else if (bias === 'BEARISH' && change24h < -0.15) recommendation = 'SELL';

      let newsFilterStatus: 'OK' | 'NEWS_SOON' | 'RESTRICTED' = 'OK';
      if (sym === 'USD/JPY') newsFilterStatus = 'NEWS_SOON';

      return {
        symbol: sym,
        name: liveQuote?.name ?? sym,
        bid,
        change24h,
        spread,
        timeframeBias: bias,
        newsFilterStatus,
        recommendation,
        confidence: liveQuote?.aiConfidence ?? 78,
        sparkline: liveQuote?.sparkline ?? [bid * 0.998, bid * 1.001, bid]
      };
    });
  });

  /**
   * Emergency stop trigger
   */
  triggerEmergencyStop(reason = 'Intervention manuelle utilisateur') {
    this.emergencyStopActive.set(true);
    this.emergencyStopReason.set(reason);
  }

  /**
   * Resume normal operations after emergency stop
   */
  resumeOperations() {
    this.emergencyStopActive.set(false);
    this.emergencyStopReason.set(null);
  }

  /**
   * Select a signal to view detailed explainability drawer
   */
  openExplainabilityDrawer(signalItem: TradeSignal) {
    this.activeExplainSignal.set(signalItem);
  }

  /**
   * Close explainability drawer
   */
  closeExplainabilityDrawer() {
    this.activeExplainSignal.set(null);
  }

  /**
   * Confirm execution of a signal in demo mode
   */
  confirmSignalExecution(signalId: string) {
    if (this.emergencyStopActive()) return;

    this.signals.update(list => 
      list.map(s => s.id === signalId ? { ...s, status: 'EXECUTED_DEMO' } : s)
    );

    const targetSignal = this.signals().find(s => s.id === signalId);
    if (targetSignal) {
      // Add simulated open position
      const newPos: OpenPosition = {
        id: `pos-${Date.now().toString(36)}`,
        symbol: targetSignal.symbol,
        direction: targetSignal.direction,
        volumeLots: 0.25,
        openPrice: targetSignal.entryPrice,
        currentPrice: targetSignal.entryPrice,
        stopLoss: targetSignal.stopLoss,
        takeProfit: targetSignal.takeProfit,
        pnlDollar: 0.0,
        pnlPips: 0.0,
        openTime: 'À l\'instant',
        riskPct: this.onboardingService.riskPreferences().maxRiskPerTradePct || 1.0
      };

      this.openPositions.update(positions => [newPos, ...positions]);
    }

    if (this.activeExplainSignal()?.id === signalId) {
      this.closeExplainabilityDrawer();
    }
  }

  /**
   * Dismiss/cancel a signal
   */
  dismissSignal(signalId: string) {
    this.signals.update(list => 
      list.map(s => s.id === signalId ? { ...s, status: 'CANCELLED' } : s)
    );
    if (this.activeExplainSignal()?.id === signalId) {
      this.closeExplainabilityDrawer();
    }
  }

  /**
   * Close an open position
   */
  closePosition(posId: string) {
    this.openPositions.update(list => list.filter(p => p.id !== posId));
  }

  /**
   * Select watchlist pair
   */
  selectWatchlistPair(symbol: string) {
    this.selectedWatchlistPair.set(symbol);
    this.marketDemoService.setActivePair(symbol);
  }
}
