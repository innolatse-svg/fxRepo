/**
 * WebSocketService
 * Service de communication temps réel basé sur le protocole STOMP sur WebSocket / SockJS.
 * Gère la connexion sécurisée (JWT), les souscriptions aux topics publics/privés et la résilience réseau.
 *
 * @date 2026-08-26
 */
import { Injectable, signal, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';

export type WebSocketConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

export interface WebSocketPacket<T = unknown> {
  topic: string;
  data: T;
  timestamp: string;
  sequenceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly status = signal<WebSocketConnectionStatus>('DISCONNECTED');
  readonly latencyMs = signal<number>(0);
  readonly packetsReceivedCount = signal<number>(0);
  readonly isConnected = signal<boolean>(false);

  private stompClient: Client | null = null;
  private messageSubject = new Subject<{ topic: string; payload: unknown }>();
  private seqCounter = 0;
  private latencyIntervalId: any = null;

  constructor() {
    if (this.isBrowser) {
      this.initStompClient();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  /**
   * Initialise le client STOMP avec transport SockJS et authentification JWT
   */
  private initStompClient(): void {
    const token = localStorage.getItem('token');

    this.status.set('CONNECTING');

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      debug: (msg: string) => {
        // Log désactivé en production pour performance
        if (!environment.production) {
          // console.debug('[STOMP]', msg);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = () => {
      this.status.set('CONNECTED');
      this.isConnected.set(true);
      this.startLatencyMonitor();

      // Souscription automatique au topic de cotations de marché
      this.subscribeInternal('/topic/quotes');
      this.subscribeInternal('/topic/signals');
      this.subscribeInternal('/user/queue/signals');
    };

    this.stompClient.onDisconnect = () => {
      this.status.set('DISCONNECTED');
      this.isConnected.set(false);
      this.stopLatencyMonitor();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('[STOMP Error]', frame.headers['message'], frame.body);
      this.status.set('DISCONNECTED');
      this.isConnected.set(false);
    };

    this.stompClient.onWebSocketClose = () => {
      if (this.status() === 'CONNECTED') {
        this.status.set('RECONNECTING');
      }
      this.isConnected.set(false);
      this.stopLatencyMonitor();
    };

    try {
      this.stompClient.activate();
    } catch (err) {
      console.error('[STOMP Activation Error]', err);
      this.status.set('DISCONNECTED');
    }
  }

  /**
   * Souscrit en interne auprès du broker STOMP et route les trames vers le Subject global
   */
  private subscribeInternal(topic: string): void {
    if (!this.stompClient || !this.stompClient.connected) return;

    this.stompClient.subscribe(topic, (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body);
        this.seqCounter++;
        this.packetsReceivedCount.update(c => c + 1);
        this.messageSubject.next({ topic, payload });
      } catch (e) {
        console.warn(`[STOMP] Format de trame non-JSON reçu sur ${topic}`, message.body);
      }
    });
  }

  /**
   * Souscrit réactivement à un topic STOMP (ex: /topic/quotes, /topic/signals)
   *
   * @param topic Nom de la destination STOMP
   * @returns Observable émettant les données typées reçues
   */
  subscribe<T>(topic: string): Observable<T> {
    // Si déjà connecté, assurer la souscription active
    if (this.stompClient && this.stompClient.connected) {
      this.subscribeInternal(topic);
    }

    return this.messageSubject.asObservable().pipe(
      filter(msg => msg.topic === topic),
      map(msg => msg.payload as T)
    );
  }

  /**
   * Déconnexion explicite (utilisée par le Kill Switch d'urgence)
   */
  disconnect(): void {
    this.stopLatencyMonitor();
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (e) {
        console.warn('[STOMP] Erreur lors de la désactivation', e);
      }
      this.stompClient = null;
    }
    this.status.set('DISCONNECTED');
    this.isConnected.set(false);
  }

  /**
   * Reconnexion manuelle ou après réarmement du Kill Switch
   */
  reconnect(): void {
    this.disconnect();
    this.status.set('RECONNECTING');
    setTimeout(() => {
      this.initStompClient();
    }, 500);
  }

  /**
   * Mesure de latence simulée pour l'indicateur UI
   */
  private startLatencyMonitor(): void {
    this.stopLatencyMonitor();
    this.latencyIntervalId = setInterval(() => {
      const ping = Math.floor(12 + Math.random() * 10);
      this.latencyMs.set(ping);
    }, 3000);
  }

  private stopLatencyMonitor(): void {
    if (this.latencyIntervalId) {
      clearInterval(this.latencyIntervalId);
      this.latencyIntervalId = null;
    }
    this.latencyMs.set(0);
  }
}
