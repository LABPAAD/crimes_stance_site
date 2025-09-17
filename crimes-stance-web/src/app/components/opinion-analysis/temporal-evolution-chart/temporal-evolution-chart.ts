import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temporal-evolution-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temporal-evolution-chart.html',
  styleUrls: ['./temporal-evolution-chart.css'],
  host: {
    'class': 'block'
  }
})
export class TemporalEvolutionChartComponent {
  // Input para receber os dados do gráfico no futuro.
  // O tipo 'any' é usado aqui porque ainda não definimos a estrutura do gráfico.
  @Input() chartData: any;
}
