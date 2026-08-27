/**
 * TradingAccountService
 * Service client Angular pour la gestion des comptes MT5 et l'interaction avec le Credential Vault (/api/v1/accounts).
 *
 * @date 2026-08-26
 */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateTradingAccountRequest {
  broker: string;
  server: string;
  login: string;
  password: string;
  accountType: 'DEMO' | 'LIVE';
}

export interface TradingAccountResponse {
  id: string;
  broker: string;
  server: string;
  login: string;
  accountType: 'DEMO' | 'LIVE';
  balance: number;
  equity: number;
  currency: string;
  leverage: string;
  connected: boolean;
  autoTradingEnabled: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TradingAccountService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  readonly accounts = signal<TradingAccountResponse[]>([]);
  readonly isLoading = signal<boolean>(false);

  /**
   * Récupère la liste des comptes connectés pour l'utilisateur
   */
  async fetchAccounts(): Promise<TradingAccountResponse[]> {
    this.isLoading.set(true);
    try {
      const list = await firstValueFrom(this.http.get<TradingAccountResponse[]>(this.apiUrl));
      this.accounts.set(list || []);
      this.isLoading.set(false);
      return list || [];
    } catch {
      this.isLoading.set(false);
      return [];
    }
  }

  /**
   * Connecte et enregistre un compte dans le Credential Vault
   */
  async createAccount(request: CreateTradingAccountRequest): Promise<TradingAccountResponse> {
    const created = await firstValueFrom(this.http.post<TradingAccountResponse>(this.apiUrl, request));
    this.accounts.update(list => [created, ...list]);
    return created;
  }

  /**
   * Supprime un compte et ses identifiants du Vault
   */
  async deleteAccount(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
    this.accounts.update(list => list.filter(a => a.id !== id));
  }

  /**
   * Active ou désactive le trading automatique
   */
  async toggleAutoTrading(id: string): Promise<TradingAccountResponse> {
    const updated = await firstValueFrom(
      this.http.patch<TradingAccountResponse>(`${this.apiUrl}/${id}/toggle-trading`, {})
    );
    this.accounts.update(list => list.map(a => a.id === id ? updated : a));
    return updated;
  }

  /**
   * Synchronise en direct les soldes et l'équité du compte via le Bridge MT5
   */
  async syncAccount(id: string): Promise<TradingAccountResponse> {
    const synced = await firstValueFrom(
      this.http.get<TradingAccountResponse>(`${this.apiUrl}/${id}/sync`)
    );
    this.accounts.update(list => list.map(a => a.id === id ? synced : a));
    return synced;
  }
}
