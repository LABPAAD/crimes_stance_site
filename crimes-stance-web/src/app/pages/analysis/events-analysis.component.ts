import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { EventsService } from '../../services/events.service';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-events-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule, FooterComponent],
  template: `
    <div class="space-y-6 ">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Análise de Eventos</h1>
          <p class="text-slate-600 mt-2">Análises estatísticas e insights dos datasets de eventos</p>
        </div>
      </div>

      <!-- Métricas principais -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-calendar-event text-blue-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ formatNumber(totalVideos) }}</div>
              <div class="text-sm text-slate-600">Total de Vídeos</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-calendar-range text-green-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ periodRange }}</div>
              <div class="text-sm text-slate-600">Período de Coleta</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-robot text-yellow-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ techniques.length }}</div>
              <div class="text-sm text-slate-600">Técnicas Testadas</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-trophy text-orange-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ bestAccuracy }}%</div>
              <div class="text-sm text-slate-600">Melhor Acurácia</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos principais -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de acurácia por técnica -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            <i class="bi bi-bar-chart mr-2 text-blue-600"></i>
            Acurácia por Técnica
          </h3>
          <p-chart 
            type="bar" 
            [data]="accuracyChartData" 
            [options]="chartOptions"
            class="w-full h-64">
          </p-chart>
        </div>

        <!-- Gráfico de F1-Score por dataset -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            <i class="bi bi-graph-up text-green-600 mr-2"></i>
            F1-Score por Dataset
          </h3>
          <p-chart 
            type="line" 
            [data]="f1ChartData" 
            [options]="lineChartOptions"
            class="w-full h-64">
          </p-chart>
        </div>

        <!-- Gráfico de distribuição temporal -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            <i class="bi bi-calendar-week text-purple-600 mr-2"></i>
            Vídeos por Período
          </h3>
          <p-chart 
            type="line" 
            [data]="temporalChartData" 
            [options]="temporalChartOptions"
            class="w-full h-64">
          </p-chart>
        </div>

        <!-- Radar chart com métricas -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            <i class="bi bi-radar text-orange-600 mr-2"></i>
            Comparação de Métricas
          </h3>
          <p-chart 
            type="radar" 
            [data]="radarChartData" 
            [options]="radarChartOptions"
            class="w-full h-64">
          </p-chart>
        </div>
      </div>

      <!-- Tabela de métricas detalhadas -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          <i class="bi bi-table text-indigo-600 mr-2"></i>
          Métricas Detalhadas por Cenário
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-200">
              <tr class="text-left">
                <th class="pb-3 font-medium text-slate-900">Cenário</th>
                <th class="pb-3 font-medium text-slate-900">Técnica</th>
                <th class="pb-3 font-medium text-slate-900 text-center">Acurácia</th>
                <th class="pb-3 font-medium text-slate-900 text-center">Precisão</th>
                <th class="pb-3 font-medium text-slate-900 text-center">Revocação</th>
                <th class="pb-3 font-medium text-slate-900 text-center">F1-Score</th>
                <th class="pb-3 font-medium text-slate-900 text-center">NMI</th>
                <th class="pb-3 font-medium text-slate-900 text-center">AMI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let metric of metrics" class="hover:bg-slate-50">
                <td class="py-3 text-slate-900">{{ metric.cenario }}</td>
                <td class="py-3">
                  <span [class]="getTechniqueClass(metric.tecnica)" 
                        class="inline-flex px-2 py-1 text-xs rounded font-medium">
                    {{ getTechniqueName(metric.tecnica) }}
                  </span>
                </td>
                <td class="py-3 text-center font-mono">{{ formatMetric(metric.acu) }}</td>
                <td class="py-3 text-center font-mono">{{ formatMetric(metric.pre) }}</td>
                <td class="py-3 text-center font-mono">{{ formatMetric(metric.rev) }}</td>
                <td class="py-3 text-center font-mono">{{ formatMetric(metric.f1) }}</td>
                <td class="py-3 text-center font-mono">{{ formatMetric(metric.nmi) }}</td>
                <td class="py-3 text-center font-mono">{{ formatMetric(metric.ami) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: []
})
export class EventsAnalysisComponent implements OnInit {
  metrics: any[] = [];
  videos: any[] = [];
  videosByMonth: any[] = [];
  
  // Propriedades calculadas
  totalVideos = 0;
  datasets: string[] = [];
  techniques: string[] = [];
  bestAccuracy = 0;
  periodRange = '';
  
  // Dados dos gráficos
  accuracyChartData: any = {};
  f1ChartData: any = {};
  temporalChartData: any = {};
  radarChartData: any = {};
  
  // Opções dos gráficos
  chartOptions: any = {};
  lineChartOptions: any = {};
  temporalChartOptions: any = {};
  radarChartOptions: any = {};

  constructor(private eventsService: EventsService) {}

  async ngOnInit() {
    await this.loadData();
    this.calculateMetrics();
    this.prepareCharts();
  }

  private async loadData() {
    try {
      const data = await this.eventsService.listAll();
      this.metrics = data.metrics;
      this.videos = data.videos;
      this.videosByMonth = data.videosByMonth;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  private calculateMetrics() {
    this.totalVideos = this.videos.length;
    
    // Extrair datasets únicos
    this.datasets = [...new Set(this.metrics.map(m => m.dataset))];
    
    // Extrair técnicas únicas
    this.techniques = [...new Set(this.metrics.map(m => m.tecnica))];
    
    // Calcular melhor acurácia
    const bestAcc = Math.max(...this.metrics.map(m => m.acu || 0));
    this.bestAccuracy = Math.round(bestAcc * 100);

    // Calcular período de coleta
    this.calculatePeriodRange();
  }

  private calculatePeriodRange() {
    if (this.videos.length === 0) {
      this.periodRange = 'N/A';
      return;
    }

    const dates = this.videos
      .map(v => v.parsedDate)
      .filter(date => date)
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) {
      this.periodRange = 'N/A';
      return;
    }

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    if (startYear === endYear) {
      this.periodRange = `${startYear}`;
    } else {
      const duration = endYear - startYear + 1;
      this.periodRange = `${startYear}-${endYear} (${duration} anos)`;
    }
  }

  private prepareCharts() {
    this.prepareAccuracyChart();
    this.prepareF1Chart();
    this.prepareTemporalChart();
    this.prepareRadarChart();
    this.setupChartOptions();
  }

  private prepareAccuracyChart() {
    const groupedByTechnique = this.techniques.map(technique => {
      const techniqueData = this.metrics.filter(m => m.tecnica === technique);
      const avgAccuracy = techniqueData.reduce((sum, m) => sum + (m.acu || 0), 0) / techniqueData.length;
      return {
        technique,
        accuracy: avgAccuracy * 100
      };
    });

    this.accuracyChartData = {
      labels: groupedByTechnique.map(d => this.getTechniqueName(d.technique)),
      datasets: [{
        label: 'Acurácia Média (%)',
        data: groupedByTechnique.map(d => d.accuracy.toFixed(1)),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderColor: ['#2563EB', '#059669', '#D97706'],
        borderWidth: 1
      }]
    };
  }

  private prepareF1Chart() {
    const datasets = this.datasets.map(dataset => {
      const datasetMetrics = this.metrics.filter(m => m.dataset === dataset);
      return {
        label: this.getDatasetName(dataset),
        data: this.techniques.map(technique => {
          const metric = datasetMetrics.find(m => m.tecnica === technique);
          return metric ? (metric.f1 * 100).toFixed(1) : 0;
        }),
        borderColor: this.getDatasetColor(dataset),
        backgroundColor: this.getDatasetColor(dataset) + '20',
        tension: 0.4
      };
    });

    this.f1ChartData = {
      labels: this.techniques.map(t => this.getTechniqueName(t)),
      datasets
    };
  }

  private prepareTemporalChart() {
    const monthlyData = this.videosByMonth.map(item => ({
      month: item.period,
      count: item.count
    }));

    this.temporalChartData = {
      labels: monthlyData.map(d => {
        const [year, month] = d.month.split('-');
        return `${month}/${year}`;
      }),
      datasets: [{
        label: 'Vídeos Coletados',
        data: monthlyData.map(d => d.count),
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF620',
        tension: 0.4,
        fill: true
      }]
    };
  }

  private prepareRadarChart() {
    const metricsToShow = ['acu', 'pre', 'rev', 'f1', 'nmi', 'ami'];
    const metricLabels = ['Acurácia', 'Precisão', 'Revocação', 'F1-Score', 'NMI', 'AMI'];
    
    const datasets = this.techniques.map(technique => {
      const techniqueData = this.metrics.filter(m => m.tecnica === technique);
      const avgMetrics = metricsToShow.map(metric => {
        const avg = techniqueData.reduce((sum, m) => sum + (m[metric] || 0), 0) / techniqueData.length;
        return (avg * 100).toFixed(1);
      });

      return {
        label: this.getTechniqueName(technique),
        data: avgMetrics,
        borderColor: this.getTechniqueColor(technique),
        backgroundColor: this.getTechniqueColor(technique) + '20',
        pointBackgroundColor: this.getTechniqueColor(technique),
        pointBorderColor: this.getTechniqueColor(technique)
      };
    });

    this.radarChartData = {
      labels: metricLabels,
      datasets
    };
  }

  private setupChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    };

    this.temporalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.radarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    };
  }

  // Métodos utilitários
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatMetric(value: number): string {
    return (value * 100).toFixed(1) + '%';
  }

  getTechniqueName(technique: string): string {
    const names: Record<string, string> = {
      'HS': 'Heurística Semântica',
      'HT': 'Heurística Temporal',
      'GPT': 'GPT-4'
    };
    return names[technique] || technique;
  }

  getTechniqueClass(technique: string): string {
    const classes: Record<string, string> = {
      'HS': 'bg-blue-100 text-blue-800',
      'HT': 'bg-green-100 text-green-800',
      'GPT': 'bg-yellow-100 text-yellow-800'
    };
    return classes[technique] || 'bg-gray-100 text-gray-800';
  }

  getTechniqueColor(technique: string): string {
    const colors: Record<string, string> = {
      'HS': '#3B82F6',
      'HT': '#10B981',
      'GPT': '#F59E0B'
    };
    return colors[technique] || '#6B7280';
  }

  getDatasetName(dataset: string): string {
    const names: Record<string, string> = {
      'todos_com': 'Todos (com transcrição)',
      'todos_sem': 'Todos (sem transcrição)',
      'esparsos_com': 'Esparsos (com transcrição)',
      'esparsos_sem': 'Esparsos (sem transcrição)',
      'repercussao_com': 'Alta repercussão (com transcrição)',
      'repercussao_sem': 'Alta repercussão (sem transcrição)'
    };
    return names[dataset] || dataset;
  }

  getDatasetColor(dataset: string): string {
    const colors: Record<string, string> = {
      'todos_com': '#3B82F6',
      'todos_sem': '#6366F1',
      'esparsos_com': '#10B981',
      'esparsos_sem': '#059669',
      'repercussao_com': '#F59E0B',
      'repercussao_sem': '#D97706'
    };
    return colors[dataset] || '#6B7280';
  }
}
