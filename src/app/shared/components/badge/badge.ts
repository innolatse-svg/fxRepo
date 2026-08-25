import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'indigo' | 'success' | 'danger' | 'warning' | 'neutral' | 'neon' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses()">
      @if (dot()) {
        <span class="w-1.5 h-1.5 rounded-full mr-1.5" [class]="dotClasses()"></span>
      }
      <ng-content></ng-content>
    </span>
  `,
  styles: ``
})
export class BadgeComponent {
  variant = input<BadgeVariant>('primary');
  size = input<BadgeSize>('md');
  dot = input<boolean>(false);

  badgeClasses = computed(() => {
    const base = 'inline-flex items-center font-medium transition-colors select-none tracking-wide';
    
    // Size classes
    const sizeMap: Record<BadgeSize, string> = {
      sm: 'text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider leading-tight',
      md: 'text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest leading-normal',
      lg: 'text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest leading-normal'
    };

    // Variant classes
    const variantMap: Record<BadgeVariant, string> = {
      primary: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      neutral: 'bg-[#1a1a1e] text-slate-400 border border-slate-800',
      neon: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      outline: 'bg-transparent text-slate-400 border border-slate-700/80'
    };

    return `${base} ${sizeMap[this.size()]} ${variantMap[this.variant()]}`;
  });

  dotClasses = computed(() => {
    const dotColorMap: Record<BadgeVariant, string> = {
      primary: 'bg-emerald-400 animate-pulse',
      indigo: 'bg-indigo-400 animate-pulse',
      success: 'bg-emerald-400 animate-pulse',
      danger: 'bg-rose-400',
      warning: 'bg-amber-400 animate-pulse',
      neutral: 'bg-slate-400',
      neon: 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]',
      outline: 'bg-slate-400'
    };
    return dotColorMap[this.variant()];
  });
}
