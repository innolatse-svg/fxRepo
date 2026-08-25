import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MarketDemoService } from '../../../../core/services/market-demo.service';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-landing-automation-levels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  template: `
    <section id="automation" class="py-16 lg:py-24 bg-[#0a0a0b] border-t border-slate-800 relative overflow-hidden">
      <!-- Gradient -->
      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-ambient-emerald pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <app-section-header
          eyebrow="PROGRESSION & CONTRÔLE"
          title="Vous choisissez votre niveau d'automatisation."
          subtitle="Du simple cockpit d'analyse manuelle jusqu'à l'orchestration multi-comptes supervisée, vous progressez à votre propre rythme sans jamais céder le contrôle.">
        </app-section-header>

        <!-- Master Progression Timeline (5 Tiers) -->
        <div class="mt-10 space-y-5">
          
          <!-- Stepper Tabs for Selecting Level -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#141417] p-1.5 rounded-xl border border-slate-800">
            @for (tier of marketService.automationTiers(); track tier.id) {
              <button
                type="button"
                (click)="activeStep.set(tier.step)"
                [class]="activeStep() === tier.step 
                  ? 'bg-[#1a1a1e] border-emerald-500/40 text-white shadow-sm' 
                  : 'bg-[#0d0d0f] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'"
                class="p-2.5 rounded-lg border text-left transition-all cursor-pointer space-y-0.5">
                <div class="flex items-center justify-between text-xs font-mono font-bold">
                  <span [class]="activeStep() === tier.step ? 'text-emerald-400' : 'text-slate-400'">
                    0{{ tier.step }}
                  </span>
                  <span class="text-[10px] uppercase tracking-wider">
                    {{ tier.badge }}
                  </span>
                </div>
                <div class="text-xs font-bold truncate uppercase tracking-tight">
                  {{ tier.title }}
                </div>
              </button>
            }
          </div>

          <!-- Active Step Deep Dive Card -->
          @let current = currentTier();
          @if (current) {
            <div class="bg-[#141417] rounded-xl p-5 sm:p-7 border border-slate-800 shadow-2xl shadow-black space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2.5">
                    <span class="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                      NIVEAU {{ current.step }} / 5
                    </span>
                    <h3 class="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">{{ current.title }}</h3>
                  </div>
                  <p class="text-xs font-mono text-emerald-400 font-bold">{{ current.subtitle }}</p>
                </div>

                <!-- Manual Confirmation status for this tier -->
                <div class="bg-[#0d0d0f] px-3.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2.5 text-xs font-mono">
                  <span class="text-slate-400 uppercase">Confirmation manuelle :</span>
                  <span [class]="current.requiresManualConfirm ? 'text-emerald-400 font-bold' : 'text-slate-200 font-bold'">
                    {{ current.requiresManualConfirm ? 'OBLIGATOIRE (ON)' : 'PARAMÉTRABLE (AU CHOIX)' }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
                <!-- Description -->
                <div class="lg:col-span-2 space-y-3.5">
                  <p class="text-xs text-slate-300 leading-relaxed">
                    {{ current.description }}
                  </p>

                  <div class="space-y-2 pt-1">
                    <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                      Capacités débloquées à ce niveau :
                    </span>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      @for (feature of current.features; track feature) {
                        <div class="bg-[#0d0d0f] p-3 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                          <span class="mat-icon text-emerald-400 text-sm mt-0.5 shrink-0">check_circle</span>
                          <span class="leading-snug">{{ feature }}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <!-- Visual Guardrail Summary -->
                <div class="bg-[#0d0d0f] p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div class="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-800 text-xs font-bold uppercase">
                    <span>CONTRÔLE UTILISATEUR</span>
                    <span class="text-emerald-400 font-bold">100% SÉCURISÉ</span>
                  </div>

                  <div class="space-y-2 text-xs text-slate-300">
                    <div class="flex items-center justify-between">
                      <span>Interruption d'urgence</span>
                      <span class="text-emerald-400 font-bold">Instantanée (1 clic)</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>Ordres hors règles définies</span>
                      <span class="text-rose-400 font-bold">Strictement Bloqués</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>Dépassement du lot calculé</span>
                      <span class="text-rose-400 font-bold">Impossible</span>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Reassurance Banner -->
              <div class="p-3 bg-[#0d0d0f] rounded-lg border border-emerald-500/20 text-xs text-slate-300 flex items-center gap-2.5">
                <span class="mat-icon text-emerald-400 text-base">verified</span>
                <span><strong>Règle fondamentale :</strong> L'automatisation ne contourne jamais vos règles. Vous gardez à chaque instant la faculté de basculer en mode manuel ou d'interrompre le flux.</span>
              </div>

            </div>
          }

        </div>

      </div>
    </section>
  `,
  styles: ``
})
export class AutomationLevelsComponent {
  marketService = inject(MarketDemoService);
  activeStep = signal<number>(2);

  currentTier() {
    return this.marketService.automationTiers().find(t => t.step === this.activeStep());
  }
}
