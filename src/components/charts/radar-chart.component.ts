import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadarChartComponent {
  size = signal(180);
  center = computed(() => this.size() / 2);
  radius = computed(() => this.center() * 0.8);

  private data = signal([
    { label: 'Pagos', value: 0.9 },
    { label: 'Insurtech', value: 0.6 },
    { label: 'Blockchain', value: 0.4 },
    { label: 'Préstamos', value: 0.75 },
    { label: 'WealthTech', value: 0.5 },
  ]);

  private getPoint(value: number, angle: number) {
    const c = this.center();
    const r = this.radius();
    const x = c + r * value * Math.cos(angle - Math.PI / 2);
    const y = c + r * value * Math.sin(angle - Math.PI / 2);
    return `${x},${y}`;
  }

  private points = computed(() => {
    const numAxes = this.data().length;
    return this.data().map((item, i) => {
      const angle = (Math.PI * 2 * i) / numAxes;
      return this.getPoint(item.value, angle);
    });
  });

  dataPolygon = computed(() => this.points().join(' '));

  gridPolygons = computed(() => {
    const numAxes = this.data().length;
    const levels = 4;
    const polygons = [];
    for (let level = 1; level <= levels; level++) {
      const value = level / levels;
      const points = this.data().map((_, i) => {
        const angle = (Math.PI * 2 * i) / numAxes;
        return this.getPoint(value, angle);
      });
      polygons.push(points.join(' '));
    }
    return polygons;
  });

  axes = computed(() => {
    const numAxes = this.data().length;
    return this.data().map((item, i) => {
      const angle = (Math.PI * 2 * i) / numAxes;
      const endPoint = this.getPoint(1, angle).split(',');
      const labelPoint = this.getPoint(1.15, angle).split(',');
      return {
        label: item.label,
        x2: parseFloat(endPoint[0]),
        y2: parseFloat(endPoint[1]),
        labelX: parseFloat(labelPoint[0]),
        labelY: parseFloat(labelPoint[1]),
      };
    });
  });
}