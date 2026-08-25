import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatusType = 'CONNECTED' | 'DISCONNECTED' | 'DISABLED' | 'ACTIVE' | 'PENDING' | 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'CONTROLLED';

@Component({
  selector: 'app-status-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wider" [class]="textClass()">
      <span class="relative flex h-2 w-2">
        @if (pulse()) {
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" [class]="pingClass()"></span>
        }
        <span class="relative inline-flex rounded-full h-2 w-2" [class]="dotClass()"></span>
      </span>
      <span>{{ label() || status() }}</span>
    </span>
  `,
  styles: ``
})
export class StatusIndicatorComponent {
  status = input.required<StatusType | string>();
  label = input<string | null>(null);
  pulse = input<boolean>(true);

  private readonly normalized = computed(() => (this.status() || '').toUpperCase());

  textClass = computed(() => {
    switch (this.normalized()) {
      case 'CONNECTED':
      case 'ACTIVE':
      case 'BULLISH':
      case 'CONTROLLED':
        return 'text-emerald-400';
      case 'DISCONNECTED':
      case 'BEARISH':
      case 'DISABLED':
        return 'text-rose-400';
      case 'PENDING':
      case 'NEUTRAL':
        return 'text-amber-400';
      default:
        return 'text-cyan-400';
    }
  });

  dotClass = computed(() => {
    switch (this.normalized()) {
      case 'CONNECTED':
      case 'ACTIVE':
      case 'BULLISH':
      case 'CONTROLLED':
        return 'bg-emerald-500';
      case 'DISCONNECTED':
      case 'BEARISH':
      case 'DISABLED':
        return 'bg-rose-500';
      case 'PENDING':
      case 'NEUTRAL':
        return 'bg-amber-500';
      default:
        return 'bg-cyan-500';
    }
  });

  pingClass = computed(() => {
    switch (this.normalized()) {
      case 'CONNECTED':
      case 'ACTIVE':
      case 'BULLISH':
      case 'CONTROLLED':
        return 'bg-emerald-400';
      case 'DISCONNECTED':
      case 'BEARISH':
      case 'DISABLED':
        return 'bg-rose-400';
      case 'PENDING':
      case 'NEUTRAL':
        return 'bg-amber-400';
      default:
        return 'bg-cyan-400';
    }
  });
}
