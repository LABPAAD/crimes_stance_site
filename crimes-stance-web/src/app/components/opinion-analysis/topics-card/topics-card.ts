import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topics-card.html',
  styleUrls: ['./topics-card.css']
})
export class TopicsCardComponent {
  // Input para receber as contagens dos tópicos
  @Input() topicCounts: {
    security: number;
    violence: number;
    police: number;
    management: number;
  } = { security: 0, violence: 0, police: 0, management: 0 };

  // Função auxiliar para formatar os números
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
