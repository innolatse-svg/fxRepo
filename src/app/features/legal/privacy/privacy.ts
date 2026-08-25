import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIVACY_DOCUMENT } from '../data/privacy-content';
import { LegalTocComponent } from '../components/legal-toc/legal-toc';

@Component({
  selector: 'app-legal-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LegalTocComponent],
  template: `
    <div class="py-10 lg:py-14 bg-[#0a0a0b]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- ============================================================ -->
        <!-- DOCUMENT HEADER / HERO BANNER                                -->
        <!-- ============================================================ -->
        <header class="max-w-4xl pb-10 border-b border-slate-800 space-y-4">
          
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Protection des Données (RGPD / GDPR)
            </span>
            <div class="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <span class="mat-icon text-xs text-slate-400">calendar_today</span>
              <span>DERNIÈRE MISE À JOUR :</span>
              <strong class="text-slate-200">{{ doc.lastUpdated }}</strong>
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {{ doc.title }}
          </h1>

          <p class="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            {{ doc.subtitle }}
          </p>

          <!-- Pre-Production Legal Disclaimer Notice -->
          <div class="mt-4 p-4 rounded-xl bg-[#141417] border border-amber-500/30 text-xs space-y-1.5">
            <div class="flex items-center gap-2 text-amber-400 font-mono font-bold uppercase tracking-wider text-[11px]">
              <span class="mat-icon text-amber-400 text-sm">info</span>
              <span>Avis réglementaire & Modèle produit initial</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              {{ doc.draftNotice }}
            </p>
          </div>

        </header>

        <!-- ============================================================ -->
        <!-- TWO-COLUMN WORKSPACE (TOC + CONTENT)                         -->
        <!-- ============================================================ -->
        <div class="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <!-- Sticky Sidebar Table of Contents -->
          <div class="lg:col-span-4">
            <app-legal-toc [sections]="doc.sections"></app-legal-toc>
          </div>

          <!-- Main Legal Articles Column -->
          <div class="lg:col-span-8 space-y-12">
            
            @for (section of doc.sections; track section.id) {
              <article
                [id]="section.id"
                class="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#0f0f12] border border-slate-800/80 shadow-sm space-y-5 transition-colors hover:border-slate-700/80">
                
                <!-- Section Header -->
                <div class="space-y-2 border-b border-slate-800/80 pb-4">
                  <div class="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    <span>SECTION</span>
                    <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                      {{ section.number }}
                    </span>
                  </div>
                  <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {{ section.title }}
                  </h2>
                </div>

                <!-- Paragraphs -->
                <div class="space-y-3 text-slate-300 text-sm leading-relaxed font-sans">
                  @for (paragraph of section.paragraphs; track $index) {
                    <p class="leading-relaxed">
                      {{ paragraph }}
                    </p>
                  }
                </div>

                <!-- Subsections (Data categories, etc.) -->
                @if (section.subsections && section.subsections.length > 0) {
                  <div class="space-y-4 pt-2">
                    @for (sub of section.subsections; track sub.title) {
                      <div class="p-4 rounded-xl bg-[#141417] border border-slate-800 space-y-2">
                        <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">
                          {{ sub.title }}
                        </h3>
                        <div class="space-y-1 text-xs text-slate-400">
                          @for (line of sub.content; track $index) {
                            <p>{{ line }}</p>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }

                <!-- Highlighted Callout / Regulatory Box -->
                @if (section.callout) {
                  <div
                    class="p-4 rounded-xl text-xs space-y-1.5 border"
                    [class]="getCalloutClasses(section.callout.type)">
                    <div class="flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-[11px]" [class]="getCalloutTitleColor(section.callout.type)">
                      <span class="mat-icon text-sm">{{ getCalloutIcon(section.callout.type) }}</span>
                      <span>{{ section.callout.title }}</span>
                    </div>
                    <p class="text-slate-300 leading-relaxed font-sans">
                      {{ section.callout.text }}
                    </p>
                  </div>
                }

              </article>
            }

            <!-- Bottom Document Navigation Footer -->
            <div class="p-6 rounded-2xl bg-[#141417] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="space-y-1 text-left">
                <p class="text-xs font-semibold text-white">Continuer votre lecture juridique</p>
                <p class="text-[11px] text-slate-400">Consultez les conditions régissant l'utilisation de la plateforme.</p>
              </div>
              <a
                routerLink="/legal/terms"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                <span>Conditions d'utilisation</span>
                <span class="mat-icon text-sm">arrow_forward</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class LegalPrivacyComponent {
  doc = PRIVACY_DOCUMENT;

  getCalloutClasses(type: string): string {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-200';
      case 'placeholder':
        return 'bg-violet-500/10 border-violet-500/30 text-violet-200';
      case 'info':
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
    }
  }

  getCalloutTitleColor(type: string): string {
    switch (type) {
      case 'warning':
        return 'text-amber-400';
      case 'placeholder':
        return 'text-violet-400';
      case 'info':
      default:
        return 'text-emerald-400';
    }
  }

  getCalloutIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'warning_amber';
      case 'placeholder':
        return 'build_circle';
      case 'info':
      default:
        return 'lock';
    }
  }
}
