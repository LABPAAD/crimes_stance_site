import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments-sample-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments-sample-card.html',
  styleUrls: ['./comments-sample-card.css'],
  host: {
    'class': 'block'
  }
})
export class CommentsSampleCardComponent {
  // Input para receber a lista de comentários de amostra
  @Input() comments: any[] = [];

  // Função para converter o valor numérico do sentimento em um rótulo de texto
  getSentimentLabel(sentiment: number): string {
    switch (sentiment) {
      case -1: return 'Desaprovação';
      case 0: return 'Neutro';
      case 1: return 'Aprovação';
      default: return 'Indefinido';
    }
  }

  // Função para formatar a data
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }
}
