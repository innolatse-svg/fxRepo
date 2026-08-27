/**
 * CalendarService
 * Service client Angular pour le calendrier macroéconomique (/api/v1/market/calendar).
 *
 * @date 2026-08-26
 */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type EventImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  countryCode: string;
  title: string;
  impact: EventImpact;
  actual?: string;
  forecast: string;
  previous: string;
  affectedPairs: string[];
  historicalPipMove: number;
  aiNote: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/market/calendar`;

  readonly events = signal<EconomicEvent[]>([]);
  readonly isLoading = signal<boolean>(false);

  /**
   * Récupère le calendrier macroéconomique hebdomadaire
   */
  async fetchCalendar(): Promise<EconomicEvent[]> {
    this.isLoading.set(true);
    try {
      const list = await firstValueFrom(this.http.get<EconomicEvent[]>(this.apiUrl));
      if (list && list.length > 0) {
        this.events.set(list);
      }
      this.isLoading.set(false);
      return list || [];
    } catch (e) {
      this.isLoading.set(false);
      console.warn('[CalendarService] Erreur chargement calendrier', e);
      return [];
    }
  }
}
