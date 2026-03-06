import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ChangeDetectorRef, NgZone } from '@angular/core';

// import { SentimentService } from '../../../services/sentiment.service';
import { SentimentRealService } from '../../../services/posicionamento-real.service';

// Reuso dos seus componentes
import { AnalysisStatCardComponent } from '../../../components/opinion-analysis/analysis-stat-card/analysis-stat-card';
import { PositioningDistributionComponent } from '../../../components/opinion-analysis/positioning-distribution/positioning-distribution';
import { TemporalEvolutionChartComponent } from '../../../components/opinion-analysis/temporal-evolution-chart/temporal-evolution-chart';
import { PositioningDoughnutChartComponent } from '../../../components/opinion-analysis/positioning-doughnut-chart/positioning-doughnut-chart';
import { MetricsBarChartComponent } from '../../../components/opinion-analysis/metrics-bar-chart/metrics-bar-chart';
import { CommentsSampleCardComponent } from '../../../components/opinion-analysis/comments-sample-card/comments-sample-card';
import { WeeklyStackedChartComponent } from '../../../components/opinion-analysis/weekly-stacked-chart/weekly-stacked-chart';

@Component({
  selector: 'app-posicionamento-real',
  standalone: true,
  imports: [
    CommonModule, ChartModule,
    AnalysisStatCardComponent, PositioningDistributionComponent,
    TemporalEvolutionChartComponent, PositioningDoughnutChartComponent, 
    CommentsSampleCardComponent, WeeklyStackedChartComponent
  ],
  templateUrl: './posicionamento-real.component.html'
})
export class PosicionamentoRealComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sentiments = inject(SentimentRealService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  // estado base
  isLoading = true;
  error = '';
  datasetId = '';

  // dados
  comments: any[] = [];
  bootstrapStats: any[] = [];
  bootstrapGroups: any[] = [];

  totalComments = 0;
  sentimentCounts: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };
  sentimentPercentages = { negative: 0, neutral: 0, positive: 0 };

  sampleComments: any[] = [];
  sentimentChartOptions: any = {};

  async ngOnInit() {
    this.datasetId = this.route.snapshot.paramMap.get('id') || '';

    const load = this.sentiments.loadDataset(this.datasetId);

    try {
      const data = await load;
      this.zone.run(() => this.applyAll(data));
    } catch (e: any) {
      this.zone.run(() => {
        this.error = 'Não foi possível carregar o dataset.';
        this.isLoading = false;
        this.cdr.markForCheck();
      });
    }
  }

  private applyAll(payload: { bootstrap: any[]; comments: any[] }) {
    this.comments = Array.isArray(payload?.comments) ? payload.comments : [];
    this.totalComments = this.comments.length;
    this.sentimentCounts = this.computeSentimentCounts(this.comments);

    if (this.totalComments > 0) {
      this.sentimentPercentages = {
        negative: Math.round((this.sentimentCounts['-1'] / this.totalComments) * 100),
        neutral: Math.round((this.sentimentCounts['0'] / this.totalComments) * 100),
        positive: Math.round((this.sentimentCounts['1'] / this.totalComments) * 100),
      };

      // amostra
      const allValid = this.comments.filter((c: any) => c.comentario && c.comentario.length > 50);
      const pos = allValid.filter((c: any) => c.new_BERT === 1).slice(0, 2);
      const neu = allValid.filter((c: any) => c.new_BERT === 0).slice(0, 2);
      const neg = allValid.filter((c: any) => c.new_BERT === -1).slice(0, 2);
      this.sampleComments = [...pos, ...neu, ...neg];
    }

    // bootstrap (necessário para a lógica interna do gráfico semanal)
    this.bootstrapStats = Array.isArray(payload?.bootstrap) ? payload.bootstrap : [];

    this.isLoading = false;
    this.error = '';
    this.cdr.markForCheck();
  }

  private computeSentimentCounts(comments: any[]): Record<string, number> {
    const counts: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };
    for (const c of comments || []) {
      const val = String(c?.new_BERT ?? '0');
      if (!(val in counts)) continue;
      counts[val]++;
    }
    return counts;
  }
}
