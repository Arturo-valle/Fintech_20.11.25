import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-pulse-header',
  templateUrl: './pulse-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseHeaderComponent implements OnDestroy {
  sinpeTps = signal(0);
  fxRate = signal('0.00 / 0.00');
  fraudAlerts = signal(0);

  private intervalId: number;

  constructor() {
    this.updateMetrics();
    this.intervalId = window.setInterval(() => this.updateMetrics(), 3000);
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
