/**
 * BacktestingService
 * Service client Angular pour le Laboratoire de Backtesting (/api/v1/backtesting).
 *
 * @date 2026-08-26
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BacktestRequest {
  strategyId: string;
  symbol: string;
  timeframe: string;
  period: string; // "1Y", "3Y", "5Y"
  initialCapital: number;
  riskPerTradePct: number;
}

export interface EquityPoint {
  timestamp: string;
  equity: number;
  drawdownPct: number;
}

export interface BacktestTradeItem {
  id: string;
  entryTime: string;
  exitTime: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnlDollar: number;
  rMultiple: number;
  outcome: 'WIN' | 'LOSS';
  duration: string;
}

export interface StrategyInfo {
  id: string;
  name: string;
  description: string;
}

export interface BacktestResult {
  strategyId: string;
  strategyName: string;
  initialCapital: number;
  finalCapital: number;
  netProfitDollar: number;
  netProfitPct: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  expectancyR: number;
  equityCurve: EquityPoint[];
  trades: BacktestTradeItem[];
}

@Injectable({
  providedIn: 'root'
})
export class BacktestingService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/backtesting`;

  /**
   * Lance une simulation quantitatif de backtest sur le backend
   */
  async runBacktest(request: BacktestRequest): Promise<BacktestResult> {
    return await firstValueFrom(
      this.http.post<BacktestResult>(`${this.apiUrl}/run`, request)
    );
  }

  /**
   * Récupère la liste des stratégies disponibles
   */
  async getStrategies(): Promise<StrategyInfo[]> {
    return await firstValueFrom(
      this.http.get<StrategyInfo[]>(`${this.apiUrl}/strategies`)
    );
  }
}
