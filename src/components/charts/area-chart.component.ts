import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AreaChartComponent {
  width = signal(300);
  height = signal(150);
  padding = signal(30);

  private dataPoints = 20;
  private volumeData = signal(Array.from({ length: this.dataPoints }, () => Math.random() * 80 + 20));
  private latencyData = signal(Array.from({ length: this.dataPoints }, () => Math.random() * 40 + 5));

  private createPath = (data: number[], scaleFactor: number) => {
    const w = this.width();
    const h = this.height();
    const p = this.padding();
    const xStep = (w - p * 2) / (data.length - 1);
    
    const points = data.map((d, i) => {
      const x = p + i * xStep;
      const y = h - p - (d * scaleFactor);
      return `${x},${y}`;
    }).join(' L ');

    return `M ${p},${h - p} L ${points} L ${w - p},${h - p} Z`;
  };

  volumePath = computed(() => this.createPath(this.volumeData(), 1));
  latencyPath = computed(() => this.createPath(this.latencyData(), 2));

  gridLines = computed(() => {
    const h = this.height();
    const p = this.padding();
    const count = 4;
    const lines = [];
    for (let i = 0; i <= count; i++) {
        lines.push(p + i * ((h - p * 2) / count));
    }
    return lines;
  });
}
