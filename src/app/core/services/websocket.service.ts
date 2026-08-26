import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
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
export class WebSocketService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly status = signal<WebSocketConnectionStatus>('CONNECTED');
  readonly latencyMs = signal<number>(22);
  readonly packetsReceivedCount = signal<number>(0);
  readonly isMockMode = signal<boolean>(environment.useMockData);

  private subjects = new Map<string, Subject<WebSocketPacket<unknown>>>();
  private seqCounter = 0;

  constructor() {
    if (this.isBrowser) {
      this.initConnection();
    }
  }

  private initConnection(): void {
    if (this.isMockMode()) {
      this.status.set('CONNECTED');
      // Simulate incoming packets on subscribed topics
      setInterval(() => {
        this.seqCounter++;
        this.packetsReceivedCount.update(c => c + 1);
        const jitter = Math.floor(18 + Math.random() * 8);
        this.latencyMs.set(jitter);
      }, 2000);
    } else {
      // In real Spring Boot deployment, instantiate real WebSocket / SockJS STOMP client
      this.status.set('CONNECTING');
      try {
        const ws = new WebSocket(environment.wsUrl);
        ws.onopen = () => {
          this.status.set('CONNECTED');
        };
        ws.onclose = () => {
          this.status.set('DISCONNECTED');
        };
        ws.onerror = () => {
          this.status.set('DISCONNECTED');
        };
        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data) as WebSocketPacket;
            this.emitToTopic(parsed.topic, parsed.data);
          } catch (e) {
            console.warn('[WS] Malformed packet', e);
          }
        };
      } catch {
        this.status.set('DISCONNECTED');
      }
    }
  }

  /**
   * Subscribe to a real-time topic (e.g. /topic/signals, /topic/ticks, /topic/risk-alerts)
   */
  subscribe<T>(topic: string): Observable<WebSocketPacket<T>> {
    if (!this.subjects.has(topic)) {
      this.subjects.set(topic, new Subject<WebSocketPacket<unknown>>());
    }
    return this.subjects.get(topic)!.asObservable() as Observable<WebSocketPacket<T>>;
  }

  /**
   * Publish a message to a topic or trigger an internal simulated packet
   */
  emitToTopic<T>(topic: string, data: T): void {
    if (this.subjects.has(topic)) {
      const packet: WebSocketPacket<T> = {
        topic,
        data,
        timestamp: new Date().toISOString(),
        sequenceId: ++this.seqCounter
      };
      this.subjects.get(topic)!.next(packet);
    }
  }

  /**
   * Reconnect to the WebSocket endpoint
   */
  reconnect(): void {
    this.status.set('RECONNECTING');
    setTimeout(() => {
      this.initConnection();
    }, 1000);
  }
}
