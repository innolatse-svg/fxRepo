/**
 * RiskEngineService
 * Service client Angular connecté à l'API REST du Risk Engine Spring Boot (/api/v1/risk).
 * Assure la conformité Zero-Trust de chaque intention d'ordre et l'audit de traçabilité.
 *
 * @date 2026-08-26
 */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TradeIntent {
  symbol: string;
  direction?: 'BUY' | 'SELL';
  lotSize: number;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  requestedRiskPct: number;
  accountBalance?: number;
  currentOpenPositions?: number;
  currentExposurePct?: number;
  currentDailyLossPct?: number;
}

export interface RiskEvaluationResult {
  decision: 'ALLOWED' | 'REJECTED';
  allowed: boolean;
  reason: string;
  effectiveRiskPct: number;
  appliedCeiling: string;
  maxAllowedLotSize: number;
}

export interface RiskAuditLogItem {
  id: string;
  symbol: string;
  actionType: string;
  requestedRiskPct: number;
  lotSize: number;
  decision: 'ALLOWED' | 'REJECTED';
  reason: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RiskEngineService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly auditLogs = signal<RiskAuditLogItem[]>([]);
  readonly isLoadingLogs = signal<boolean>(false);
  readonly lastEvaluation = signal<RiskEvaluationResult | null>(null);

  /**
   * Évalue une intention de trade auprès du Risk Engine Backend
   *
   * @param intent Paramètres financiers du trade envisagé
   * @returns Résultat de l'analyse avec décision et motif
   */
  async evaluateTrade(intent: TradeIntent): Promise<RiskEvaluationResult> {
    try {
      const result = await firstValueFrom(
        this.http.post<RiskEvaluationResult>(`${this.apiUrl}/risk/evaluate`, intent)
      );
      this.lastEvaluation.set(result);
      // Actualise les logs après chaque évaluation
      this.fetchAuditLogs();
      return result;
    } catch (e: any) {
      const fallback: RiskEvaluationResult = {
        decision: 'REJECTED',
        allowed: false,
        reason: e.error?.message || 'Erreur de communication avec le Risk Engine backend.',
        effectiveRiskPct: 1.0,
        appliedCeiling: 'COMMUNICATION_FAILURE',
        maxAllowedLotSize: 0.0
      };
      this.lastEvaluation.set(fallback);
      return fallback;
    }
  }

  /**
   * Récupère l'historique complet des décisions d'audit pour l'utilisateur
   */
  async fetchAuditLogs(): Promise<RiskAuditLogItem[]> {
    this.isLoadingLogs.set(true);
    try {
      const logs = await firstValueFrom(
        this.http.get<RiskAuditLogItem[]>(`${this.apiUrl}/risk/audit-logs`)
      );
      this.auditLogs.set(logs || []);
      this.isLoadingLogs.set(false);
      return logs;
    } catch (e) {
      this.isLoadingLogs.set(false);
      return [];
    }
  }
}
