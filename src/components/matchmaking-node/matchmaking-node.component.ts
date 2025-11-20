import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Startup {
  name: string;
  sector: string;
}

interface VC {
  name: string;
  focus: string;
}

interface Match {
  startup: string;
  vc: string;
  score: number;
}

@Component({
  selector: 'app-matchmaking-node',
  templateUrl: './matchmaking-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchmakingNodeComponent {
  startups = signal<Startup[]>([
    { name: 'PagoCR', sector: 'Pagos' },
    { name: 'CrediTico', sector: 'Préstamos' },
    { name: 'SeguroChain', sector: 'Insurtech' },
  ]);

  vcs = signal<VC[]>([
    { name: 'Innova Capital', focus: 'Pagos' },
    { name: 'Andes Ventures', focus: 'Préstamos' },
    { name: 'Futuro Fund', focus: 'Insurtech' },
  ]);

  matches = signal<Match[]>([
    { startup: 'PagoCR', vc: 'Innova Capital', score: 92 },
    { startup: 'CrediTico', vc: 'Andes Ventures', score: 85 },
    { startup: 'SeguroChain', vc: 'Futuro Fund', score: 78 },
  ]);
}