import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="buttonClasses()"
      (click)="btnClick.emit($event)">
      @if (loading()) {
        <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
      } @else if (icon()) {
        <span class="mat-icon text-[18px] mr-2 transition-transform group-hover:scale-110">{{ icon() }}</span>
      }
      
      <span class="whitespace-nowrap"><ng-content></ng-content></span>

      @if (iconRight() && !loading()) {
        <span class="mat-icon text-[18px] ml-2 transition-transform group-hover:translate-x-0.5">{{ iconRight() }}</span>
      }
    </button>
  `,
  styles: ``
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  icon = input<string | null>(null);
  iconRight = input<string | null>(null);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);

  btnClick = output<MouseEvent>();

  buttonClasses = computed(() => {
    const base = 'group relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50';

    const widthClass = this.fullWidth() ? 'w-full' : '';

    // Sizing (High Density crisp padding)
    const sizeMap: Record<ButtonSize, string> = {
      sm: 'text-[10px] px-3 py-1.5 rounded gap-1.5 tracking-wider',
      md: 'text-xs px-5 py-2.5 rounded gap-2 tracking-wider',
      lg: 'text-xs px-8 py-3.5 rounded gap-2.5 tracking-widest'
    };

    // Variant designs with High Density theme rules
    const variantMap: Record<ButtonVariant, string> = {
      primary: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98]',
      secondary: 'bg-white hover:bg-slate-200 text-black shadow-sm active:scale-[0.98]',
      outline: 'bg-transparent hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-500 active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
      danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 active:scale-[0.98]'
    };

    return `${base} ${sizeMap[this.size()]} ${variantMap[this.variant()]} ${widthClass}`;
  });
}
