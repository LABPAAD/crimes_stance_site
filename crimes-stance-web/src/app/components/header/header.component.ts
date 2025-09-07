import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="flex items-center h-16 bg-white border-b border-blue-300/20 w-full z-30">
      <div class="flex flex-1 items-center justify-between max-w-screen-2xl pl-6 pr-12">
        <div class="flex items-center gap-2 font-bold text-slate-900">
          <!-- Botão toggle sidebar desktop -->
          <button class="hidden md:inline-flex mr-2 bg-transparent border-none p-2 rounded-md cursor-pointer text-slate-900 hover:bg-blue-100 transition"
            (click)="toggleSidebar.emit()" title="Expandir/Reduzir sidebar">
            <i class="bi" [ngClass]="sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
          </button>
          <!-- Botão menu mobile -->
          <button class="md:hidden mr-2 bg-transparent border-none p-2 rounded-md cursor-pointer text-slate-900 hover:bg-blue-100 transition" (click)="menuClick.emit()" title="Menu">
            <i class="bi bi-list"></i>
          </button>
          <i class="bi bi-bar-chart text-blue-500 text-2xl"></i>
          <span class="text-base">Crimes Stance</span>
        </div>
      </div>
    </header>
  `,
  styles: [
    `:host { display: block; width: 100%; }`
  ]
})
export class HeaderComponent {
  @Input() sidebarCollapsed = false;
  @Output() menuClick = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();
}