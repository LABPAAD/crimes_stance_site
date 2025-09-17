import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-model-accuracy-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-accuracy-card.html',
  styleUrls: ['./model-accuracy-card.css'],
  host: {
    'class': 'block' // Já vamos adicionar para evitar problemas de layout
  }
})
export class ModelAccuracyCardComponent {
  // Inputs para receber os valores das métricas
  @Input() precision: number = 0;
  @Input() recall: number = 0;
  @Input() f1Score: number = 0;
}
