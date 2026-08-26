import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, LogoComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between bg-[#08080a] text-slate-200 relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      <!-- Subtle Atmospheric Ambient Light -->
      <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/[0.04] blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div class="fixed bottom-0 right-10 w-[500px] h-[300px] bg-cyan-500/[0.03] blur-[140px] rounded-full pointer-events-none -z-10"></div>
      
      <!-- Grid Pattern Background -->
      <div class="fixed inset-0 bg-[linear-gradient(to_right,#14141a08_1px,transparent_1px),linear-gradient(to_bottom,#14141a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>

      <!-- Minimalist Top Navigation Header -->
      <header class="w-full border-b border-slate-800/80 bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <!-- Brand Logo -->
          <app-logo routerLink="/" badge="PRO" size="md"></app-logo>

          <!-- Right: Theme Switcher & Direct Link back to Landing Page -->
          <div class="flex items-center gap-4">
            <div class="flex items-center pr-1 border-r border-slate-800/80">
              <app-theme-toggle [variant]="'compact'"></app-theme-toggle>
            </div>

            <div class="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#141417] border border-slate-800 text-[10px] font-mono text-slate-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-slate-300 font-medium">PASSERELLE SÉCURISÉE</span>
            </div>

            <a routerLink="/" class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/40 border border-transparent hover:border-slate-800">
              <span class="text-sm">←</span>
              <span>Retour à l'accueil</span>
            </a>
          </div>

        </div>
      </header>

      <!-- Main Router Outlet for Auth Views (Login, Register, Forgot Password) -->
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10">
        <router-outlet></router-outlet>
      </main>

      <!-- Minimalist Legal & Status Footer -->
      <footer class="w-full border-t border-slate-800/80 bg-[#0a0a0b]/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-slate-300 font-sans font-medium">Forex Intel &copy; 2026. Tous droits réservés.</span>
          </div>

          <div class="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Infrastructure Institutionnelle</span>
            <span class="text-slate-700">&bull;</span>
            <span>Protocoles MT5</span>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: ``
})
export class AuthLayoutComponent {}
