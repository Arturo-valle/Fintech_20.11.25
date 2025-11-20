import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PulseHeaderComponent } from './components/pulse-header/pulse-header.component';
import { AiSandboxComponent } from './components/ai-sandbox/ai-sandbox.component';
import { MarketIntelligenceComponent } from './components/market-intelligence/market-intelligence.component';
import { MatchmakingNodeComponent } from './components/matchmaking-node/matchmaking-node.component';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PulseHeaderComponent,
    AiSandboxComponent,
    MarketIntelligenceComponent,
    MatchmakingNodeComponent
  ],
})
export class AppComponent {}
