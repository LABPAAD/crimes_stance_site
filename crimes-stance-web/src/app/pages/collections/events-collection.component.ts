import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-events-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-slate-900 mb-3">
              <i class="bi bi-collection-play text-blue-600 mr-3"></i>
              Coletas de Eventos
            </h1>
            <p class="text-lg text-slate-600 max-w-3xl mx-auto">
              Exploração detalhada do dataset de vídeos relacionados a crimes e operações policiais
            </p>
          </div>
        </div>
      </div>

      <div class="mx-auto py-8">
        <!-- Statistics Overview -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
            <i class="bi bi-graph-up text-blue-600 mr-2"></i>
            Estatísticas Gerais
          </h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-3xl font-bold text-blue-600 mb-1">{{ total.toLocaleString('pt-BR') }}</div>
                    <div class="text-slate-600 font-medium">Total de Vídeos</div>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="bi bi-camera-video text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-3xl font-bold text-purple-600 mb-1">{{ uniqueOperations }}</div>
                    <div class="text-slate-600 font-medium">Operações Únicas</div>
                  </div>
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i class="bi bi-shield-check text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-3xl font-bold text-emerald-600 mb-1">{{ dateRange }}</div>
                    <div class="text-slate-600 font-medium">Período Temporal</div>
                  </div>
                  <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <i class="bi bi-calendar-range text-emerald-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-3xl font-bold text-orange-600 mb-1">{{ avgVideosPerOp }}</div>
                    <div class="text-slate-600 font-medium">Média por Operação</div>
                  </div>
                  <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i class="bi bi-bar-chart text-orange-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="mb-8">
          <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div class="p-6 border-b border-slate-100">
              <h3 class="text-lg font-semibold text-slate-900 flex items-center">
                <i class="bi bi-funnel text-blue-600 mr-2"></i>
                Filtros e Busca
              </h3>
              <p class="text-sm text-slate-600 mt-1">Refine sua pesquisa utilizando os filtros abaixo</p>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="lg:col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-2">Buscar por título ou descrição</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="bi bi-search text-slate-400"></i>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Digite sua busca..." 
                      [(ngModel)]="searchTerm"
                      (input)="applyFilters()"
                      class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Filtrar por operação</label>
                  <select 
                    [(ngModel)]="selectedOperation" 
                    (change)="applyFilters()" 
                    class="block w-full py-3 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Todas as operações</option>
                    <option *ngFor="let op of topOperations" [value]="op.operation">
                      Operação {{ op.operation }} ({{ op.count }} vídeos)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-slate-900 flex items-center">
                  <i class="bi bi-list-ul text-blue-600 mr-2"></i>
                  Resultados da Pesquisa
                </h3>
                <p class="text-sm text-slate-600 mt-1">
                  Mostrando {{ filteredTotal.toLocaleString('pt-BR') }} de {{ total.toLocaleString('pt-BR') }} vídeos
                </p>
              </div>
              
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-slate-700">Itens por página:</label>
                <select 
                  [(ngModel)]="per" 
                  (change)="updatePagination()"
                  class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option [value]="10">10</option>
                  <option [value]="20">20</option>
                  <option [value]="50">50</option>
                  <option [value]="100">100</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Video Grid -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div *ngFor="let v of pageItems" class="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <h4 class="text-lg font-semibold text-slate-900 line-clamp-2 flex-1 mr-3">
                      {{ v.titulo }}
                    </h4>
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1.5 rounded-full whitespace-nowrap">
                      Op {{ v.operation }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-4 mb-4 text-sm text-slate-600">
                    <div class="flex items-center gap-1">
                      <i class="bi bi-calendar3 text-slate-400"></i>
                      <span>{{ formatDate(v.data_postagem) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="bi bi-hash text-slate-400"></i>
                      <span>{{ v.id_video.slice(0, 8) }}...</span>
                    </div>
                  </div>
                  
                  <p class="text-slate-600 text-sm line-clamp-3 mb-6">
                    {{ truncateText(v.descricao, 120) }}
                  </p>
                  
                  <div class="flex gap-3">
                    <a 
                      [href]="'https://youtube.com/watch?v=' + v.id_video" 
                      target="_blank"
                      class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <i class="bi bi-youtube text-sm"></i>
                      YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredTotal === 0" class="text-center py-12">
              <div class="text-slate-400 mb-4">
                <i class="bi bi-search text-6xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Nenhum resultado encontrado</h3>
              <p class="text-slate-600">Tente ajustar seus filtros ou termos de busca</p>
            </div>

            <!-- Pagination -->
            <div *ngIf="totalPages > 1" class="flex items-center justify-center mt-8 pt-6 border-t border-slate-200">
              <nav class="flex items-center gap-2">
                <button 
                  (click)="goToPage(1)" 
                  [disabled]="page === 1"
                  class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                
                <button 
                  (click)="prev()" 
                  [disabled]="page === 1"
                  class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
                
                <div class="flex items-center gap-1">
                  <span *ngFor="let p of visiblePages" 
                        class="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                        [class]="p === page ? 'bg-blue-600 text-white' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'"
                        (click)="goToPage(p)">
                    {{ p }}
                  </span>
                </div>
                
                <button 
                  (click)="next()" 
                  [disabled]="page === totalPages"
                  class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
                
                <button 
                  (click)="goToPage(totalPages)" 
                  [disabled]="page === totalPages"
                  class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
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
