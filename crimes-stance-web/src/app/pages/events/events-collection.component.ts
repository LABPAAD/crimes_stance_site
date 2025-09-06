import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-events-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="events-collection">
      <header class="page-header">
        <h1>Coletas de Eventos</h1>
        <p class="page-description">Exploração detalhada do dataset de vídeos relacionados a crimes</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ total.toLocaleString() }}</div>
          <div class="stat-label">Total de Vídeos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ uniqueOperations }}</div>
          <div class="stat-label">Operações Únicas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ dateRange }}</div>
          <div class="stat-label">Período Temporal</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ avgVideosPerOp }}</div>
          <div class="stat-label">Média por Operação</div>
        </div>
      </div>

      <div class="filters-section">
        <h3>Filtros e Busca</h3>
        <div class="filter-controls">
          <input 
            type="text" 
            placeholder="Buscar por título ou descrição..." 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            class="search-input"
          >
          <select [(ngModel)]="selectedOperation" (change)="applyFilters()" class="operation-filter">
            <option value="">Todas as operações</option>
            <option *ngFor="let op of topOperations" [value]="op.operation">
              Operação {{ op.operation }} ({{ op.count }} vídeos)
            </option>
          </select>
        </div>
      </div>

      <div class="results-section">
        <div class="results-header">
          <h3>Resultados ({{ filteredTotal }} de {{ total }})</h3>
          <div class="per-page-selector">
            <label>Itens por página:</label>
            <select [(ngModel)]="per" (change)="updatePagination()">
              <option [value]="10">10</option>
              <option [value]="20">20</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
          </div>
        </div>

        <div class="video-grid">
          <div *ngFor="let v of pageItems" class="video-card">
            <div class="video-header">
              <h4 class="video-title">{{ v.titulo }}</h4>
              <span class="operation-badge">Op {{ v.operation }}</span>
            </div>
            <div class="video-meta">
              <span class="date">{{ formatDate(v.data_postagem) }}</span>
              <span class="video-id">ID: {{ v.id_video }}</span>
            </div>
            <div class="video-description">
              {{ truncateText(v.descricao, 150) }}
            </div>
            <div class="video-actions">
              <button class="btn-secondary" (click)="copyVideoId(v.id_video)">Copiar ID</button>
              <a [href]="'https://youtube.com/watch?v=' + v.id_video" target="_blank" class="btn-primary">
                Ver no YouTube
              </a>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="page-btn" (click)="goToPage(1)" [disabled]="page === 1">
            Primeira
          </button>
          <button class="page-btn" (click)="prev()" [disabled]="page === 1">
            Anterior
          </button>
          
          <div class="page-numbers">
            <span *ngFor="let p of visiblePages" class="page-number" 
                  [class.active]="p === page" 
                  (click)="goToPage(p)">
              {{ p }}
            </span>
          </div>
          
          <button class="page-btn" (click)="next()" [disabled]="page === totalPages">
            Próxima
          </button>
          <button class="page-btn" (click)="goToPage(totalPages)" [disabled]="page === totalPages">
            Última
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-collection {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .page-header h1 {
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
    }

    .page-description {
      color: #6b7280;
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      text-align: center;
      border: 1px solid #e5e7eb;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .filters-section h3 {
      margin: 0 0 1rem 0;
      color: #374151;
    }

    .filter-controls {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    .search-input, .operation-filter {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-input:focus, .operation-filter:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    }

    .results-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .per-page-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .per-page-selector select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
    }

    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .video-card {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem;
      background: #fafafa;
      transition: all 0.2s;
    }

    .video-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    .video-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .video-title {
      font-size: 1.1rem;
      color: #1f2937;
      margin: 0;
      flex: 1;
      margin-right: 1rem;
      line-height: 1.4;
    }

    .operation-badge {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .video-description {
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .video-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .page-btn {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      background: #f3f4f6;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }

    .page-number {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .page-number:hover {
      background: #f3f4f6;
    }

    .page-number.active {
      background: #3b82f6;
      color: white;
    }

    @media (max-width: 768px) {
      .events-collection {
        padding: 1rem;
      }

      .filter-controls {
        grid-template-columns: 1fr;
      }

      .video-grid {
        grid-template-columns: 1fr;
      }

      .results-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .video-actions {
        flex-direction: column;
      }
    }
  `]
})
export class EventsCollectionComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  page = 1;
  per = 20;
  searchTerm = '';
  selectedOperation = '';
  topOperations: any[] = [];

  constructor(private events: EventsService) {}

  async ngOnInit(): Promise<void> {
    this.items = await this.events.getAllVideos();
    this.calculateStats();
    this.applyFilters();
  }

  private calculateStats(): void {
    // Calculate top operations
    const opCounts: Record<string, number> = {};
    for (const v of this.items) {
      const op = v.operation ?? 'unknown';
      opCounts[op] = (opCounts[op] || 0) + 1;
    }
    
    this.topOperations = Object.entries(opCounts)
      .map(([operation, count]) => ({ operation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.titulo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesOperation = !this.selectedOperation || 
        item.operation?.toString() === this.selectedOperation;
      
      return matchesSearch && matchesOperation;
    });
    
    this.page = 1; // Reset to first page when filtering
  }

  updatePagination(): void {
    this.page = 1;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Data não disponível';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return 'Descrição não disponível';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  copyVideoId(videoId: string): void {
    navigator.clipboard.writeText(videoId).then(() => {
      // You could add a toast notification here
      console.log('ID copiado:', videoId);
    }).catch(err => {
      console.error('Erro ao copiar ID:', err);
    });
  }

  goToPage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
    }
  }

  // Getters
  get total() { return this.items.length; }
  get filteredTotal() { return this.filteredItems.length; }
  get totalPages() { return Math.max(1, Math.ceil(this.filteredTotal / this.per)); }
  get pageItems() { 
    return this.filteredItems.slice((this.page-1)*this.per, this.page*this.per); 
  }

  get uniqueOperations(): number {
    return new Set(this.items.map(v => v.operation)).size;
  }

  get dateRange(): string {
    if (this.items.length === 0) return 'N/A';
    const dates = this.items
      .map(v => v.data_postagem)
      .filter(Boolean)
      .sort();
    
    if (dates.length === 0) return 'N/A';
    
    const first = new Date(dates[0]).getFullYear();
    const last = new Date(dates[dates.length - 1]).getFullYear();
    
    return first === last ? first.toString() : `${first}-${last}`;
  }

  get avgVideosPerOp(): string {
    const avg = this.uniqueOperations > 0 ? this.total / this.uniqueOperations : 0;
    return avg.toFixed(1);
  }

  get visiblePages(): number[] {
    const current = this.page;
    const total = this.totalPages;
    const delta = 2;
    
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    
    // Adjust if we're near the beginning or end
    if (end - start < 2 * delta) {
      if (start === 1) {
        end = Math.min(total, start + 2 * delta);
      } else if (end === total) {
        start = Math.max(1, end - 2 * delta);
      }
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  prev() { if (this.page > 1) this.page--; }
  next() { if (this.page < this.totalPages) this.page++; }
}
