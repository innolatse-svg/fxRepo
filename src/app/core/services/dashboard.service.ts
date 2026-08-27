import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { OnboardingService } from './onboarding.service';
import { MarketDemoService } from './market-demo.service';
import { WebSocketService } from './websocket.service';
import { RiskEngineService } from './risk-engine.service';
import { TradeSignal, OpenPosition } from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

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

export interface ServerMetricsResponse {
  accountBalance?: number;
  dailyProfitDollar?: number;
  dailyProfitPct?: number;
  currentExposurePct?: number;
  consumedDailyLossPct?: number;
}

export interface BackendSignalItem {
  id?: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  timeframe?: string;
  alignmentScore?: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio?: string;
  status?: 'PENDING_CONFIRMATION' | 'EXECUTED_DEMO' | 'CANCELLED';
  timestamp?: string;
  confluence?: TradeSignal['confluence'];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private onboardingService = inject(OnboardingService);
  private marketDemoService = inject(MarketDemoService);
  private websocketService = inject(WebSocketService);

  private riskEngineService = inject(RiskEngineService);

  // Active simulated capital & state
  readonly baseCapital = signal<number>(10000);
  readonly serverMetrics = signal<ServerMetricsResponse | null>(null);
  readonly emergencyStopActive = signal<boolean>(false);
  readonly emergencyStopReason = signal<string | null>(null);
  readonly lastExecutionError = signal<string | null>(null);

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

  constructor() {
    this.fetchMetrics();
    this.fetchSignals();
    this.initSignalsWebSocket();
  }

