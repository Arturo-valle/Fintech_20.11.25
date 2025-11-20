import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AreaChartComponent } from '../charts/area-chart.component';
import { RadarChartComponent } from '../charts/radar-chart.component';
import { LineChartComponent } from '../charts/line-chart.component';

@Component({
  selector: 'app-market-intelligence',
  templateUrl: './market-intelligence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AreaChartComponent, RadarChartComponent, LineChartComponent],
  standalone: true
})
export class MarketIntelligenceComponent {}
