import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart'; // Importe o ChartModule

@Component({
  selector: 'app-metrics-bar-chart',
  standalone: true,
  imports: [CommonModule, ChartModule], // Adicione o ChartModule aos imports
  templateUrl: './metrics-bar-chart.html',
  styleUrls: ['./metrics-bar-chart.css']
})
export class MetricsBarChartComponent {
  // Input para receber os dados do gráfico
  @Input() data: any;

  // Input para receber as opções de configuração do gráfico
  @Input() options: any;
}
