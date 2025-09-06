import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-operation-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule],
  template: `
    <div class="operation-details">
      <div class="header">
        <button class="back-btn" (click)="goBack()">
          <i class="pi pi-arrow-left"></i> Voltar ao Dashboard
        </button>
        <h1>Detalhes da Operação {{ operationId }}</h1>
      </div>

      <!-- Debug Info -->
      <div class="debug-info" style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px;">
        <strong>Debug:</strong> 
        Operação ID: {{ operationId }} | 
        Vídeos carregados: {{ relatedVideos.length }} | 
        Total de vídeos: {{ totalVideos }}
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ relatedVideos.length }}</div>
          <div class="stat-label">Vídeos Relacionados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ percentage.toFixed(1) }}%</div>
          <div class="stat-label">Do Total de Vídeos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ dateRange }}</div>
          <div class="stat-label">Período</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ uniqueChannels }}</div>
          <div class="stat-label">Canais Únicos</div>
        </div>
      </div>

      <div class="analysis-section">
        <h3>Análise da Operação</h3>
        
        <!-- Debug info -->
        <div class="debug-info" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;">
          <strong>Debug:</strong> Operação ID = {{ operationId }} | 
          Vídeos encontrados = {{ relatedVideos.length }} | 
          Títulos analisados = {{ relatedVideos.length }}
        </div>
        
        <div class="analysis-grid">
          <div class="pattern-card">
            <h4>Padrões Identificados</h4>
            <div class="pattern-list">
              <div *ngFor="let pattern of identifiedPatterns" class="pattern-item">
                <i class="pi pi-check-circle"></i>
                {{ pattern }}
              </div>
              <div *ngIf="identifiedPatterns.length === 0" class="pattern-item" style="color: #999;">
                <i class="pi pi-info-circle"></i>
                Nenhum padrão identificado ainda
              </div>
            </div>
          </div>
          
          <div class="keywords-card">
            <h4>Palavras-chave Mais Frequentes</h4>
            <div class="keywords-cloud">
              <span *ngFor="let keyword of topKeywords" 
                    class="keyword-tag" 
                    [style.font-size.px]="12 + keyword.weight * 8">
                {{ keyword.word }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-grid">
          <div class="chart-card">
            <h4>Distribuição Temporal</h4>
            <div class="chart-container">
              <p-chart type="line" [data]="timelineChartData" [options]="timelineChartOptions"></p-chart>
            </div>
          </div>
          
          <div class="chart-card">
            <h4>Canais por Volume</h4>
            <div class="chart-container">
              <p-chart type="bar" [data]="channelsChartData" [options]="channelsChartOptions"></p-chart>
            </div>
          </div>
        </div>
      </div>

      <div class="videos-section">
        <h3>Vídeos Relacionados ({{ relatedVideos.length }})</h3>
        
        <div class="filters">
          <input type="text" 
                 placeholder="Buscar por título..." 
                 [(ngModel)]="searchTerm" 
                 (input)="filterVideos()"
                 class="search-input">
          
          <select [(ngModel)]="sortBy" (change)="sortVideos()" class="sort-select">
            <option value="date">Data de publicação</option>
            <option value="title">Título</option>
            <option value="views">Visualizações</option>
          </select>
        </div>

        <div class="videos-grid">
          <div *ngFor="let video of filteredVideos" class="video-card">
            <div class="video-thumbnail">
              <img [src]="video.thumbnail || '/assets/default-thumbnail.svg'" 
                   [alt]="video.title"
                   (error)="onImageError($event)">
              <div class="video-duration" *ngIf="video.duration">{{ video.duration }}</div>
            </div>
            
            <div class="video-info">
              <h5 class="video-title">{{ video.titulo || video.title || 'Título não disponível' }}</h5>
              <div class="video-meta">
                <span class="channel">{{ video.canal || video.channel || 'Canal não informado' }}</span>
                <span class="date">{{ formatDate(video.data_postagem || video.date) }}</span>
              </div>
              <div class="video-stats" *ngIf="video.visualizacoes || video.views || video.curtidas || video.likes">
                <span *ngIf="video.visualizacoes || video.views" class="views">
                  <i class="pi pi-eye"></i> {{ formatNumber(video.visualizacoes || video.views) }}
                </span>
                <span *ngIf="video.curtidas || video.likes" class="likes">
                  <i class="pi pi-heart"></i> {{ formatNumber(video.curtidas || video.likes) }}
                </span>
              </div>
              <div class="video-description" *ngIf="video.descricao || video.description">
                {{ truncateText(video.descricao || video.description, 100) }}
              </div>
              <div class="video-actions">
                <a [href]="getVideoUrl(video)" target="_blank" class="watch-btn">
                  <i class="pi pi-external-link"></i> Assistir
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredVideos.length === 0" class="no-results">
          <i class="pi pi-search"></i>
          <p>Nenhum vídeo encontrado com os critérios de busca.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .operation-details {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .back-btn {
      background: #22A2F2;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }

    .back-btn:hover {
      background: #1DB6F2;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #FEFEFE;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(34,162,242,0.08);
      text-align: center;
      border: 1px solid #22A2F2;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #22A2F2;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #0D0D0D;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .analysis-section {
      background: #FEFEFE;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px solid #22A2F2;
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .pattern-card, .keywords-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .pattern-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pattern-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #41BF61;
    }

    .keywords-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .keyword-tag {
      background: #22A2F2;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 16px;
      font-weight: 500;
    }

    .charts-section {
      margin-bottom: 2rem;
    }

    .chart-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .chart-card {
      background: #FEFEFE;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #22A2F2;
    }

    .chart-container {
      height: 300px;
    }

    .videos-section {
      background: #FEFEFE;
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #22A2F2;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-input, .sort-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .search-input {
      flex: 1;
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .video-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .video-card:hover {
      transform: translateY(-2px);
    }

    .video-thumbnail {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
    }

    .video-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-duration {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .video-info {
      padding: 1rem;
    }

    .video-title {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #1f2937;
      line-height: 1.4;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .video-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .video-description {
      font-size: 0.85rem;
      color: #6b7280;
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .video-actions {
      display: flex;
      justify-content: flex-end;
    }

    .watch-btn {
      background: #22A2F2;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: background 0.2s;
    }

    .watch-btn:hover {
      background: #1DB6F2;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .no-results i {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #d1d5db;
    }

    @media (max-width: 768px) {
      .operation-details {
        padding: 1rem;
      }
      
      .analysis-grid, .chart-grid {
        grid-template-columns: 1fr;
      }
      
      .videos-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
      }
    }
  `]
})
export class OperationDetailsComponent implements OnInit {
  operationId: string = '';
  relatedVideos: any[] = [];
  filteredVideos: any[] = [];
  totalVideos = 0;
  percentage = 0;
  dateRange = '';
  uniqueChannels = 0;
  identifiedPatterns: string[] = [];
  topKeywords: { word: string; weight: number }[] = [];
  
