import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { SentimentService } from '../../services/sentiment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public datasets: any[] = [];
  public labels: string[] = [];
  public chartOptions: any = { responsive: true };

  // PrimeNG Chart data objects
  public sentimentChartData: any = null;
  public sentimentChartOptions: any = { responsive: true, maintainAspectRatio: false };

  public bootstrapChartData: any = null;
  public bootstrapChartOptions: any = { responsive: true, scales: { x: { beginAtZero: true } }, maintainAspectRatio: false };
  public bootstrapCharts: any[] = [];

  // additional charts
  public videosByYearChartData: any = null;
  public videosByYearChartOptions: any = { responsive: true, maintainAspectRatio: false };

  public videosByMonthChartData: any = null;
  public videosByMonthChartOptions: any = { responsive: true, maintainAspectRatio: false };

  public topOpsChartData: any = null;
  public topOpsChartOptions: any = { responsive: true, indexAxis: 'y', maintainAspectRatio: false };

  // summary
  public totalVideos = 0;
  public firstDate: string | null = null;
  public lastDate: string | null = null;
  public topOperations: { op: any; count: number }[] = [];
  
  // aggregated data
  public videosByYear: any[] = [];
  public videosByMonth: any[] = [];
  public metricsData: any[] = [];
  public allVideos: any[] = []; // Adicionar para usar na identificação de padrões
  // sentiment
  public sentimentCounts: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };
  public bootstrapStats: any[] = [];
  public sentimentTotal = 0;
  public uniqueOperationsCount = 0;
  public repeatedEventsCount = 0;

  constructor(private events: EventsService, private sentiment: SentimentService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const { videos, metrics, videosByMonth, videosByYear } = await this.events.listAll();
    
    this.allVideos = videos; // Salvar para usar na identificação de padrões
    this.totalVideos = videos.length;
    this.videosByYear = videosByYear;
    this.videosByMonth = videosByMonth;
  this.metricsData = metrics;

  // load sentiment data
  const s = await this.sentiment.listAll();
  this.bootstrapStats = s.bootstrap || [];
  const comments = s.comments || [];
  this.sentimentCounts = this.sentiment.getSentimentCounts(comments);
  this.sentimentTotal = Array.isArray(comments) ? comments.length : 0;

    // prepare PrimeNG Chart datasets for sentiment
    this.sentimentChartData = {
      labels: ['Negativo', 'Neutro', 'Positivo'],
      datasets: [
        {
          data: [this.sentimentCounts['-1'] || 0, this.sentimentCounts['0'] || 0, this.sentimentCounts['1'] || 0],
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
        }
      ]
    };

    // prepare bootstrap bar data (first N pairs)
    const bp = this.getBootstrapPairs();
    this.bootstrapChartData = {
      labels: bp.map(b => b.label),
      datasets: [
        { label: 'Mean', data: bp.map(b => Number((b.value ?? 0) * 100)), backgroundColor: '#3498db' }
      ]
    };

    // parse bootstrapStats into multiple small charts (one per metric type)
    this.bootstrapCharts = [];
    try {
      const groups: Record<string, { cls: string; mean: number }[]> = {};
      for (const b of this.bootstrapStats || []) {
        const key = (b[''] || b.label || '').toString();
        const m = key.match(/^(\w+)_class_(\d+)$/);
        if (m) {
          const metric = m[1];
          const cls = m[2];
          groups[metric] = groups[metric] || [];
          groups[metric].push({ cls, mean: Number(b.mean ?? 0) });
        }
      }

      for (const [metric, items] of Object.entries(groups)) {
        items.sort((a, b) => Number(a.cls) - Number(b.cls));
        const labels = items.map(i => `classe ${i.cls}`);
        const data = items.map(i => Number((i.mean ?? 0) * 100));
        this.bootstrapCharts.push({
          key: metric,
          data: { labels, datasets: [{ label: metric, data, backgroundColor: ['#60a5fa', '#34d399', '#f59e0b'] }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, max: 100 } } }
        });
      }
    } catch (e) {
      console.error('bootstrapCharts parse error', e);
    }
    
    const dates = videos.map((v:any) => v.data_postagem).filter(Boolean).sort();
    this.firstDate = dates[0] ?? null;
    this.lastDate = dates[dates.length - 1] ?? null;

    // top operations (count by operation code)
    const opCounts: Record<string, number> = {};
    for (const v of videos) {
      const op = v.operation ?? 'unknown';
      opCounts[op] = (opCounts[op] || 0) + 1;
    }
    // unique operations
    this.uniqueOperationsCount = Object.keys(opCounts).length;
  // events that are part of repeated operations (count only duplicates: occurrences beyond the first)
  this.repeatedEventsCount = Object.entries(opCounts).reduce((sum, [, count]) => sum + (count > 1 ? (count - 1) : 0), 0);

    this.topOperations = Object.entries(opCounts)
      .map(([op, count]) => ({ op, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // prepare datasets for visualization
    this.prepareChartData();

    // build PrimeNG chart objects for additional charts
    this.videosByYearChartData = {
      labels: this.videosByYear.map(d => d.period),
      datasets: [{ label: 'Vídeos por Ano', data: this.videosByYear.map(d => d.count), backgroundColor: '#6c5ce7' }]
    };

    this.videosByMonthChartData = {
      labels: this.videosByMonth.map(d => d.period),
      datasets: [{ label: 'Vídeos por Mês', data: this.videosByMonth.map(d => d.count), fill: false, borderColor: '#0984e3' }]
    };

    this.topOpsChartData = {
      labels: this.topOperations.map(o => `Op ${o.op}`),
      datasets: [{ label: 'Top 10 Operações', data: this.topOperations.map(o => o.count), backgroundColor: '#00b894' }]
    };
    
    this.topOpsChartOptions = {
      responsive: true,
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const idx = ctx.dataIndex;
              const op = this.topOperations[idx]?.op;
              const count = ctx.parsed.x;
              const percent = ((count / this.totalVideos) * 100).toFixed(1);
              const opPattern = this.identifyOperationPattern(op);
              return [
                `Operação: ${op}`,
                `Vídeos: ${count} (${percent}%)`,
                `Padrão identificado: ${opPattern}`
              ];
            }
          }
        }
      },
      onClick: (event: any, elements: any[]) => {
        if (elements && elements.length > 0) {
          const idx = elements[0].index;
          const op = this.topOperations[idx]?.op;
          if (op) this.goToOperation(op);
        }
      }
    };
  }

  private prepareChartData(): void {
    this.datasets = [
      {
        label: 'Vídeos por Ano',
        data: this.videosByYear.map(d => d.count),
        labels: this.videosByYear.map(d => d.period)
      },
      {
        label: 'Top 10 Operações',
        data: this.topOperations.map(d => d.count),
        labels: this.topOperations.map(d => `Op ${d.op}`)
      }
    ];
    
    // Use year labels as primary labels
    this.labels = this.videosByYear.map(d => d.period);
  }

  // small helpers for templates (SVG chart scale)
  getSentimentTotal(): number {
    return (this.sentimentCounts['-1'] || 0) + (this.sentimentCounts['0'] || 0) + (this.sentimentCounts['1'] || 0);
  }

  // convert bootstrap stats to label/value pairs (mean values)
  getBootstrapPairs(): { label: string; value: number }[] {
    return (this.bootstrapStats || [])
      .map((b: any) => ({ label: (b[''] || b.label || '').toString(), value: Number(b.mean ?? 0) }))
      .slice(0, 12);
  }

  // SVG helpers
  private sentimentScaleFactor = 80; // px
  private sentimentMaxHeight = 100; // px base

  barHeight(count: number): number {
    const total = this.getSentimentTotal() || 1;
    return (count / total) * this.sentimentScaleFactor;
  }

  barY(count: number): number {
    return this.sentimentMaxHeight - this.barHeight(count);
  }

  bootstrapWidth(value: number): number {
    const w = value * 200;
    return Math.max(2, isFinite(w) ? w : 2);
  }

  bootstrapY(index: number): number {
    return index * 18 + 3;
  }

  // Navega para a página de detalhes da operação
  goToOperation(op: string) {
    this.router.navigate(['/operacao', encodeURIComponent(op)]);
  }

  // Identifica padrão da operação baseado nos títulos dos vídeos relacionados
  identifyOperationPattern(op: string): string {
    // Buscar vídeos relacionados a esta operação
    const relatedVideos = this.getVideosByOperation(op);
    
    if (relatedVideos.length === 0) return 'Padrão não identificado';
    
    // Analisar títulos para identificar padrões comuns
    const titles = relatedVideos.map(v => v.title || v.titulo || '').filter(Boolean);
    const patterns = this.extractPatterns(titles);
    
    // Salvar identificação no localStorage para persistência
    this.saveOperationPattern(op, patterns);
    
    return patterns.length > 0 ? patterns.join(', ') : 'Padrão não identificado';
  }

  private getVideosByOperation(op: string): any[] {
    // Retorna todos os vídeos relacionados a uma operação específica
    const opId = isNaN(Number(op)) ? op : Number(op);
    
    return this.allVideos.filter(video => {
      // Comparação direta por operation ID
      if (video.operation === opId || video.operacao === opId) {
        return true;
      }
      
      // Busca por string no operation field
      if (String(video.operation) === String(op) || 
          String(video.operacao) === String(op)) {
        return true;
      }
      
      // Busca no título (fallback)
      const title = (video.titulo || video.title || '').toLowerCase();
      const searchTerm = String(op).toLowerCase();
      
      return title.includes(searchTerm) || 
             title.includes(`operação ${searchTerm}`) ||
             title.includes(`op ${searchTerm}`);
    });
  }

  private extractPatterns(titles: string[]): string[] {
    const patterns: string[] = [];
    const keywords: Record<string, number> = {};
    
    if (titles.length === 0) {
      return ['Nenhum título disponível'];
    }
    
    // Contar palavras-chave nos títulos (melhorado)
    const stopWords = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com']);
    
    titles.forEach(title => {
      const words = title.toLowerCase()
        .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));
      
      words.forEach(word => {
        keywords[word] = (keywords[word] || 0) + 1;
      });
    });
    
    // Identificar padrões baseados em frequência
    const commonWords = Object.entries(keywords)
      .filter(([, count]) => count >= Math.max(2, Math.ceil(titles.length * 0.3)))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);
    
    if (commonWords.length > 0) {
      patterns.push(`Palavras-chave: ${commonWords.join(', ')}`);
    }
    
    // Identificar padrões específicos de operações policiais
    const operationPatterns = [
      { pattern: /operação|operacao/gi, label: 'Operação policial' },
      { pattern: /prisão|preso|detido|detida/gi, label: 'Operação de prisão' },
      { pattern: /apreensão|apreensao|droga|drogas/gi, label: 'Apreensão de drogas' },
      { pattern: /homicídio|homicidio|assassinato|morte/gi, label: 'Crime contra vida' },
      { pattern: /roubo|furto|assalto/gi, label: 'Crime contra patrimônio' },
      { pattern: /tráfico|trafico/gi, label: 'Tráfico de drogas' },
      { pattern: /chacina|massacre/gi, label: 'Múltiplas vítimas' }
    ];
    
    operationPatterns.forEach(({ pattern, label }) => {
      const matches = titles.some(title => pattern.test(title));
      if (matches && !patterns.includes(label)) {
        patterns.push(label);
      }
    });
    
    return patterns.length > 0 ? patterns : ['Padrão específico não identificado'];
  }

  private saveOperationPattern(op: string, patterns: string[]) {
    try {
      const saved = JSON.parse(localStorage.getItem('operationPatterns') || '{}');
      saved[op] = {
        patterns,
        lastUpdated: new Date().toISOString(),
        confidence: patterns.length > 0 ? 'high' : 'low'
      };
      localStorage.setItem('operationPatterns', JSON.stringify(saved));
    } catch (error) {
      console.error('Erro ao salvar padrão da operação:', error);
    }
  }
}
