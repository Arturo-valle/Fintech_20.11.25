import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

interface VC {
  name: string;
  focus: string;
  thesis: string;
}

interface MatchResult {
  bestMatchVcName: string;
  score: number;
  reasoning: string;
}

@Component({
  selector: 'app-matchmaking-node',
  templateUrl: './matchmaking-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  standalone: true
})
export class MatchmakingNodeComponent {
  geminiService = inject(GeminiService);

  startupDescription = signal('');
  analyzing = signal(false);
  matchResult = signal<MatchResult | null>(null);

  vcs = signal<VC[]>([
    { name: 'Innova Capital', focus: 'Fintech / Pagos', thesis: 'Busca soluciones B2B de pagos transfronterizos y pasarelas modernas.' },
    { name: 'Andes Ventures', focus: 'Lending / Crédito', thesis: 'Interés en microcréditos, scoring alternativo y DeFi.' },
    { name: 'Futuro Fund', focus: 'Insurtech / Wealth', thesis: 'Seguros paramétricos y gestión patrimonial automatizada.' },
    { name: 'RegTech Partners', focus: 'Compliance / Legal', thesis: 'Automatización de KYC, AML y reporte regulatorio.' }
  ]);

  async analyzeMatch() {
    if (!this.startupDescription().trim() || !this.geminiService.hasApiKey()) return;

    this.analyzing.set(true);
    this.matchResult.set(null);

    try {
      const resultText = await this.geminiService.analyzeStartupMatch(
        this.startupDescription(),
        this.vcs()
      );

      // Parse JSON response from Gemini
      // Using a basic cleaner in case Gemini wraps it in markdown code blocks
      const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const result: MatchResult = JSON.parse(jsonStr);

      this.matchResult.set(result);
    } catch (e) {
      console.error("Matchmaking failed", e);
      this.matchResult.set({
        bestMatchVcName: 'Error',
        score: 0,
        reasoning: 'No se pudo realizar el análisis. Verifique su API Key o intente de nuevo.'
      });
    } finally {
      this.analyzing.set(false);
    }
  }
}
