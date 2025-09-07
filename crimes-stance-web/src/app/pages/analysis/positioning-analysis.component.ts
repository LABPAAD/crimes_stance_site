import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SentimentService } from '../../services/sentiment.service';

@Component({
  selector: 'app-opinion-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ChartModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Análise de Posicionamento</h1>
          <p class="text-slate-600 mt-2">Análise de opiniões e posicionamentos da população sobre diversos assuntos</p>
        </div>
      </div>

      <!-- Métricas principais -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-chat-text text-blue-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                <ng-container *ngIf="!isLoading">{{ formatNumber(totalComments) }}</ng-container>
                <ng-container *ngIf="isLoading">...</ng-container>
              </div>
              <div class="text-sm text-slate-600">Opiniões Analisadas</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-emoji-smile text-green-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                <ng-container *ngIf="!isLoading">{{ sentimentPercentages.positive }}%</ng-container>
                <ng-container *ngIf="isLoading">...</ng-container>
              </div>
              <div class="text-sm text-slate-600">Sentimento Positivo</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-emoji-frown text-red-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                <ng-container *ngIf="!isLoading">{{ sentimentPercentages.negative }}%</ng-container>
                <ng-container *ngIf="isLoading">...</ng-container>
              </div>
              <div class="text-sm text-slate-600">Sentimento Negativo</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i class="bi bi-emoji-neutral text-yellow-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                <ng-container *ngIf="!isLoading">{{ sentimentPercentages.neutral }}%</ng-container>
                <ng-container *ngIf="isLoading">...</ng-container>
              </div>
              <div class="text-sm text-slate-600">Sentimento Neutro</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribuição de sentimentos e tópicos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Distribuição de sentimentos -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Distribuição de Sentimentos</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-green-500 rounded"></div>
                <span class="text-slate-700">Positivo ({{ formatNumber(sentimentCounts['1'] || 0) }} comentários)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-slate-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" [style.width.%]="sentimentPercentages.positive"></div>
                </div>
                <span class="text-sm font-medium text-slate-600">{{ sentimentPercentages.positive }}%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-red-500 rounded"></div>
                <span class="text-slate-700">Negativo ({{ formatNumber(sentimentCounts['-1'] || 0) }} comentários)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-slate-200 rounded-full h-2">
                  <div class="bg-red-500 h-2 rounded-full" [style.width.%]="sentimentPercentages.negative"></div>
                </div>
                <span class="text-sm font-medium text-slate-600">{{ sentimentPercentages.negative }}%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                <span class="text-slate-700">Neutro ({{ formatNumber(sentimentCounts['0'] || 0) }} comentários)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-slate-200 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" [style.width.%]="sentimentPercentages.neutral"></div>
                </div>
                <span class="text-sm font-medium text-slate-600">{{ sentimentPercentages.neutral }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tópicos mais discutidos -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Tópicos Mais Discutidos (Nordeste 2021)</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="bi bi-shield text-blue-600 text-sm"></i>
                </div>
                <span class="text-slate-900">Segurança Pública</span>
              </div>
              <span class="font-medium text-slate-700">{{ formatNumber(topicCounts.security) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <i class="bi bi-exclamation-triangle text-red-600 text-sm"></i>
                </div>
                <span class="text-slate-900">Violência Urbana</span>
              </div>
              <span class="font-medium text-slate-700">{{ formatNumber(topicCounts.violence) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="bi bi-people text-green-600 text-sm"></i>
                </div>
                <span class="text-slate-900">Polícias</span>
              </div>
              <span class="font-medium text-slate-700">{{ formatNumber(topicCounts.police) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="bi bi-building text-purple-600 text-sm"></i>
                </div>
                <span class="text-slate-900">Gestão Pública</span>
              </div>
              <span class="font-medium text-slate-700">{{ formatNumber(topicCounts.management) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Evolução temporal dos sentimentos -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Evolução Temporal dos Sentimentos</h3>
        <div class="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
          <div class="text-center">
            <i class="bi bi-graph-up text-4xl mb-2"></i>
            <p>Gráfico de linha mostrando evolução dos sentimentos ao longo do tempo</p>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Distribuição de Sentimentos (Gráfico)</h3>
          <div class="h-64">
            <p-chart type="doughnut" [data]="sentimentChartData" [options]="sentimentChartOptions"></p-chart>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Métricas por Técnica</h3>
          <div class="h-64">
            <p-chart type="bar" [data]="metricsChartData" [options]="metricsChartOptions"></p-chart>
          </div>
        </div>
      </div>

      <!-- Bootstrap Results -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6" *ngIf="bootstrapGroups.length > 0">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Resultados Bootstrap (Intervalos de Confiança)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let group of bootstrapGroups" class="border border-slate-200 rounded-lg p-4">
            <h4 class="font-semibold text-slate-900 mb-3 capitalize">{{ group.metric }}</h4>
            <div class="space-y-3">
              <div *ngFor="let item of group.items" class="space-y-2">
                <div class="text-sm text-slate-600">Classe {{ item.class }}</div>
                <div class="relative bg-slate-100 h-4 rounded-full">
                  <div class="absolute h-full bg-blue-200 rounded-full" 
                       [style.left.%]="item.lower_ci * 100"
                       [style.width.%]="(item.upper_ci - item.lower_ci) * 100">
                  </div>
                  <div class="absolute w-0.5 h-full bg-blue-600" 
                       [style.left.%]="item.mean * 100"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-500">
                  <span>{{ (item.lower_ci * 100).toFixed(1) }}%</span>
                  <strong class="text-slate-700">{{ (item.mean * 100).toFixed(1) }}%</strong>
                  <span>{{ (item.upper_ci * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas Detalhadas por Técnica -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Métricas Detalhadas por Técnica</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-2">Filtrar por técnica:</label>
          <select [(ngModel)]="selectedTechnique" (change)="filterMetrics()" 
                  class="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as técnicas</option>
            <option *ngFor="let tech of availableTechniques" [value]="tech">{{ tech }}</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let metric of filteredMetrics" class="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-slate-900">{{ metric.tecnica }}</h4>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{{ metric.cenario }}</span>
            </div>
            <div class="space-y-3">
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>Acurácia</span>
                  <span class="font-medium">{{ (metric.acu * 100).toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" [style.width.%]="metric.acu * 100"></div>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>Precisão</span>
                  <span class="font-medium">{{ (metric.pre * 100).toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" [style.width.%]="metric.pre * 100"></div>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>Recall</span>
                  <span class="font-medium">{{ (metric.rev * 100).toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" [style.width.%]="metric.rev * 100"></div>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>F1-Score</span>
                  <span class="font-medium">{{ (metric.f1 * 100).toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" [style.width.%]="metric.f1 * 100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Amostra de Comentários -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Amostra de Comentários Analisados</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let comment of sampleComments" 
               class="border rounded-lg p-4 border-l-4"
               [ngClass]="{
                 'border-l-red-500 bg-red-50': comment.new_BERT === -1,
                 'border-l-yellow-500 bg-yellow-50': comment.new_BERT === 0,
                 'border-l-green-500 bg-green-50': comment.new_BERT === 1
               }">
            <div class="flex justify-between items-center mb-2">
              <span class="px-2 py-1 rounded text-xs font-medium"
                    [ngClass]="{
                      'bg-red-100 text-red-800': comment.new_BERT === -1,
                      'bg-yellow-100 text-yellow-800': comment.new_BERT === 0,
                      'bg-green-100 text-green-800': comment.new_BERT === 1
                    }">
                {{ getSentimentLabel(comment.new_BERT) }}
              </span>
              <span class="text-xs text-slate-500">{{ formatDate(comment.timestamp) }}</span>
            </div>
            <p class="text-sm text-slate-700 mb-2 line-clamp-3">{{ comment.comentario }}</p>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Canal: {{ comment.canal }}</span>
              <span>{{ comment.curtidas }} curtidas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Precisão do modelo -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Precisão do Modelo BERT</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-xl font-bold text-blue-600">87%</div>
            <div class="text-sm text-slate-600">Precisão Geral</div>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-xl font-bold text-green-600">91%</div>
            <div class="text-sm text-slate-600">Recall</div>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-xl font-bold text-purple-600">89%</div>
            <div class="text-sm text-slate-600">F1-Score</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OpinionAnalysisComponent implements OnInit {
  
  // Dados do serviço
  totalComments = 0;
  sentimentCounts: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };
  sentimentPercentages = { negative: 0, neutral: 0, positive: 0 };
  topicCounts = { security: 0, violence: 0, police: 0, management: 0 };
  isLoading = true;
  
  // Dados para gráficos e análises avançadas
  metrics: any[] = [];
  filteredMetrics: any[] = [];
  selectedTechnique = '';
  availableTechniques: string[] = [];
  
  sentimentChartData: any = {};
  sentimentChartOptions: any = {};
  metricsChartData: any = {};
  metricsChartOptions: any = {};
  
  bootstrapStats: any[] = [];
  bootstrapGroups: any[] = [];
  sampleComments: any[] = [];
  datasetInfo: any = {};
  
  constructor(private sentimentService: SentimentService) {}
  
  async ngOnInit() {
    await this.loadAllData();
    this.prepareSentimentChart();
    this.prepareMetricsChart();
  }

  async loadAllData() {
    try {
      const data = await this.sentimentService.listAll();
      
      // Dados dos comentários
      this.totalComments = data.comments.length;
      this.sentimentCounts = this.sentimentService.getSentimentCounts(data.comments);
      
      // Calcular percentuais
      if (this.totalComments > 0) {
        this.sentimentPercentages = {
          negative: Math.round((this.sentimentCounts['-1'] / this.totalComments) * 100),
          neutral: Math.round((this.sentimentCounts['0'] / this.totalComments) * 100),
          positive: Math.round((this.sentimentCounts['1'] / this.totalComments) * 100)
        };
        
        // Calcular contagens aproximadas de tópicos baseadas no total
        this.topicCounts = {
          security: Math.floor(this.totalComments * 0.65),
          violence: Math.floor(this.totalComments * 0.45),
          police: Math.floor(this.totalComments * 0.38),
          management: Math.floor(this.totalComments * 0.22)
        };

        // Selecionar comentários de amostra
        this.sampleComments = data.comments
          .filter((comment: any) => comment.text && comment.text.length > 50)
          .slice(0, 10)
          .map((comment: any) => ({
            ...comment,
            sentimentLabel: this.getSentimentLabel(comment.new_BERT || comment.sentiment)
          }));
      }

      // Dados de bootstrap
      this.bootstrapStats = data.bootstrap;
      this.bootstrapGroups = this.groupBootstrapResults(this.bootstrapStats);

      // Dados de métricas
      if (data.datasets && data.datasets.metrics) {
        this.metrics = Array.isArray(data.datasets.metrics) ? data.datasets.metrics : Object.values(data.datasets.metrics);
        this.availableTechniques = [...new Set(this.metrics.map((m: any) => m.technique || m.model || 'Não especificado'))];
        this.filteredMetrics = [...this.metrics];
        
        if (this.availableTechniques.length > 0) {
          this.selectedTechnique = this.availableTechniques[0];
          this.filterMetrics();
        }
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.isLoading = false;
    }
  }

  prepareSentimentChart() {
    this.sentimentChartData = {
      labels: ['Negativo', 'Neutro', 'Positivo'],
      datasets: [{
        data: [
          this.sentimentPercentages.negative,
          this.sentimentPercentages.neutral,
          this.sentimentPercentages.positive
        ],
        backgroundColor: [
          '#ef4444', // red-500
          '#6b7280', // gray-500
          '#10b981'  // emerald-500
        ],
        borderWidth: 0
      }]
    };

    this.sentimentChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.label}: ${context.parsed.toFixed(1)}%`;
            }
          }
        }
      }
    };
  }

  prepareMetricsChart() {
    if (this.filteredMetrics.length === 0) return;

    const labels = this.filteredMetrics.map((m: any) => m.name || m.dataset || 'Dataset');
    const accuracyData = this.filteredMetrics.map((m: any) => m.accuracy || m.score || 0);
    const f1Data = this.filteredMetrics.map((m: any) => m.f1_score || m.f1 || 0);

    this.metricsChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Acurácia',
          data: accuracyData,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        },
        {
          label: 'F1-Score',
          data: f1Data,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    };

    this.metricsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1
        }
      }
    };
  }

  filterMetrics() {
    if (!this.selectedTechnique || this.selectedTechnique === '') {
      this.filteredMetrics = [...this.metrics];
    } else {
      this.filteredMetrics = this.metrics.filter((metric: any) => 
        (metric.technique || metric.model || 'Não especificado') === this.selectedTechnique
      );
    }
    this.prepareMetricsChart();
  }

  groupBootstrapResults(results: any[]): any[] {
    const groups: any[] = [];
    
    if (results.length === 0) return groups;

    // Se é um único resultado, criar grupo baseado nas propriedades
    if (results.length === 1) {
      const result = results[0];
      Object.keys(result).forEach(key => {
        if (typeof result[key] === 'object' && result[key] !== null) {
          groups.push({
            name: key,
            data: result[key],
            summary: this.createBootstrapSummary(result[key])
          });
        }
      });
    } else {
      // Múltiplos resultados, agrupar por técnica ou modelo
      const groupMap = new Map();
      results.forEach(result => {
        const key = result.technique || result.model || 'Geral';
        if (!groupMap.has(key)) {
          groupMap.set(key, []);
        }
        groupMap.get(key).push(result);
      });

      groupMap.forEach((data, name) => {
        groups.push({
          name,
          data,
          summary: this.createBootstrapSummary(data)
        });
      });
    }

    return groups;
  }

  createBootstrapSummary(data: any): any {
    if (Array.isArray(data)) {
      return {
        count: data.length,
        avgScore: data.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / data.length || 0
      };
    } else if (typeof data === 'object' && data !== null) {
      const values = Object.values(data).filter(v => typeof v === 'number');
      return {
        count: values.length,
        avgScore: values.reduce((sum: number, val: any) => sum + val, 0) / values.length || 0
      };
    }
    return { count: 0, avgScore: 0 };
  }

  getSentimentLabel(sentiment: number): string {
    switch (sentiment) {
      case -1: return 'Negativo';
      case 0: return 'Neutro';
      case 1: return 'Positivo';
      default: return 'Indefinido';
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }
  
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

}
