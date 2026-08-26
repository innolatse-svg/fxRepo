import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoBadgeVariant = 'emerald' | 'amber' | 'cyan' | 'neutral';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (routerLinkTarget()) {
      <a 
        [routerLink]="routerLinkTarget()" 
        class="group inline-flex items-center gap-3 select-none transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
        [attr.aria-label]="ariaLabel()">
        <ng-container *ngTemplateOutlet="logoContent"></ng-container>
      </a>
    } @else {
      <div 
        class="group inline-flex items-center gap-3 select-none"
        [attr.aria-label]="ariaLabel()">
        <ng-container *ngTemplateOutlet="logoContent"></ng-container>
      </div>
    }

    <ng-template #logoContent>
      <!-- Emblem / Icon FI -->
      <div 
        class="flex-shrink-0 flex items-center justify-center font-black text-black italic tracking-tighter shadow-md transition-all duration-200 group-hover:scale-105"
        [class]="emblemClasses()">
        FI
      </div>

      <!-- Brand Wordmark & Badges -->
      @if (showText()) {
        <div class="flex flex-col text-left">
          <div class="flex items-center gap-2">
            <span 
              class="font-extrabold tracking-tight text-white uppercase font-sans transition-colors"
              [class]="titleClasses()">
              Forex Intel
            </span>

            @if (badge()) {
              <span 
                class="rounded-md font-mono font-bold tracking-wider uppercase border transition-colors leading-none"
                [class]="badgeClasses()">
                {{ badge() }}
              </span>
            }
          </div>

          @if (subtitle()) {
            <span 
              class="font-mono text-slate-400 tracking-wider uppercase text-[10px] mt-0.5">
              {{ subtitle() }}
            </span>
          }
        </div>
      }
    </ng-template>
  `,
  styles: ``
})
export class LogoComponent {
  size = input<LogoSize>('md');
  badge = input<string | null>(null);
  badgeVariant = input<LogoBadgeVariant>('emerald');
  subtitle = input<string | null>(null);
  routerLink = input<string | null>(null);
  showText = input<boolean>(true);

  routerLinkTarget = computed(() => this.routerLink());

  ariaLabel = computed(() => {
    return 'Forex Intel' + (this.badge() ? ` ${this.badge()}` : '');
  });

  emblemClasses = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'w-7 h-7 rounded-lg text-xs bg-emerald-500 shadow-emerald-500/10 group-hover:bg-emerald-400';
      case 'lg':
        return 'w-10 h-10 rounded-xl text-sm bg-emerald-500 shadow-emerald-500/20 group-hover:bg-emerald-400';
      case 'xl':
        return 'w-12 h-12 rounded-2xl text-base bg-emerald-500 shadow-emerald-500/20 group-hover:bg-emerald-400';
      case 'md':
      default:
        return 'w-9 h-9 rounded-xl text-xs bg-emerald-500 shadow-emerald-500/15 group-hover:bg-emerald-400';
    }
  });

  titleClasses = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'text-sm sm:text-base';
      case 'lg':
        return 'text-xl sm:text-2xl';
      case 'xl':
        return 'text-2xl sm:text-3xl';
      case 'md':
      default:
        return 'text-lg';
    }
  });

  badgeClasses = computed(() => {
    const sizeMap: Record<LogoSize, string> = {
      sm: 'px-1.5 py-0.5 text-[9px]',
      md: 'px-2 py-0.5 text-[10px]',
      lg: 'px-2.5 py-1 text-[11px]',
      xl: 'px-3 py-1 text-xs'
    };

    const currentSize = sizeMap[this.size()] || sizeMap.md;

    switch (this.badgeVariant()) {
      case 'amber':
        return `${currentSize} bg-amber-500/10 text-amber-400 border-amber-500/30`;
      case 'cyan':
        return `${currentSize} bg-cyan-500/10 text-cyan-400 border-cyan-500/30`;
      case 'neutral':
        return `${currentSize} bg-slate-800 text-slate-300 border-slate-700`;
      case 'emerald':
      default:
        return `${currentSize} bg-emerald-500/10 text-emerald-400 border-emerald-500/25`;
    }
  });
}
