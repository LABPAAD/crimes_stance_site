import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-positioning-distribution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './positioning-distribution.html',
  styleUrls: ['./positioning-distribution.css']
})
export class PositioningDistributionComponent {
  // Input para receber as contagens (ex: { '-1': 500, '0': 1200, '1': 8000 })
  @Input() counts: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };

  // Input para receber os percentuais (ex: { negative: 6, neutral: 14, positive: 80 })
  @Input() percentages: { negative: number; neutral: number; positive: number } = {
    negative: 0,
    neutral: 0,
    positive: 0,
  };

  // Função auxiliar para formatar números grandes (ex: 1200 -> 1.2K)
  // A movemos para cá para que o componente seja autossuficiente
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