  /**
   * Récupère la liste des signaux de trading IA depuis l'API REST
   */
  async fetchSignals(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<BackendSignalItem[]>(`${environment.apiUrl}/signals`));
      if (data && data.length > 0) {
        const mapped: TradeSignal[] = data.map(item => this.mapBackendSignalToModel(item));
        this.signals.set(mapped);
      }
    } catch (e) {
      console.warn('[DashboardService] Impossible de récupérer les signaux depuis le backend, utilisation des signaux locaux', e);
    }
  }

  /**
   * Écoute en temps réel les nouveaux signaux poussés par le Moteur IA via WebSocket
   */
  private initSignalsWebSocket(): void {
    this.websocketService.subscribe<BackendSignalItem>('/topic/signals').subscribe((newSignal: BackendSignalItem) => {
      if (newSignal) {
        const mapped = this.mapBackendSignalToModel(newSignal);
        this.signals.update(list => {
          // Éviter les doublons
          if (list.some(s => s.id === mapped.id)) return list;
          return [mapped, ...list];
        });
      }
    });
  }

  private mapBackendSignalToModel(item: BackendSignalItem): TradeSignal {
    return {
      id: item.id || `sig-${Date.now()}`,
      symbol: item.symbol,
      direction: item.direction,
      timeframe: item.timeframe || 'H1',
      alignmentScore: item.alignmentScore || 80,
      entryPrice: item.entryPrice,
      stopLoss: item.stopLoss,
      takeProfit: item.takeProfit,
      riskRewardRatio: item.riskRewardRatio || '1:2.4',
      pipsRisk: Math.abs(Math.round((item.entryPrice - item.stopLoss) * (item.symbol.includes('JPY') ? 100 : 10000))),
      pipsReward: Math.abs(Math.round((item.takeProfit - item.entryPrice) * (item.symbol.includes('JPY') ? 100 : 10000))),
      status: item.status || 'PENDING_CONFIRMATION',
      timestamp: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'À l\'instant',
      confluence: item.confluence || {
        technical: {
          title: 'Confluence Technique Multi-Indicateurs',
          bias: item.direction === 'BUY' ? 'BULLISH' : 'BEARISH',
          detail: 'Alignement des structures de prix et volumes.',
          indicators: ['Structure Breakout', 'RSI Confluence', 'Order Block']
        },
        macro: {
          title: 'Alignement Macroéconomique',
          bias: item.direction === 'BUY' ? 'BULLISH' : 'BEARISH',
          detail: 'Différentiel de taux et politique de banque centrale favorables.',
          interestRateDiff: '+1.25%'
        },
        news: {
          title: 'Protection Volatilité News',
          status: 'CLEAR',
          detail: 'Aucun événement majeur à fort impact imminent.',
          nextEventInMinutes: 45
        },
        ai: {
          title: 'Modèle Quantitatif Neural V4',
          winrateEstimate: item.alignmentScore || 75,
          historicalSampleSize: 2400,
          patternConfidence: 'Élevée'
        }
      }
    };
  }

  /**
   * Récupère les métriques initiales du Dashboard depuis l'API Spring Boot
   */
  async fetchMetrics(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<ServerMetricsResponse>(`${environment.apiUrl}/dashboard/metrics`));
      if (data) {
        this.serverMetrics.set(data);
        if (data.accountBalance) {
          this.baseCapital.set(data.accountBalance);
        }
      }
    } catch (e) {
      console.warn('[DashboardService] Métriques serveur non disponibles, utilisation des valeurs locales', e);
    }
  }

  // Circuit breaker state
  readonly circuitBreaker = computed<'NORMAL' | 'TRIGGERED' | 'EMERGENCY_STOPPED'>(() => {
    if (this.emergencyStopActive()) return 'EMERGENCY_STOPPED';
    return 'NORMAL';
  });

  // Aggregated live metric calculations
  readonly metrics = computed(() => {
    const riskPrefs = this.onboardingService.riskPreferences();
    const positions = this.openPositions();
    const server = this.serverMetrics();
    
    // Sum unrealized PnL from positions
    const openPnl = positions.reduce((acc, pos) => acc + pos.pnlDollar, 0);
    const realizedDailyProfit = server?.dailyProfitDollar ?? 40.35;
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
   * Emergency stop trigger (Kill Switch)
   */
  triggerEmergencyStop(reason = 'Intervention manuelle utilisateur') {
    this.emergencyStopActive.set(true);
    this.emergencyStopReason.set(reason);
    this.websocketService.disconnect();
  }

  /**
   * Resume normal operations after emergency stop
   */
  resumeOperations() {
    this.emergencyStopActive.set(false);
    this.emergencyStopReason.set(null);
    this.websocketService.reconnect();
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
   * Confirm execution of a signal in demo mode with Risk Engine validation
   */
  async confirmSignalExecution(signalId: string): Promise<boolean> {
    if (this.emergencyStopActive()) return false;

    const targetSignal = this.signals().find(s => s.id === signalId);
    if (!targetSignal) return false;

    this.lastExecutionError.set(null);

    // Validation Zero-Trust auprès du Risk Engine Spring Boot
    const riskCheck = await this.riskEngineService.evaluateTrade({
      symbol: targetSignal.symbol,
      direction: targetSignal.direction,
      lotSize: 0.25,
      entryPrice: targetSignal.entryPrice,
      stopLoss: targetSignal.stopLoss,
      takeProfit: targetSignal.takeProfit,
      requestedRiskPct: this.onboardingService.riskPreferences().maxRiskPerTradePct || 1.0,
      accountBalance: this.baseCapital(),
      currentOpenPositions: this.openPositions().length,
      currentExposurePct: this.metrics().currentExposurePct,
      currentDailyLossPct: this.metrics().consumedDailyLossPct
    });

    if (!riskCheck.allowed) {
      this.lastExecutionError.set(riskCheck.reason);
      console.warn('[RiskEngine] Ordre rejeté :', riskCheck.reason);
      return false;
    }

    this.signals.update(list => 
      list.map(s => s.id === signalId ? { ...s, status: 'EXECUTED_DEMO' } : s)
    );

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

    if (this.activeExplainSignal()?.id === signalId) {
      this.closeExplainabilityDrawer();
    }
    return true;
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
