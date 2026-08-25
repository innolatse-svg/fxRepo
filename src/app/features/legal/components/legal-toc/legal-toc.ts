import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { LegalSection } from '../../models/legal.model';

@Component({
  selector: 'app-legal-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <!-- ============================================================ -->
    <!-- DESKTOP STICKY SIDEBAR TABLE OF CONTENTS                     -->
    <!-- ============================================================ -->
    <nav class="hidden lg:block sticky top-24 space-y-4" aria-label="Sommaire du document">
      <div class="p-4 rounded-xl bg-[#141417] border border-slate-800/80 shadow-md">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div class="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            Sommaire des articles
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a0a0b] text-slate-400 border border-slate-800">
            {{ sections().length }} sections
          </span>
        </div>

        <ul class="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 text-xs custom-scrollbar">
          @for (sec of sections(); track sec.id) {
            <li>
              <a
                [href]="'#' + sec.id"
                (click)="onLinkClick($event, sec.id)"
                class="group flex items-start gap-2.5 py-1.5 px-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500">
                <span class="text-[10px] font-mono font-semibold text-emerald-400/80 group-hover:text-emerald-300 shrink-0 mt-0.5">
                  {{ sec.number }}
                </span>
                <span class="line-clamp-1 leading-snug group-hover:translate-x-0.5 transition-transform text-[11px]">
                  {{ sec.title }}
                </span>
              </a>
            </li>
          }
        </ul>
      </div>

      <!-- Quick Action / Switch Document Card -->
      <div class="p-3.5 rounded-xl bg-[#141417]/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div class="flex items-center gap-1.5 text-slate-300 font-semibold font-mono text-[10px] uppercase">
          <span class="mat-icon text-sm text-emerald-400">gavel</span>
          <span>Cadre contractuel</span>
        </div>
        <p class="text-[11px] leading-relaxed text-slate-400">
          Ce document forme avec nos autres politiques le socle contractuel régissant l'utilisation du service Forex Intel.
        </p>
      </div>
    </nav>

    <!-- ============================================================ -->
    <!-- MOBILE / TABLET COLLAPSIBLE ACCORDION TOC                     -->
    <!-- ============================================================ -->
    <div class="lg:hidden mb-8">
      <div class="rounded-xl bg-[#141417] border border-slate-800 overflow-hidden">
        <button
          type="button"
          (click)="toggleMobileToc()"
          [attr.aria-expanded]="mobileTocOpen()"
          class="w-full flex items-center justify-between p-4 text-left text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-mono text-xs uppercase tracking-wider text-slate-200">Accéder directement à un article</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0a0a0b] text-slate-400 border border-slate-800">
              {{ sections().length }}
            </span>
          </div>
          <span class="mat-icon text-slate-400 transition-transform duration-200" [class.rotate-180]="mobileTocOpen()">
            expand_more
          </span>
        </button>

        @if (mobileTocOpen()) {
          <div class="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-[#0d0d0f]">
            <ul class="space-y-1.5 max-h-72 overflow-y-auto pr-1 text-xs">
              @for (sec of sections(); track sec.id) {
                <li>
                  <a
                    [href]="'#' + sec.id"
                    (click)="onLinkClick($event, sec.id)"
                    class="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-slate-300 hover:text-white bg-[#141417] hover:bg-slate-800 transition-colors">
                    <span class="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                      {{ sec.number }}
                    </span>
                    <span class="text-xs truncate">
                      {{ sec.title }}
                    </span>
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.4);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(100, 116, 139, 0.5);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(16, 185, 129, 0.6);
    }
  `
})
export class LegalTocComponent {
  sections = input.required<LegalSection[]>();
  mobileTocOpen = signal<boolean>(false);

  toggleMobileToc() {
    this.mobileTocOpen.update(v => !v);
  }

  onLinkClick(event: MouseEvent, sectionId: string) {
    event.preventDefault();
    this.mobileTocOpen.set(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -90; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update browser URL hash without jump
      history.pushState(null, '', '#' + sectionId);
    }
  }
}