  searchTerm = '';
  sortBy = 'date';
  
  timelineChartData: any = {};
  timelineChartOptions: any = {};
  channelsChartData: any = {};
  channelsChartOptions: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {}

  async ngOnInit() {
    console.log('=== OperationDetailsComponent ngOnInit started ===');
    this.operationId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Operation ID from route:', this.operationId, typeof this.operationId);
    
    try {
      await this.loadOperationData();
      console.log('loadOperationData completed');
      
      this.analyzeOperation();
      console.log('analyzeOperation completed');
      
      this.prepareCharts();
      console.log('prepareCharts completed');
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
    
    console.log('=== OperationDetailsComponent ngOnInit finished ===');
  }

  async loadOperationData() {
    try {
      const { videos } = await this.eventsService.listAll();
      this.totalVideos = videos.length;
      console.log('Total videos loaded:', this.totalVideos);
      console.log('Sample video for structure check:', videos[0]);
      
      // Converter operationId para número se necessário
      const opId = isNaN(Number(this.operationId)) ? this.operationId : Number(this.operationId);
      console.log('Operation ID for filtering:', opId, typeof opId);
      
      // Filtrar vídeos relacionados a esta operação (busca mais robusta)
      this.relatedVideos = videos.filter((video: any) => {
        // Comparação direta por operation ID
        if (video.operation === opId || video.operacao === opId) {
          console.log('Found video by operation ID:', video.id_video, video.titulo);
          return true;
        }
        
        // Busca por string no operation field
        if (String(video.operation) === String(this.operationId) || 
            String(video.operacao) === String(this.operationId)) {
          return true;
        }
        
        // Busca no título (fallback)
        const title = (video.titulo || video.title || '').toLowerCase();
        const searchTerm = String(this.operationId).toLowerCase();
        
        return title.includes(searchTerm) || 
               title.includes(`operação ${searchTerm}`) ||
               title.includes(`op ${searchTerm}`);
      });
      
      console.log(`Operação ${this.operationId}: encontrados ${this.relatedVideos.length} vídeos`);
      if (this.relatedVideos.length > 0) {
        console.log('Primeiros vídeos encontrados:', this.relatedVideos.slice(0, 3));
      } else {
        console.log('Nenhum vídeo encontrado. Verificando primeiros 10 vídeos da base:');
        console.log(videos.slice(0, 10).map(v => ({
          operation: v.operation,
          operacao: v.operacao,
          titulo: v.titulo,
          id: v.id_video
        })));
      }
      
      this.filteredVideos = [...this.relatedVideos];
      this.percentage = this.totalVideos > 0 ? (this.relatedVideos.length / this.totalVideos) * 100 : 0;
      
      // Calcular período
      const dates = this.relatedVideos
        .map(v => v.data_postagem || v.date)
        .filter(Boolean)
        .sort();
      
      if (dates.length > 0) {
        const firstDate = new Date(dates[0]).toLocaleDateString('pt-BR');
        const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString('pt-BR');
        this.dateRange = firstDate === lastDate ? firstDate : `${firstDate} - ${lastDate}`;
      } else {
        this.dateRange = 'Período não disponível';
      }
      
      // Contar canais únicos
      const channels = new Set(this.relatedVideos.map(v => v.canal || v.channel).filter(Boolean));
      this.uniqueChannels = channels.size;
      
    } catch (error) {
      console.error('Erro ao carregar dados da operação:', error);
    }
  }

  analyzeOperation() {
    // Carregar padrões salvos
    const savedPatterns = this.loadSavedPatterns();
    
    // Analisar títulos dos vídeos
    const titles = this.relatedVideos.map(v => v.titulo || v.title || '').filter(Boolean);
    console.log(`Analisando operação ${this.operationId}:`);
    console.log(`- Vídeos relacionados: ${this.relatedVideos.length}`);
    console.log(`- Títulos válidos: ${titles.length}`);
    console.log('- Primeiros títulos:', titles.slice(0, 3));
    
    this.identifiedPatterns = this.extractPatterns(titles);
    this.topKeywords = this.extractKeywords(titles);
    
    console.log('- Padrões identificados:', this.identifiedPatterns);
    console.log('- Palavras-chave:', this.topKeywords);
    
    // Salvar análise atualizada
    this.saveAnalysis(savedPatterns);
  }

  prepareCharts() {
    // Gráfico de timeline
    const timelineData = this.groupByMonth();
    this.timelineChartData = {
      labels: timelineData.map(d => d.month),
      datasets: [{
        label: 'Vídeos por Mês',
        data: timelineData.map(d => d.count),
        borderColor: '#22A2F2',
        backgroundColor: 'rgba(34, 162, 242, 0.1)',
        fill: true
      }]
    };
    
    this.timelineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    };
    
    // Gráfico de canais
    const channelData = this.groupByChannel();
    this.channelsChartData = {
      labels: channelData.map(d => d.channel),
      datasets: [{
        label: 'Vídeos por Canal',
        data: channelData.map(d => d.count),
        backgroundColor: ['#22A2F2', '#1DB6F2', '#41BF61', '#0D0D0D', '#FEFEFE']
      }]
    };
    
    this.channelsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y'
    };
  }

  groupByMonth(): { month: string; count: number }[] {
    const groups: Record<string, number> = {};
    
    this.relatedVideos.forEach(video => {
      const dateStr = video.data_postagem || video.date;
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const month = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
          groups[month] = (groups[month] || 0) + 1;
        }
      }
    });
    
    return Object.entries(groups)
      .map(([month, count]) => ({ month, count }))
      .sort();
  }

  groupByChannel(): { channel: string; count: number }[] {
    const groups: Record<string, number> = {};
    
    this.relatedVideos.forEach(video => {
      const channel = video.canal || video.channel || 'Canal Desconhecido';
      groups[channel] = (groups[channel] || 0) + 1;
    });
    
    return Object.entries(groups)
      .map(([channel, count]) => ({ channel, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  extractPatterns(titles: string[]): string[] {
    const patterns: string[] = [];
    
    if (titles.length === 0) {
      return ['Nenhum título disponível para análise'];
    }
    
    console.log('Analisando títulos:', titles.slice(0, 5)); // Debug
    
    // Padrões específicos de operações (mais abrangentes)
    const operationPatterns = [
      { pattern: /operação|operacao/gi, label: 'Operação policial' },
      { pattern: /prisão|preso|detido|detida|captura/gi, label: 'Operação de prisão' },
      { pattern: /apreensão|apreensao|droga|drogas|entorpecente/gi, label: 'Apreensão de drogas' },
      { pattern: /homicídio|homicidio|assassinato|morte|morto|morta|óbito/gi, label: 'Crime contra vida' },
      { pattern: /roubo|furto|assalto|latrocínio|latrocinio/gi, label: 'Crime contra patrimônio' },
      { pattern: /chacina|massacre|múltiplas|vítimas/gi, label: 'Crime com múltiplas vítimas' },
      { pattern: /tráfico|trafico|narcotráfico/gi, label: 'Tráfico de drogas' },
      { pattern: /polícia|policial|pm|civil|militar/gi, label: 'Ação policial' },
      { pattern: /investigação|investigacao|inquérito|inquerito/gi, label: 'Investigação criminal' },
      { pattern: /facção|faccao|organizada|criminosa/gi, label: 'Crime organizado' }
    ];
    
    const foundPatterns = new Set<string>();
    
    operationPatterns.forEach(({ pattern, label }) => {
      const matches = titles.some(title => pattern.test(title));
      if (matches) {
        foundPatterns.add(label);
      }
    });
    
    // Adicionar padrões encontrados
    patterns.push(...Array.from(foundPatterns));
    
    // Análise de palavras-chave (melhorada)
    const keywords: Record<string, number> = {};
    const stopWords = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem', 'sob', 'sobre', 'após', 'antes', 'durante', 'contra', 'entre', 'até', 'desde', 'após', 'que', 'como', 'quando', 'onde', 'porque', 'porque', 'já', 'ainda', 'mais', 'menos', 'muito', 'pouco', 'todo', 'toda', 'todos', 'todas', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'seu', 'sua', 'seus', 'suas', 'meu', 'minha', 'meus', 'minhas', 'nosso', 'nossa', 'nossos', 'nossas']);
    
    titles.forEach(title => {
      const words = title.toLowerCase()
        .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));
      
      words.forEach(word => {
        keywords[word] = (keywords[word] || 0) + 1;
      });
    });
    
    // Identificar palavras-chave mais frequentes
    const topKeywords = Object.entries(keywords)
      .filter(([, count]) => count >= Math.max(2, Math.ceil(titles.length * 0.2)))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);
    
    if (topKeywords.length > 0) {
      patterns.push(`Palavras-chave: ${topKeywords.join(', ')}`);
    }
    
    console.log('Padrões encontrados:', patterns); // Debug
    
    return patterns.length > 0 ? patterns : ['Padrão não identificado - análise manual necessária'];
  }

  extractKeywords(titles: string[]): { word: string; weight: number }[] {
    const keywords: Record<string, number> = {};
    const stopWords = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem', 'sob', 'sobre', 'após', 'antes', 'durante', 'contra', 'entre', 'até', 'desde', 'que', 'como', 'quando', 'onde', 'porque', 'já', 'ainda', 'mais', 'menos', 'muito', 'pouco', 'todo', 'toda', 'todos', 'todas']);
    
    titles.forEach(title => {
      const words = title.toLowerCase()
        .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));
      
      words.forEach(word => {
        keywords[word] = (keywords[word] || 0) + 1;
      });
    });
    
    return Object.entries(keywords)
      .map(([word, count]) => ({ 
        word, 
        weight: Math.min(count / Math.max(titles.length, 1), 1) 
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10);
  }

  loadSavedPatterns(): any {
    try {
      return JSON.parse(localStorage.getItem('operationPatterns') || '{}');
    } catch {
      return {};
    }
  }

  saveAnalysis(savedPatterns: any) {
    try {
      savedPatterns[this.operationId] = {
        patterns: this.identifiedPatterns,
        keywords: this.topKeywords,
        lastUpdated: new Date().toISOString(),
        videosCount: this.relatedVideos.length
      };
      localStorage.setItem('operationPatterns', JSON.stringify(savedPatterns));
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
    }
  }

  filterVideos() {
    if (!this.searchTerm.trim()) {
      this.filteredVideos = [...this.relatedVideos];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredVideos = this.relatedVideos.filter(video =>
        (video.titulo || video.title || '').toLowerCase().includes(term) ||
        (video.descricao || video.description || '').toLowerCase().includes(term)
      );
    }
    this.sortVideos();
  }

  sortVideos() {
    this.filteredVideos.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return (a.titulo || a.title || '').localeCompare(b.titulo || b.title || '');
        case 'views':
          return (b.visualizacoes || b.views || 0) - (a.visualizacoes || a.views || 0);
        case 'date':
        default:
          const dateA = new Date(a.data_postagem || a.date || 0);
          const dateB = new Date(b.data_postagem || b.date || 0);
          return dateB.getTime() - dateA.getTime();
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'Data não disponível';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getVideoUrl(video: any): string {
    // Gerar URL do YouTube baseado no id_video
    if (video.id_video) {
      return `https://www.youtube.com/watch?v=${video.id_video}`;
    }
    // Fallback para URLs diretas
    return video.url || video.link || '#';
  }

  onImageError(event: any) {
    event.target.src = '/assets/default-thumbnail.svg';
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
