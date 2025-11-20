import { ChangeDetectionStrategy, Component, OnDestroy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-pulse-header',
  templateUrl: './pulse-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  standalone: true
})
export class PulseHeaderComponent implements OnDestroy {
  geminiService = inject(GeminiService);

  sinpeTps = signal(0);
  fxRate = signal('0.00 / 0.00');
  fraudAlerts = signal(0);

  // API Key Management
  showApiKeyInput = signal(false);
  apiKeyInput = signal('');

  private intervalId: number;

  constructor() {
    this.updateMetrics();
    this.intervalId = window.setInterval(() => this.updateMetrics(), 3000);
  }

  toggleApiKeyInput() {
    this.showApiKeyInput.update(v => !v);
  }

  saveApiKey() {
    const key = this.apiKeyInput().trim();
    if (key) {
      this.geminiService.initializeAI(key);
      this.showApiKeyInput.set(false);
      this.apiKeyInput.set('');
    }
  }

  disconnectAI() {
    this.geminiService.clearApiKey();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private updateMetrics() {
    this.sinpeTps.set(Math.floor(Math.random() * (250 - 150 + 1) + 150));
    const buy = 510 + Math.random() * 5;
    const sell = 518 + Math.random() * 5;
    this.fxRate.set(`${buy.toFixed(2)} / ${sell.toFixed(2)}`);
    this.fraudAlerts.set(Math.floor(Math.random() * 10));
  }
}
