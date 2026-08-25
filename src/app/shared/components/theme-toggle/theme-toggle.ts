import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-label]="themeService.theme() === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'"
      [title]="themeService.theme() === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'"
      class="theme-toggle-btn relative inline-flex items-center justify-center p-2 rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
      [class]="buttonClass()">
      
      @if (themeService.theme() === 'dark') {
        <!-- Sun icon to switch to Light -->
        <span class="mat-icon text-[18px] text-amber-400 transition-transform duration-300 hover:rotate-45">
          light_mode
        </span>
        @if (showLabel()) {
          <span class="ml-2 text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Clair
          </span>
        }
      } @else {
        <!-- Moon icon to switch to Dark -->
        <span class="mat-icon text-[18px] text-indigo-600 transition-transform duration-300 hover:-rotate-12">
          dark_mode
        </span>
        @if (showLabel()) {
          <span class="ml-2 text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
            Sombre
          </span>
        }
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  showLabel = input<boolean>(false);
  variant = input<'header' | 'floating' | 'compact'>('header');

  toggle() {
    this.themeService.toggleTheme();
  }

  buttonClass(): string {
    const isDark = this.themeService.theme() === 'dark';
    if (this.variant() === 'compact') {
      return isDark 
        ? 'bg-[#141417] hover:bg-slate-800 border-slate-800 text-slate-300' 
        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700';
    }
    
    return isDark 
      ? 'bg-[#141417]/80 hover:bg-slate-800 border-slate-800/80 hover:border-slate-700 text-slate-300 shadow-sm' 
      : 'bg-slate-100/90 hover:bg-slate-200 border-slate-300/80 hover:border-slate-400 text-slate-800 shadow-sm';
  }
}
