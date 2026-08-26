import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[var(--bg-app,#08090C)] text-[var(--text-primary,#F1F5F9)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      <!-- Background Matrix Grid Effects -->
      <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
      
      <div class="max-w-md w-full relative z-10 space-y-6">
        
        <!-- Radar Radar / Glitch Graphic -->
        <div class="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto relative shadow-2xl shadow-emerald-500/10">
          <span class="mat-icon text-5xl">radar</span>
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping"></div>
        </div>

        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span>Erreur 404 &bull; Signal Perdu</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Zone Hors Marché
          </h1>
          <p class="text-sm text-slate-400 leading-relaxed">
            La page ou la ressource financière demandée est introuvable ou n'est plus accessible sur cette passerelle.
          </p>
        </div>

        <!-- Technical Diagnostic Terminal -->
        <div class="p-4 rounded-2xl bg-[#0e0e12] border border-slate-800 text-left font-mono text-xs space-y-2 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
            <span>TERMINAL DIAGNOSTIC</span>
            <span class="text-emerald-400">STATUS: OFFLINE</span>
          </div>
          <div class="text-slate-300">
            <span class="text-rose-400">> ERROR_CODE:</span> HTTP_404_ROUTE_NOT_FOUND
          </div>
          <div class="text-slate-400 text-[11px]">
            <span class="text-cyan-400">> ADVICE:</span> Vérifiez l'URL ou revenez au centre d'orchestration.
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a 
            id="not-found-back-home-btn"
            routerLink="/"
            class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors">
            Page d'accueil
          </a>
          <a 
            id="not-found-dashboard-btn"
            routerLink="/app/dashboard"
            class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
            <span class="mat-icon text-sm">dashboard</span>
            <span>Aller au Dashboard</span>
          </a>
        </div>

      </div>

      <!-- Footer Info -->
      <div class="absolute bottom-6 text-xs text-slate-400 font-mono">
        FOREX INTEL &bull; Moteur de Confluence & IA
      </div>

    </div>
  `
})
export class NotFoundComponent {}
