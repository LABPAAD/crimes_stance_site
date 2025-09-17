import { Component, Input, OnInit } from '@angular/core'; // Importe OnInit
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analysis-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-stat-card.html',
  styleUrls: ['./analysis-stat-card.css']
})
export class AnalysisStatCardComponent implements OnInit { // Implemente OnInit
  @Input() label: string = '';
  @Input() value: string = '...';
  @Input() icon: string = 'bi-question-circle';
  @Input() color: 'blue' | 'green' | 'red' | 'yellow' = 'blue';
  @Input() isLoading: boolean = true;

  constructor() { }

  // Este método é executado quando o componente é inicializado
  ngOnInit(): void { }
}
