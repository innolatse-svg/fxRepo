import { Injectable, signal, computed } from '@angular/core';

export type NotificationCategory = 'SIGNAL' | 'RISK' | 'SYSTEM' | 'CALENDAR';
export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'INFO';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string | number>;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'SIGNAL',
    priority: 'HIGH',
    title: 'Opportunité Haute Confluence Détectée (EUR/USD)',
    message: 'Alignement technique H4, différentiel de taux USD favorable et validation du filtre macro. Score : 88%.',
    timestamp: 'Il y a 5 min',
    read: false,
    actionUrl: '/app/signals',
    actionLabel: 'Examiner le signal',
    metadata: { symbol: 'EUR/USD', score: 88 }
  },
  {
    id: 'notif-2',
    category: 'RISK',
    priority: 'MEDIUM',
    title: 'Exposition du Portefeuille : 2.85%',
    message: 'Niveau d\'exposition actuel sous contrôle. Le plafond maximal configuré est de 6.00%.',
    timestamp: 'Il y a 25 min',
    read: false,
    actionUrl: '/app/risk',
    actionLabel: 'Tableau du Risque'
  },
  {
    id: 'notif-3',
    category: 'CALENDAR',
    priority: 'HIGH',
    title: 'Annonce Macroéconomique : Core CPI (USD)',
    message: 'Publication majeure à 14:30 GMT+1. Le filtre de protection de volatilité suspendra les nouvelles entrées ±15 min.',
    timestamp: 'Il y a 45 min',
    read: true,
    actionUrl: '/app/calendar',
    actionLabel: 'Voir le calendrier'
  },
  {
    id: 'notif-4',
    category: 'SYSTEM',
    priority: 'INFO',
    title: 'Passerelle MT5 Sandbox Synchronisée',
    message: 'Connexion stable avec le serveur Deriv-Demo (Ping : 21 ms). Ordres virtuels routés sans encombre.',
    timestamp: 'Il y a 1h 30',
    read: true,
    actionUrl: '/app/accounts',
    actionLabel: 'Gérer les comptes'
  },
  {
    id: 'notif-5',
    category: 'SIGNAL',
    priority: 'MEDIUM',
    title: 'Signal GBP/USD Validé (Rebond FVG)',
    message: 'Comblement de Fair Value Gap H1 à 1.2885 avec réaction acheteuse institutionnelle. Score : 82%.',
    timestamp: 'Il y a 2h 10',
    read: true,
    actionUrl: '/app/signals',
    actionLabel: 'Voir le signal'
  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  readonly notifications = signal<AppNotification[]>(INITIAL_NOTIFICATIONS);

  readonly unreadCount = computed(() => {
    return this.notifications().filter(n => !n.read).length;
  });

  readonly highPriorityCount = computed(() => {
    return this.notifications().filter(n => n.priority === 'HIGH' && !n.read).length;
  });

  markAsRead(id: string) {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  deleteNotification(id: string) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  clearAll() {
    this.notifications.set([]);
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now().toString(36)}`,
      timestamp: 'À l\'instant',
      read: false
    };
    this.notifications.update(list => [newNotif, ...list]);
  }
}
