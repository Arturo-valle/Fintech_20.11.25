import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class LineChartComponent {
  width = signal(300);
  height = signal(150);
  padding = signal(30);

  private dataPoints = 30;
  private data = signal(Array.from({ length: this.dataPoints }, (_, i) => 515 + Math.sin(i / 3) * 5 + Math.random() * 4 - 2));

  min = computed(() => Math.min(...this.data()));
  max = computed(() => Math.max(...this.data()));
  
  yScale = computed(() => {
    const h = this.height();
    const p = this.padding();
    const minVal = this.min();
    const maxVal = this.max();
    return (value: number) => h - p - ((value - minVal) / (maxVal - minVal)) * (h - 2 * p);
  });
  
  xScale = computed(() => {
    const w = this.width();
    const p = this.padding();
    return (index: number) => p + index * ((w - 2 * p) / (this.data().length - 1));
  });

  linePath = computed(() => {
    const ys = this.yScale();
    const xs = this.xScale();
    const points = this.data().map((d, i) => `${xs(i)},${ys(d)}`).join(' L ');
    return `M ${points}`;
  });

  fillPath = computed(() => {
    const line = this.linePath();
    const h = this.height();
    const p = this.padding();
    const xs = this.xScale();
    return `${line} L ${xs(this.data().length - 1)},${h - p} L ${xs(0)},${h - p} Z`;
  });

  gridLines = computed(() => {
    const h = this.height();
    const p = this.padding();
    const count = 3;
    const lines = [];
    for (let i = 0; i <= count; i++) {
        lines.push(p + i * ((h - p * 2) / count));
    }
    return lines;
  });
}
