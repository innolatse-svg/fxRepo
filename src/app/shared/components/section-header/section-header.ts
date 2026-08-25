import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeComponent } from '../badge/badge';

@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent],
  template: `
    <div [class]="align() === 'center' ? 'text-center max-w-3xl mx-auto mb-8 lg:mb-10' : 'text-left max-w-2xl mb-6 lg:mb-8'">
      @if (eyebrow()) {
        <div class="mb-2.5 inline-flex">
          <app-badge variant="neon" size="sm" [dot]="true">
            {{ eyebrow() }}
          </app-badge>
        </div>
      }

      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight uppercase">
        {{ title() }}
      </h2>

      @if (subtitle()) {
        <p class="mt-2.5 text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
          {{ subtitle() }}
        </p>
      }
    </div>
  `,
  styles: ``
})
export class SectionHeaderComponent {
  eyebrow = input<string | null>(null);
  title = input.required<string>();
  subtitle = input<string | null>(null);
  align = input<'left' | 'center'>('center');
}
