import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WebSocketService } from './websocket.service';
import { 
  CurrencyPairQuote, 
  PillarScore, 
  EconomicEvent, 
  ConnectedAccount, 
  RiskProfile, 
  AutomationLevel,
  Candle,
  TimeframeType,
  MarketBias
} from '../models/market-intelligence.model';

@Injectable({
  providedIn: 'root'
})
export class MarketDemoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly websocketService = inject(WebSocketService);

  // Live streaming status
  readonly isLiveStreaming = signal<boolean>(true);
  readonly isFetching = signal<boolean>(false);
  readonly lastSyncTime = signal<Date>(new Date());
  readonly tickCounter = signal<number>(0);

  // Initial reference pairs with realistic base values
  readonly pairs = signal<CurrencyPairQuote[]>([
    {
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      category: 'FOREX',
      bid: 1.08452,
      ask: 1.08460,
      spread: 0.8,
      change24h: 0.42,
      high24h: 1.08720,
      low24h: 1.08180,
      digits: 5,
      pipSize: 0.0001,
      bias: 'BULLISH',
      trend: 'STRONG_BUY',
      aiConfidence: 88,
      lastTickDirection: 'UP',
      sparkline: [1.0818, 1.0825, 1.0832, 1.0829, 1.0840, 1.0845],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'GBP/USD',
      name: 'Livre Sterling / US Dollar',
      category: 'FOREX',
      bid: 1.29120,
      ask: 1.29131,
      spread: 1.1,
      change24h: -0.18,
      high24h: 1.29550,
      low24h: 1.28900,
      digits: 5,
      pipSize: 0.0001,
      bias: 'NEUTRAL',
      trend: 'NEUTRAL',
      aiConfidence: 64,
      lastTickDirection: 'DOWN',
      sparkline: [1.2940, 1.2930, 1.2918, 1.2905, 1.2915, 1.2912],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'USD/JPY',
      name: 'US Dollar / Yen Japonais',
      category: 'FOREX',
      bid: 154.680,
      ask: 154.689,
      spread: 0.9,
      change24h: -0.75,
      high24h: 156.100,
      low24h: 154.200,
      digits: 3,
      pipSize: 0.01,
      bias: 'BEARISH',
      trend: 'SELL',
      aiConfidence: 82,
      lastTickDirection: 'DOWN',
      sparkline: [155.80, 155.40, 155.10, 154.90, 154.75, 154.68],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'USD/CHF',
      name: 'US Dollar / Franc Suisse',
      category: 'FOREX',
      bid: 0.88450,
      ask: 0.88458,
      spread: 0.8,
      change24h: -0.12,
      high24h: 0.88720,
      low24h: 0.88200,
      digits: 5,
      pipSize: 0.0001,
      bias: 'NEUTRAL',
      trend: 'NEUTRAL',
      aiConfidence: 68,
      lastTickDirection: 'DOWN',
      sparkline: [0.8860, 0.8852, 0.8848, 0.8842, 0.8846, 0.8845],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'AUD/USD',
      name: 'Dollar Australien / USD',
      category: 'FOREX',
      bid: 0.65840,
      ask: 0.65852,
      spread: 1.2,
      change24h: 0.31,
      high24h: 0.66100,
      low24h: 0.65500,
      digits: 5,
      pipSize: 0.0001,
      bias: 'BULLISH',
      trend: 'BUY',
      aiConfidence: 74,
      lastTickDirection: 'UP',
      sparkline: [0.6560, 0.6568, 0.6575, 0.6570, 0.6580, 0.6584],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'USD/CAD',
      name: 'US Dollar / Dollar Canadien',
      category: 'FOREX',
      bid: 1.35420,
      ask: 1.35431,
      spread: 1.1,
      change24h: -0.22,
      high24h: 1.35800,
      low24h: 1.35200,
      digits: 5,
      pipSize: 0.0001,
      bias: 'BEARISH',
      trend: 'SELL',
      aiConfidence: 76,
      lastTickDirection: 'DOWN',
      sparkline: [1.3570, 1.3562, 1.3550, 1.3545, 1.3540, 1.3542],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'NZD/USD',
      name: 'Dollar Néo-Zélandais / USD',
      category: 'FOREX',
      bid: 0.58920,
      ask: 0.58932,
      spread: 1.2,
      change24h: 0.28,
      high24h: 0.59200,
      low24h: 0.58650,
      digits: 5,
      pipSize: 0.0001,
      bias: 'BULLISH',
      trend: 'BUY',
      aiConfidence: 72,
      lastTickDirection: 'UP',
      sparkline: [0.5875, 0.5880, 0.5885, 0.5890, 0.5888, 0.5892],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'EUR/GBP',
      name: 'Euro / Livre Sterling',
      category: 'FOREX',
      bid: 0.84020,
      ask: 0.84028,
      spread: 0.8,
      change24h: 0.15,
      high24h: 0.84250,
      low24h: 0.83850,
      digits: 5,
      pipSize: 0.0001,
      bias: 'NEUTRAL',
      trend: 'NEUTRAL',
      aiConfidence: 65,
      lastTickDirection: 'UP',
      sparkline: [0.8390, 0.8395, 0.8400, 0.8398, 0.8401, 0.8402],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'EUR/JPY',
      name: 'Euro / Yen Japonais',
      category: 'FOREX',
      bid: 167.750,
      ask: 167.761,
      spread: 1.1,
      change24h: -0.35,
      high24h: 168.600,
      low24h: 167.200,
      digits: 3,
      pipSize: 0.01,
      bias: 'BEARISH',
      trend: 'SELL',
      aiConfidence: 78,
      lastTickDirection: 'DOWN',
      sparkline: [168.40, 168.10, 167.90, 167.70, 167.80, 167.75],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'GBP/JPY',
      name: 'Livre Sterling / Yen Japonais',
      category: 'FOREX',
      bid: 199.650,
      ask: 199.664,
      spread: 1.4,
      change24h: -0.45,
      high24h: 200.800,
      low24h: 199.100,
      digits: 3,
      pipSize: 0.01,
      bias: 'BEARISH',
      trend: 'SELL',
      aiConfidence: 80,
      lastTickDirection: 'DOWN',
      sparkline: [200.40, 200.10, 199.85, 199.60, 199.70, 199.65],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'XAU/USD',
      name: 'Or (Gold Troy Ounce) / USD',
      category: 'COMMODITY',
      bid: 2845.50,
      ask: 2845.85,
      spread: 3.5,
      change24h: 1.15,
      high24h: 2862.00,
      low24h: 2824.00,
      digits: 2,
      pipSize: 0.1,
      bias: 'BULLISH',
      trend: 'STRONG_BUY',
      aiConfidence: 91,
      lastTickDirection: 'UP',
      sparkline: [2828.0, 2835.5, 2832.0, 2840.2, 2843.8, 2845.5],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'XAG/USD',
      name: 'Argent Spot (Silver) / USD',
      category: 'COMMODITY',
      bid: 32.45,
      ask: 32.48,
      spread: 3.0,
      change24h: 1.45,
      high24h: 32.85,
      low24h: 31.90,
      digits: 2,
      pipSize: 0.01,
      bias: 'BULLISH',
      trend: 'STRONG_BUY',
      aiConfidence: 86,
      lastTickDirection: 'UP',
      sparkline: [32.0, 32.15, 32.30, 32.25, 32.40, 32.45],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'US30',
      name: 'Dow Jones Industrial 30',
      category: 'COMMODITY',
      bid: 43850.00,
      ask: 43852.50,
      spread: 2.5,
      change24h: 0.65,
      high24h: 44100.00,
      low24h: 43600.00,
      digits: 2,
      pipSize: 1.0,
      bias: 'BULLISH',
      trend: 'BUY',
      aiConfidence: 81,
      lastTickDirection: 'UP',
      sparkline: [43650, 43720, 43800, 43780, 43830, 43850],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'NAS100',
      name: 'Nasdaq 100 Tech Index',
      category: 'COMMODITY',
      bid: 20820.00,
      ask: 20821.80,
      spread: 1.8,
      change24h: 0.88,
      high24h: 20950.00,
      low24h: 20650.00,
      digits: 2,
      pipSize: 1.0,
      bias: 'BULLISH',
      trend: 'STRONG_BUY',
      aiConfidence: 87,
      lastTickDirection: 'UP',
      sparkline: [20680, 20740, 20790, 20760, 20800, 20820],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'GER40',
      name: 'DAX 40 Allemagne',
      category: 'COMMODITY',
      bid: 19280.00,
      ask: 19281.50,
      spread: 1.5,
      change24h: 0.35,
      high24h: 19350.00,
      low24h: 19180.00,
      digits: 2,
      pipSize: 1.0,
      bias: 'BULLISH',
      trend: 'BUY',
      aiConfidence: 79,
      lastTickDirection: 'UP',
      sparkline: [19200, 19230, 19260, 19240, 19270, 19280],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'BTC/USD',
      name: 'Bitcoin / US Dollar',
      category: 'CRYPTO',
      bid: 77950.00,
      ask: 77955.00,
      spread: 5.0,
      change24h: 2.34,
      high24h: 78500.00,
      low24h: 76200.00,
      digits: 2,
      pipSize: 1.0,
      bias: 'BULLISH',
      trend: 'STRONG_BUY',
      aiConfidence: 89,
      lastTickDirection: 'UP',
      sparkline: [76400, 76800, 77250, 77100, 77600, 77950],
      lastUpdated: '12:00:00'
    },
    {
      symbol: 'ETH/USD',
      name: 'Ethereum / US Dollar',
      category: 'CRYPTO',
      bid: 3280.50,
      ask: 3281.80,
      spread: 1.3,
      change24h: 1.85,
      high24h: 3340.00,
      low24h: 3210.00,
      digits: 2,
      pipSize: 0.1,
      bias: 'BULLISH',
      trend: 'BUY',
      aiConfidence: 85,
      lastTickDirection: 'UP',
      sparkline: [3220, 3245, 3260, 3255, 3275, 3280.5],
      lastUpdated: '12:00:00'
    }
  ]);

  readonly activePairSymbol = signal<string>('EUR/USD');
  readonly selectedTimeframe = signal<TimeframeType>('H4');

  readonly activePair = computed(() => {
    return this.pairs().find(p => p.symbol === this.activePairSymbol()) || this.pairs()[0];
  });

  // Store for candlestick data by symbol and timeframe
  readonly candleStore = signal<Record<string, Partial<Record<TimeframeType, Candle[]>>>>({});

  // Active Candlestick series based on activePair and selectedTimeframe
  readonly activeCandles = computed<Candle[]>(() => {
    const symbol = this.activePairSymbol();
    const tf = this.selectedTimeframe();
    const store = this.candleStore();
    const pair = this.activePair();

    if (store[symbol] && store[symbol]![tf] && store[symbol]![tf]!.length > 0) {
      return store[symbol]![tf]!;
    }

    // Fallback generate candles if not yet cached
    return this.generateCandleSeries(pair.symbol, tf, pair.bid, pair.digits, pair.bias, 28);
  });

  readonly timeframeOptions: { id: TimeframeType; label: string; name: string; desc: string }[] = [
    { id: 'M1', label: '1M', name: '1 Minute', desc: 'Ultra Scalping & Micro Structure' },
    { id: 'M5', label: '5M', name: '5 Minutes', desc: 'Scalping Très Court Terme' },
    { id: 'M15', label: '15M', name: '15 Minutes', desc: 'Scalping & Flux Court Terme' },
    { id: 'M30', label: '30M', name: '30 Minutes', desc: 'Intraday Court & Niveaux' },
    { id: 'H1', label: '1H', name: '1 Heure', desc: 'Intraday & Momentum' },
    { id: 'H4', label: '4H', name: '4 Heures', desc: 'Structure Swing & Piliers IA' },
    { id: 'D1', label: '1D', name: '1 Jour', desc: 'Tendance Macro & Niveaux Clés' }
  ];

  /**
   * Transforms symbol like 'EUR/USD' to URL slug 'EURUSD'
   */
  getSlugFromSymbol(symbol: string): string {
    if (!symbol) return 'EURUSD';
    return symbol.replace(/[/\-_]/g, '').toUpperCase();
  }

  /**
   * Resolves URL slug like 'EURUSD' or 'BTCUSD' to canonical symbol 'EUR/USD'
   */
  getSymbolFromSlug(slug: string): string {
    if (!slug) return 'EUR/USD';
    const cleanSlug = slug.replace(/[/\-_]/g, '').toUpperCase();
    
    // Check if match in existing pairs
    const match = this.pairs().find(p => this.getSlugFromSymbol(p.symbol) === cleanSlug);
    if (match) return match.symbol;

    // Check custom 6-letter forex pairs
    if (cleanSlug.length === 6) {
      return `${cleanSlug.substring(0, 3)}/${cleanSlug.substring(3)}`;
    }

    return cleanSlug;
  }

  // Dynamic pillar scores adapted to active asset
  readonly pillarScores = computed<PillarScore[]>(() => {
    const pair = this.activePair();
    const isGold = pair.symbol === 'XAU/USD';
    const isBtc = pair.symbol === 'BTC/USD';
    const isJpy = pair.symbol === 'USD/JPY';

    if (isGold) {
      return [
        {
          name: 'Analyse Technique',
          bias: 'BULLISH',
          score: 89,
          detail: 'Consolidation au-dessus du support institutionnel, formation en biseau ascendant H4, RSI à 61.',
          icon: 'timeline'
        },
        {
          name: 'Fondamentaux & Macro',
          bias: 'BULLISH',
          score: 93,
          detail: 'Achats records des banques centrales, taux réels négatifs et demande refuge soutenue.',
          icon: 'account_balance'
        },
        {
          name: 'Calendrier Économique',
          bias: 'NEUTRAL',
          score: 74,
          detail: 'Attente des données d\'inflation CPI US, impact direct sur les rendements obligataires 10Y.',
          icon: 'event_note'
        },
        {
          name: 'Intelligence Synthétique (IA)',
          bias: 'BULLISH',
          score: 91,
          detail: 'Score multi-sources élevé (91%), ratio Risque/Rendement favorable 1:2.8 vers extension.',
          icon: 'psychology'
        }
      ];
    }

    if (isBtc) {
      return [
        {
          name: 'Analyse Technique',
          bias: 'BULLISH',
          score: 86,
          detail: 'Cassure de range journalier, moyennes mobiles exponentielles 20/50 alignées, volume acheteur croissant.',
          icon: 'timeline'
        },
        {
          name: 'Flux On-Chain & Macro',
          bias: 'BULLISH',
          score: 88,
          detail: 'Entrées nettes régulières sur les ETF Spot, diminution des réserves disponibles sur les plateformes.',
          icon: 'account_balance'
        },
        {
          name: 'Sentiment & Liquidité',
          bias: 'BULLISH',
          score: 84,
          detail: 'Indice Fear & Greed en zone d\'optimisme sain (68), taux de financement équilibré.',
          icon: 'event_note'
        },
        {
          name: 'Intelligence Synthétique (IA)',
          bias: 'BULLISH',
          score: 89,
          detail: 'Alignement algorithmique fort, probabilité de continuation haussière évaluée à 89%.',
          icon: 'psychology'
        }
      ];
    }

    if (isJpy) {
      return [
        {
          name: 'Analyse Technique',
          bias: 'BEARISH',
          score: 83,
          detail: 'Rejet sous la résistance majeure H4, cassure de ligne de tendance haussière, divergence baissière RSI.',
          icon: 'timeline'
        },
        {
          name: 'Politique Monétaire',
          bias: 'BEARISH',
          score: 81,
          detail: 'Resserrement de la Banque du Japon (BoJ) et réduction du différentiel de rendement avec le Dollar.',
          icon: 'account_balance'
        },
        {
          name: 'Calendrier & Risque',
          bias: 'NEUTRAL',
          score: 72,
          detail: 'Surveillance étroite des déclarations du gouverneur Ueda et interventions sur le Forex.',
          icon: 'event_note'
        },
        {
          name: 'Intelligence Synthétique (IA)',
          bias: 'BEARISH',
          score: 82,
          detail: 'Biais vendeur confirmé par l\'orchestrateur avec invalidation au-dessus du sommet précédent.',
          icon: 'psychology'
        }
      ];
    }

    // Default Forex (EUR/USD, GBP/USD, AUD/USD)
    return [
      {
        name: 'Analyse Technique',
        bias: pair.bias,
        score: pair.bias === 'BULLISH' ? 84 : pair.bias === 'BEARISH' ? 81 : 62,
        detail: `Structure H4 haussière, alignement EMA 50/200, test de zone de liquidité sur ${pair.symbol}.`,
        icon: 'timeline'
      },
      {
        name: 'Analyse Fondamentale',
        bias: 'NEUTRAL',
        score: 68,
        detail: 'Écarts de politique monétaire stables, différentiel de taux d\'intérêt sous contrôle.',
        icon: 'account_balance'
      },
      {
        name: 'Calendrier Économique',
        bias: 'BULLISH',
        score: 79,
        detail: 'Publication majeure à 14:30 GMT+1, filtre de volatilité activé 15 min avant.',
        icon: 'event_note'
      },
      {
        name: 'Intelligence Synthétique (IA)',
        bias: pair.bias,
        score: pair.aiConfidence,
        detail: `Convergence multi-facteurs favorable avec ratio R/R 1:2.4 pour ${pair.symbol}.`,
        icon: 'psychology'
      }
    ];
  });

  readonly upcomingEvents = signal<EconomicEvent[]>([
    {
      id: 'e1',
      time: '14:30',
      currency: 'USD',
      event: 'Core CPI (MoM / YoY)',
      impact: 'HIGH',
      forecast: '3.1%',
      previous: '3.3%'
    },
    {
      id: 'e2',
      time: '15:45',
      currency: 'EUR',
      event: 'PMI Manufacturier Flash',
      impact: 'MEDIUM',
      forecast: '49.8',
      previous: '48.9'
    },
    {
      id: 'e3',
      time: '19:00',
      currency: 'USD',
      event: 'Minutes du FOMC (Discours)',
      impact: 'HIGH',
      forecast: 'Focalisation Taux',
      previous: '-'
    }
  ]);

  readonly demoAccounts = signal<ConnectedAccount[]>([
    {
      id: 'acc-1',
      broker: 'Broker Partner A (MT5)',
      accountNumber: '78491029',
      type: 'DEMO',
      server: 'Partner-Demo-01',
      balance: 100000,
      equity: 102450,
      currency: 'USD',
      status: 'CONNECTED',
      isExecutionAllowed: true,
      maxRiskAllocation: 1.0
    },
    {
      id: 'acc-2',
      broker: 'Broker Partner B (MT5)',
      accountNumber: '44910283',
      type: 'DEMO',
      server: 'Partner-Pro-Demo',
      balance: 50000,
      equity: 50820,
      currency: 'EUR',
      status: 'CONNECTED',
      isExecutionAllowed: true,
      maxRiskAllocation: 0.5
    },
    {
      id: 'acc-3',
      broker: 'Broker Principal (MT5)',
      accountNumber: '99201844',
      type: 'LIVE',
      server: 'Partner-Live-Real02',
      balance: 25000,
      equity: 25000,
      currency: 'USD',
      status: 'DISABLED',
      isExecutionAllowed: false,
      maxRiskAllocation: 0.5
    }
  ]);

  readonly defaultRiskProfile = signal<RiskProfile>({
    riskPerTradePercent: 1.0,
    maxDailyLossPercent: 2.0,
    maxOpenPositions: 3,
    manualConfirmationRequired: true,
    stopLossMandatory: true,
    emergencyKillSwitch: true,
    allowedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD']
  });

  readonly automationTiers = signal<AutomationLevel[]>([
    {
      step: 1,
      id: 'analysis',
      title: 'Analyse & Synthèse',
      subtitle: 'Market Intelligence pure',
      description: 'Accédez à la synthèse technique, macroéconomique et aux événements de marché en temps réel. Aucune prise de position, outil d\'aide à la décision.',
      features: ['Scores de convergence multi-piliers', 'Aperçu des paires Forex majeures', 'Filtre d\'événements économiques'],
      requiresManualConfirm: true,
      badge: 'Niveau 1'
    },
    {
      step: 2,
      id: 'signals',
      title: 'Génération de Signaux',
      subtitle: 'Recommandations structurées',
      description: 'Recevez des alertes BUY / SELL / WAIT basées sur la convergence des indicateurs, avec niveaux d\'invalidation et ratio R/R définis.',
      features: ['Signaux Forex multi-timeframes', 'Niveaux TP / SL calculés', 'Score d\'alignement des critères'],
      requiresManualConfirm: true,
      badge: 'Niveau 2'
    },
    {
      step: 3,
      id: 'paper-trading',
      title: 'Paper Trading',
      subtitle: 'Simulation intégrée sans risque',
      description: 'Testez vos règles et scénarios dans un environnement virtuel interne sans engager de capital réel ni de compte broker.',
      features: ['Journal de simulation intégré', 'Validation de vos filtres de risque', 'Statistiques de cohérence'],
      requiresManualConfirm: true,
      badge: 'Niveau 3'
    },
    {
      step: 4,
      id: 'demo-automation',
      title: 'Automatisation Démo',
      subtitle: 'Exécution MT5 sur compte Démo Broker',
      description: 'Connectez vos propres comptes DEMO de votre courtier MT5 pour tester l\'envoi automatique selon vos règles strictes.',
      features: ['Passerelle MT5 Démo connectée', 'Validation stricte du Risk Engine', 'Confirmation manuelle paramétrable'],
      requiresManualConfirm: false,
      badge: 'Niveau 4'
    },
    {
      step: 5,
      id: 'advanced-automation',
      title: 'Automatisation Contrôlée',
      subtitle: 'Supervision sous vos propres règles',
      description: 'Orchestration encadrée avec verrouillage inviolable : seuil de perte journalière, risque par trade et confirmation au choix de l\'utilisateur.',
      features: ['Garde-fous inviolables', 'Disjoncteur automatique journalier', 'Sélection stricte des paires autorisées'],
      requiresManualConfirm: false,
      badge: 'Niveau 5'
    }
  ]);

  constructor() {
    // Pre-initialize candleStore with deep institutional-grade OHLC history (750+ candles)
    const initialStore: Record<string, Partial<Record<TimeframeType, Candle[]>>> = {};
    const tfs: TimeframeType[] = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];

    for (const p of this.pairs()) {
      initialStore[p.symbol] = {};
      for (const tf of tfs) {
        initialStore[p.symbol]![tf] = this.generateCandleSeries(p.symbol, tf, p.bid, p.digits, p.bias, 750);
      }
    }
    this.candleStore.set(initialStore);

    if (this.isBrowser) {
      // Fetch initial real market data from live APIs
      this.fetchRealMarketData();

      // Fetch live klines for active pair & timeframe
      this.fetchCandlesForPair(this.activePairSymbol(), this.selectedTimeframe());

      // Start continuous micro-tick simulation & interval polling
      this.initLiveTickEngine();
    }
  }

  setActivePair(symbol: string) {
    this.activePairSymbol.set(symbol);
    if (this.isBrowser) {
      this.fetchCandlesForPair(symbol, this.selectedTimeframe());
    }
  }

  setTimeframe(tf: TimeframeType) {
    this.selectedTimeframe.set(tf);
    if (this.isBrowser) {
      this.fetchCandlesForPair(this.activePairSymbol(), tf);
    }
  }

  toggleLiveStreaming() {
    this.isLiveStreaming.update(v => !v);
  }

  /**
   * Generates realistic Candlestick Series matching asset, timeframe and current market price
   * Produces a deep historical buffer of up to 1000+ candles with natural volatility & trends
   */
  generateCandleSeries(symbol: string, tf: TimeframeType, currentPrice: number, digits: number, bias: MarketBias, count = 750): Candle[] {
    const now = Date.now();
    let stepMs = 4 * 3600 * 1000;
    if (tf === 'M1') stepMs = 60 * 1000;
    else if (tf === 'M5') stepMs = 5 * 60 * 1000;
    else if (tf === 'M15') stepMs = 15 * 60 * 1000;
    else if (tf === 'M30') stepMs = 30 * 60 * 1000;
    else if (tf === 'H1') stepMs = 60 * 60 * 1000;
    else if (tf === 'H4') stepMs = 4 * 3600 * 1000;
    else if (tf === 'D1') stepMs = 24 * 3600 * 1000;

    let pipUnit = 0.0001;
    if (symbol === 'USD/JPY' || symbol === 'EUR/JPY' || symbol === 'GBP/JPY') pipUnit = 0.01;
    else if (symbol === 'XAU/USD' || symbol === 'XAG/USD' || symbol === 'ETH/USD') pipUnit = 0.10;
    else if (symbol === 'BTC/USD' || symbol === 'US30' || symbol === 'NAS100' || symbol === 'GER40') pipUnit = 1.0;

    let atrPips = 25;
    if (tf === 'M1') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 80 : symbol === 'XAU/USD' ? 10 : symbol.includes('JPY') ? 5 : 3;
    else if (tf === 'M5') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 140 : symbol === 'XAU/USD' ? 18 : symbol.includes('JPY') ? 8 : 5;
    else if (tf === 'M15') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 220 : symbol === 'XAU/USD' ? 25 : symbol.includes('JPY') ? 12 : 8;
    else if (tf === 'M30') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 360 : symbol === 'XAU/USD' ? 42 : symbol.includes('JPY') ? 18 : 12;
    else if (tf === 'H1') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 520 : symbol === 'XAU/USD' ? 65 : symbol.includes('JPY') ? 25 : 18;
    else if (tf === 'H4') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 1250 : symbol === 'XAU/USD' ? 160 : symbol.includes('JPY') ? 60 : 42;
    else if (tf === 'D1') atrPips = (symbol === 'BTC/USD' || symbol === 'US30') ? 2900 : symbol === 'XAU/USD' ? 380 : symbol.includes('JPY') ? 130 : 95;

    const atr = atrPips * pipUnit;
    const candles: Candle[] = [];
    let curr = currentPrice;

    // Generate historical candles backwards from current price with micro-cycles
    for (let i = count - 1; i >= 0; i--) {
      const time = now - (count - 1 - i) * stepMs;
      const dateObj = new Date(time);
      let timeLabel = '';
      if (tf === 'M1' || tf === 'M5' || tf === 'M15' || tf === 'M30' || tf === 'H1') {
        timeLabel = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      } else if (tf === 'H4') {
        const d = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const h = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        timeLabel = `${d} ${h}`;
      } else {
        timeLabel = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      }

      if (i === count - 1) {
        // Most recent candle matches current live price
        const openDelta = (Math.random() - 0.48) * atr * 0.75;
        const open = Number((curr - openDelta).toFixed(digits));
        const close = Number(curr.toFixed(digits));
        const high = Number((Math.max(open, close) + Math.random() * atr * 0.35).toFixed(digits));
        const low = Number((Math.min(open, close) - Math.random() * atr * 0.35).toFixed(digits));
        const volume = Math.floor(1800 + Math.random() * 4200);
        candles.unshift({ timestamp: time, timeLabel, open, high, low, close, volume });
        curr = open;
      } else {
        // Subtle cyclical waves to create realistic swing highs and swing lows
        const wave = Math.sin(i / 18) * 0.08;
        const trendFactor = bias === 'BULLISH' ? (0.53 + wave) : bias === 'BEARISH' ? (0.47 + wave) : (0.50 + wave);
        const move = (Math.random() - (1 - trendFactor)) * atr * 1.15;
        const close = Number(curr.toFixed(digits));
        const open = Number((curr - move).toFixed(digits));
        const high = Number((Math.max(open, close) + Math.random() * atr * 0.45).toFixed(digits));
        const low = Number((Math.min(open, close) - Math.random() * atr * 0.45).toFixed(digits));
        const volume = Math.floor(1200 + Math.random() * 4800);
        candles.unshift({ timestamp: time, timeLabel, open, high, low, close, volume });
        curr = open;
      }
    }

    return candles;
  }

  /**
   * Fetches real live klines from Binance API for crypto/gold or computes forex series with deep history (750+ candles)
   */
  async fetchCandlesForPair(symbol: string, tf: TimeframeType): Promise<void> {
    if (!this.isBrowser) return;

    try {
      const isBtc = symbol === 'BTC/USD';
      const isGold = symbol === 'XAU/USD';

      if (isBtc || isGold) {
        const binanceSymbol = isBtc ? 'BTCUSDT' : 'PAXGUSDT';
        const binanceInterval = tf === 'M1' ? '1m' : tf === 'M5' ? '5m' : tf === 'M15' ? '15m' : tf === 'M30' ? '30m' : tf === 'H1' ? '1h' : tf === 'H4' ? '4h' : '1d';
        
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${binanceInterval}&limit=1000`);
        if (res.ok) {
          const rawKlines: [number, string, string, string, string, string, ...unknown[]][] = await res.json();
          if (Array.isArray(rawKlines) && rawKlines.length > 0) {
            const formattedCandles: Candle[] = rawKlines.map(k => {
              const timestamp = k[0];
              const dateObj = new Date(timestamp);
              let timeLabel = '';
              if (tf === 'M1' || tf === 'M5' || tf === 'M15' || tf === 'M30' || tf === 'H1') {
                timeLabel = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              } else if (tf === 'H4') {
                const d = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                const h = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                timeLabel = `${d} ${h}`;
              } else {
                timeLabel = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
              }

              return {
                timestamp,
                timeLabel,
                open: Number(parseFloat(k[1]).toFixed(2)),
                high: Number(parseFloat(k[2]).toFixed(2)),
                low: Number(parseFloat(k[3]).toFixed(2)),
                close: Number(parseFloat(k[4]).toFixed(2)),
                volume: Number(parseFloat(k[5]).toFixed(1))
              };
            });

            this.candleStore.update(store => {
              return {
                ...store,
                [symbol]: {
                  ...(store[symbol] || {}),
                  [tf]: formattedCandles
                }
              };
            });
            return;
          }
        }
      }

      // For Forex pairs or if api fetch fails, generate synchronous high precision deep series
      const pair = this.pairs().find(p => p.symbol === symbol) || this.activePair();
      const existing = this.candleStore()[symbol]?.[tf];
      if (existing && existing.length >= 500) {
        // Already loaded deep history, no need to overwrite unless needed
        return;
      }

      const generated = this.generateCandleSeries(symbol, tf, pair.bid, pair.digits, pair.bias, 750);
      
      this.candleStore.update(store => {
        return {
          ...store,
          [symbol]: {
            ...(store[symbol] || {}),
            [tf]: generated
          }
        };
      });

    } catch (e) {
      console.warn('Kline fetch notice:', e);
    }
  }

  /**
   * Fetches real live quotes from public market endpoints
   */
  async fetchRealMarketData(): Promise<void> {
    this.isFetching.set(true);
    try {
      // Fetch Forex rates (ECB / OpenExchange baseline)
      const fxPromise = fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => res.ok ? res.json() : null)
        .catch(() => null);

      // Fetch Crypto (BTC/USDT) & Gold (PAXG/USDT backed 1:1 physical gold)
      const cryptoGoldPromise = fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","PAXGUSDT"]')
        .then(res => res.ok ? res.json() : null)
        .catch(() => null);

      const [fxData, cryptoGoldData] = await Promise.all([fxPromise, cryptoGoldPromise]);

      const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.lastSyncTime.set(new Date());

      this.pairs.update(currentPairs => {
        return currentPairs.map(p => {
          let newBid = p.bid;
          let newAsk = p.ask;
          let newChange = p.change24h;
          let newHigh = p.high24h;
          let newLow = p.low24h;
          let newSpread = p.spread;

          // 1. EUR/USD
          if (p.symbol === 'EUR/USD' && fxData?.rates?.EUR) {
            const rate = 1 / fxData.rates.EUR;
            newBid = Number(rate.toFixed(5));
            newSpread = 0.8;
            newAsk = Number((newBid + (newSpread * p.pipSize)).toFixed(5));
            newHigh = Number((newBid * 1.003).toFixed(5));
            newLow = Number((newBid * 0.997).toFixed(5));
          }

          // 2. GBP/USD
          if (p.symbol === 'GBP/USD' && fxData?.rates?.GBP) {
            const rate = 1 / fxData.rates.GBP;
            newBid = Number(rate.toFixed(5));
            newSpread = 1.1;
            newAsk = Number((newBid + (newSpread * p.pipSize)).toFixed(5));
            newHigh = Number((newBid * 1.004).toFixed(5));
            newLow = Number((newBid * 0.996).toFixed(5));
          }

          // 3. USD/JPY
          if (p.symbol === 'USD/JPY' && fxData?.rates?.JPY) {
            newBid = Number(fxData.rates.JPY.toFixed(3));
            newSpread = 0.9;
            newAsk = Number((newBid + (newSpread * p.pipSize)).toFixed(3));
            newHigh = Number((newBid * 1.006).toFixed(3));
            newLow = Number((newBid * 0.994).toFixed(3));
          }

          // 4. AUD/USD
          if (p.symbol === 'AUD/USD' && fxData?.rates?.AUD) {
            const rate = 1 / fxData.rates.AUD;
            newBid = Number(rate.toFixed(5));
            newSpread = 1.2;
            newAsk = Number((newBid + (newSpread * p.pipSize)).toFixed(5));
            newHigh = Number((newBid * 1.004).toFixed(5));
            newLow = Number((newBid * 0.995).toFixed(5));
          }

          // 5. Gold XAU/USD (from Binance PAXGUSDT 1:1 physical gold backing or fallback)
          if (p.symbol === 'XAU/USD' && Array.isArray(cryptoGoldData)) {
            const goldTicker = cryptoGoldData.find((t: { symbol: string }) => t.symbol === 'PAXGUSDT');
            if (goldTicker) {
              newBid = Number(parseFloat(goldTicker.bidPrice || goldTicker.lastPrice).toFixed(2));
              newAsk = Number(parseFloat(goldTicker.askPrice || (goldTicker.lastPrice * 1.0003).toString()).toFixed(2));
              newSpread = Number((newAsk - newBid).toFixed(2)) || 0.40;
              newChange = Number(parseFloat(goldTicker.priceChangePercent).toFixed(2));
              newHigh = Number(parseFloat(goldTicker.highPrice).toFixed(2));
              newLow = Number(parseFloat(goldTicker.lowPrice).toFixed(2));
            }
          }

          // 6. Bitcoin BTC/USD (from Binance BTCUSDT)
          if (p.symbol === 'BTC/USD' && Array.isArray(cryptoGoldData)) {
            const btcTicker = cryptoGoldData.find((t: { symbol: string }) => t.symbol === 'BTCUSDT');
            if (btcTicker) {
              newBid = Number(parseFloat(btcTicker.bidPrice || btcTicker.lastPrice).toFixed(2));
              newAsk = Number(parseFloat(btcTicker.askPrice || (btcTicker.lastPrice + 2).toString()).toFixed(2));
              newSpread = Number((newAsk - newBid).toFixed(2)) || 1.50;
              newChange = Number(parseFloat(btcTicker.priceChangePercent).toFixed(2));
              newHigh = Number(parseFloat(btcTicker.highPrice).toFixed(2));
              newLow = Number(parseFloat(btcTicker.lowPrice).toFixed(2));
            }
          }

          // Update sparkline with the real current price
          const updatedSparkline = [...p.sparkline.slice(1), newBid];

          return {
            ...p,
            bid: newBid,
            ask: newAsk,
            spread: newSpread,
            change24h: newChange,
            high24h: newHigh,
            low24h: newLow,
            bias: newChange >= 0.2 ? 'BULLISH' : newChange <= -0.2 ? 'BEARISH' : 'NEUTRAL',
            trend: newChange > 1.0 ? 'STRONG_BUY' : newChange > 0.1 ? 'BUY' : newChange < -1.0 ? 'STRONG_SELL' : newChange < -0.1 ? 'SELL' : 'NEUTRAL',
            sparkline: updatedSparkline,
            lastUpdated: nowStr
          };
        });
      });

      // Synchronize and align candle store with new live rates to prevent sudden candle jumps
      const currentPairs = this.pairs();
      const tfs: TimeframeType[] = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];
      this.candleStore.update(store => {
        const updated = { ...store };
        for (const p of currentPairs) {
          // Keep crypto/gold Binance candles if already loaded, regenerate forex with coherent live baseline
          if (p.symbol !== 'BTC/USD' && p.symbol !== 'XAU/USD') {
            if (!updated[p.symbol]) updated[p.symbol] = {};
            for (const tf of tfs) {
              updated[p.symbol]![tf] = this.generateCandleSeries(p.symbol, tf, p.bid, p.digits, p.bias, 50);
            }
          }
        }
        return updated;
      });
    } catch (err) {
      console.warn('Real market data fetch issue, keeping live ticks:', err);
    } finally {
      this.isFetching.set(false);
    }
  }

  /**
   * Initialise la réception en temps réel des cotations de marché
   * via le flux WebSocket STOMP (/topic/quotes) du backend Spring Boot.
   */
  private initLiveTickEngine(): void {
    if (!this.isBrowser) return;

    // Abonnement direct au topic STOMP émis par le Backend Spring Boot
    this.websocketService.subscribe<any[]>('/topic/quotes').subscribe({
      next: (quotes) => {
        if (!this.isLiveStreaming() || !Array.isArray(quotes) || quotes.length === 0) return;

        this.tickCounter.update(c => c + 1);
        const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const activeSym = this.activePairSymbol();
        const activeTf = this.selectedTimeframe();

        this.pairs.update(currentPairs => {
          return currentPairs.map(p => {
            const incoming = quotes.find(q => q.symbol === p.symbol);
            if (!incoming) return p;

            const newBid = Number(incoming.bid);
            const newAsk = Number(incoming.ask);
            const tickDir = incoming.lastTickDirection || (newBid >= p.bid ? 'UP' : 'DOWN');
            const spark = incoming.sparkline || [...p.sparkline.slice(1), newBid];

            if (p.symbol === activeSym) {
              this.updateLiveCandleTick(activeSym, activeTf, newBid, p.digits);
            }

            return {
              ...p,
              bid: newBid,
              ask: newAsk,
              spread: incoming.spread ?? p.spread,
              change24h: incoming.change24h ?? p.change24h,
              high24h: incoming.high24h ?? p.high24h,
              low24h: incoming.low24h ?? p.low24h,
              bias: incoming.bias ?? p.bias,
              trend: incoming.trend ?? p.trend,
              aiConfidence: incoming.aiConfidence ?? p.aiConfidence,
              lastTickDirection: tickDir,
              sparkline: spark,
              lastUpdated: nowStr
            };
          });
        });
      },
      error: (err) => console.warn('[MarketService] Erreur flux WebSocket:', err)
    });
  }

  /**
   * Updates the latest candle of the active series with incoming micro-ticks
   * Efficiently mutates only the forming candle or rolls over to a new candle when the timeframe period expires
   */
  private updateLiveCandleTick(symbol: string, tf: TimeframeType, currentPrice: number, digits: number): void {
    this.candleStore.update(store => {
      const pairSeries = store[symbol]?.[tf];
      if (!pairSeries || pairSeries.length === 0) return store;

      const now = Date.now();
      let stepMs = 60 * 60 * 1000;
      if (tf === 'M1') stepMs = 60 * 1000;
      else if (tf === 'M5') stepMs = 5 * 60 * 1000;
      else if (tf === 'M15') stepMs = 15 * 60 * 1000;
      else if (tf === 'M30') stepMs = 30 * 60 * 1000;
      else if (tf === 'H1') stepMs = 60 * 60 * 1000;
      else if (tf === 'H4') stepMs = 4 * 3600 * 1000;
      else if (tf === 'D1') stepMs = 24 * 3600 * 1000;

      const lastIdx = pairSeries.length - 1;
      const lastCandle = pairSeries[lastIdx];

      // Check if current candle period has completed and a new candle should open
      if (now - lastCandle.timestamp >= stepMs) {
        const dateObj = new Date(now);
        let timeLabel = '';
        if (tf === 'M1' || tf === 'M5' || tf === 'M15' || tf === 'M30' || tf === 'H1') {
          timeLabel = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (tf === 'H4') {
          const d = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
          const h = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          timeLabel = `${d} ${h}`;
        } else {
          timeLabel = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        }

        const newCandle: Candle = {
          timestamp: now,
          timeLabel,
          open: currentPrice,
          high: currentPrice,
          low: currentPrice,
          close: currentPrice,
          volume: Math.floor(10 + Math.random() * 20)
        };

        // Maintain buffer size up to 1000 candles
        const newSeries = pairSeries.length >= 1000 
          ? [...pairSeries.slice(pairSeries.length - 999), newCandle] 
          : [...pairSeries, newCandle];

        return {
          ...store,
          [symbol]: {
            ...(store[symbol] || {}),
            [tf]: newSeries
          }
        };
      }

      // If price suddenly jumps significantly (> 2.0% gap from preceding candle), smoothly recalibrate series
      const priceGap = Math.abs(currentPrice - (lastCandle.open || currentPrice)) / (lastCandle.open || 1);
      if (priceGap > 0.025) {
        const pair = this.pairs().find(p => p.symbol === symbol);
        const bias = pair?.bias || 'NEUTRAL';
        const regenerated = this.generateCandleSeries(symbol, tf, currentPrice, digits, bias, pairSeries.length);
        return {
          ...store,
          [symbol]: {
            ...(store[symbol] || {}),
            [tf]: regenerated
          }
        };
      }

      const newHigh = Number(Math.max(lastCandle.high, currentPrice).toFixed(digits));
      const newLow = Number(Math.min(lastCandle.low, currentPrice).toFixed(digits));
      const newClose = Number(currentPrice.toFixed(digits));
      const newVol = lastCandle.volume + Math.floor(Math.random() * 4) + 1;

      const updatedCandles = [...pairSeries];
      updatedCandles[lastIdx] = {
        ...lastCandle,
        high: newHigh,
        low: newLow,
        close: newClose,
        volume: newVol
      };

      return {
        ...store,
        [symbol]: {
          ...(store[symbol] || {}),
          [tf]: updatedCandles
        }
      };
    });
  }

  toggleAccountExecution(accountId: string) {
    this.demoAccounts.update(accounts => 
      accounts.map(acc => {
        if (acc.id === accountId) {
          if (acc.type === 'LIVE' && acc.status === 'DISABLED') {
            return { ...acc, isExecutionAllowed: false };
          }
          return { ...acc, isExecutionAllowed: !acc.isExecutionAllowed };
        }
        return acc;
      })
    );
  }
}

