import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { ProblemSolutionComponent } from './components/problem-solution/problem-solution';
import { MarketIntelligenceComponent } from './components/market-intelligence/market-intelligence';
import { RiskEngineComponent } from './components/risk-engine/risk-engine';
import { TradingAccountsComponent } from './components/trading-accounts/trading-accounts';
import { AutomationLevelsComponent } from './components/automation-levels/automation-levels';
import { HowItWorksComponent } from './components/how-it-works/how-it-works';
import { FinalCtaComponent } from './components/final-cta/final-cta';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    ProblemSolutionComponent,
    MarketIntelligenceComponent,
    RiskEngineComponent,
    TradingAccountsComponent,
    AutomationLevelsComponent,
    HowItWorksComponent,
    FinalCtaComponent
  ],
  template: `
    <div class="relative overflow-hidden">
      <!-- Section 1: Hero with Terminal & Interactive Financial Visual -->
      <app-landing-hero></app-landing-hero>

      <!-- Section 2: Constat / Problem & Solution Funnel -->
      <app-landing-problem-solution></app-landing-problem-solution>

      <!-- Section 3: 4 Distinct Pillars of Market Intelligence -->
      <app-landing-market-intelligence></app-landing-market-intelligence>

      <!-- Section 4: Risk Governance Engine & Pipeline -->
      <app-landing-risk-engine></app-landing-risk-engine>

      <!-- Section 5: Connected Trading Accounts & MT5 Bridge -->
      <app-landing-trading-accounts></app-landing-trading-accounts>

      <!-- Section 6: User-Controlled Automation Levels -->
      <app-landing-automation-levels></app-landing-automation-levels>

      <!-- Section 7: How It Works in 4 Steps -->
      <app-landing-how-it-works></app-landing-how-it-works>

      <!-- Section 8: Final Conversion Call to Action -->
      <app-landing-final-cta></app-landing-final-cta>
    </div>
  `,
  styles: ``
})
export class LandingComponent {}
