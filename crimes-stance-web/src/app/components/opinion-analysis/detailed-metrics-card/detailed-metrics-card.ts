// Conteúdo CORRIGIDO e SIMPLIFICADO para detailed-metrics-card.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detailed-metrics-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detailed-metrics-card.html',
  styleUrls: ['./detailed-metrics-card.css'],
  host: {
    'class': 'block'
  }
})
export class DetailedMetricsCardComponent {
  // O componente agora apenas recebe a lista de métricas e a exibe.
  @Input() allMetrics: any[] = [];
}
