import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bootstrap-results-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bootstrap-results-card.html',
  styleUrls: ['./bootstrap-results-card.css'],
  host: {
    'class': 'block'
  }
})
export class BootstrapResultsCardComponent {
  // Input para receber os grupos de dados do bootstrap
  @Input() groups: any[] = [];
}
