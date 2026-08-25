import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()">
      @if (glowEffect()) {
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: ``
})
export class CardComponent {
  padding = input<CardPadding>('md');
  hoverEffect = input<boolean>(false);
  glowEffect = input<boolean>(false);
  elevated = input<boolean>(false);
  bordered = input<boolean>(true);
  customClass = input<string>('');

  cardClasses = computed(() => {
    const base = 'relative rounded-xl transition-all duration-200 overflow-hidden';
    
    const bgClass = this.elevated() 
      ? 'bg-[#141417]' 
      : 'bg-[#0d0d0f]';

    const borderClass = this.bordered()
      ? 'border border-slate-800'
      : '';

    const hoverClass = this.hoverEffect()
      ? 'hover:border-slate-700 hover:bg-[#141417] hover:shadow-2xl hover:shadow-black'
      : '';

    const paddingMap: Record<CardPadding, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    return `${base} ${bgClass} ${borderClass} ${hoverClass} ${paddingMap[this.padding()]} ${this.customClass()}`;
  });
}
