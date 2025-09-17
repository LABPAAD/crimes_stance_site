import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart'; // Importe o ChartModule aqui

@Component({
  selector: 'app-positioning-doughnut-chart',
  standalone: true,
  imports: [CommonModule, ChartModule], // Adicione o ChartModule aos imports
  templateUrl: './positioning-doughnut-chart.html',
  styleUrls: ['./positioning-doughnut-chart.css']
})
export class PositioningDoughnutChartComponent {
  // Input para receber os dados do gráfico
  @Input() data: any;

  // Input para receber as opções de configuração do gráfico
  @Input() options: any;
}
