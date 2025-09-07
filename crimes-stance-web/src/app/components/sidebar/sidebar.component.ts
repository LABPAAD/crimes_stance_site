import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <aside
      class="flex flex-col h-full bg-slate-900 text-slate-100 transition-all duration-300 flex-shrink-0 shadow-lg"
      [ngClass]="{
        'w-64': !isCollapsed,
        'w-16': isCollapsed
      }"
    >
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <div class="flex items-center gap-2 font-semibold text-lg">
          <img src="assets/img/logo-paad.png" alt="Crimes Stance" [ngClass]="isCollapsed ? 'w-6 h-6' : 'w-8 h-8'" class="bg-white/5 flex-shrink-0" />
          <span class="ml-1" *ngIf="!isCollapsed">Crimes Stance</span>
        </div>
      </div>

      <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul class="space-y-1">
          <li class="relative group" *ngFor="let item of navItems">
            <!-- Item sem submenu -->
            <ng-container *ngIf="!item.hasSubmenu">
              <a
                [routerLink]="item.link"
                routerLinkActive="active-link"
                class="flex items-center gap-3 px-4 py-3 text-slate-100 no-underline transition-all border-l-4 border-transparent hover:bg-white/5 hover:text-slate-200 hover:border-blue-400"
              >
                <i class="bi" [ngClass]="item.icon + ' text-blue-400 text-lg'"></i>
                <span *ngIf="!isCollapsed">{{ item.text }}</span>
                <span
                  *ngIf="isCollapsed"
                  class="absolute left-full top-1/2 -translate-y-1/2 bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all ml-2 shadow-lg z-50"
                >
                  {{ item.tooltip }}
                </span>
              </a>
            </ng-container>

            <!-- Item com submenu -->
            <ng-container *ngIf="item.hasSubmenu">
              <button
                (click)="toggleSubmenu(item.id)"
                class="w-full flex items-center gap-3 px-4 py-3 text-slate-100 transition-all border-l-4 border-transparent hover:bg-white/5 hover:text-slate-200 hover:border-blue-400 bg-transparent border-none cursor-pointer"
              >
                <i class="bi" [ngClass]="item.icon + ' text-blue-400 text-lg'"></i>
                <span *ngIf="!isCollapsed" class="flex-1 text-left">{{ item.text }}</span>
                <i 
                  *ngIf="!isCollapsed" 
                  class="bi transition-transform duration-200"
                  [ngClass]="isSubmenuExpanded(item.id) ? 'bi-chevron-down' : 'bi-chevron-right'"
                ></i>
                <span
                  *ngIf="isCollapsed"
                  class="absolute left-full top-1/2 -translate-y-1/2 bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all ml-2 shadow-lg z-50"
                >
                  {{ item.tooltip }}
                </span>
              </button>

              <!-- Submenus -->
              <ul 
                *ngIf="!isCollapsed && isSubmenuExpanded(item.id)" 
                class="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-4"
              >
                <li *ngFor="let subItem of item.subItems">
                  <a
                    [routerLink]="subItem.link"
                    routerLinkActive="active-link"
                    class="flex items-center gap-3 px-4 py-2 text-slate-300 no-underline transition-all hover:bg-white/5 hover:text-slate-100 rounded-md"
                  >
                    <i class="bi" [ngClass]="subItem.icon + ' text-blue-300 text-sm'"></i>
                    <span>{{ subItem.text }}</span>
                  </a>
                </li>
              </ul>
            </ng-container>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-white/10 text-center">
        <div *ngIf="!isCollapsed" class="text-slate-400">
          <small>v1.0.0</small>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .active-link {
      background-color: rgb(96 165 250 / 0.15) !important;
      color: #93c5fd !important;
      border-left-color: #60a5fa !important;
    }
  `]
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() closeSidebar = new EventEmitter<void>();
  
  expandedMenus: Set<string> = new Set();
  
  navItems = [
    {
      id: 'dashboard',
      link: '/dashboard',
      icon: 'bi-house',
      text: 'Visão Geral',
      tooltip: 'Dashboard principal',
    },
    {
      id: 'coletas',
      icon: 'bi-database',
      text: 'Coletas',
      tooltip: 'Dados coletados',
      hasSubmenu: true,
      subItems: [
        {
          link: '/coletas/eventos',
          icon: 'bi-calendar-event',
          text: 'Eventos',
          tooltip: 'Datasets de eventos',
        },
        {
          link: '/coletas/posicionamento',
          icon: 'bi-chat-quote',
          text: 'Posicionamento',
          tooltip: 'Datasets de opinião',
        }
      ]
    },
    {
      id: 'analises',
      icon: 'bi-graph-up',
      text: 'Análises',
      tooltip: 'Análises estatísticas',
      hasSubmenu: true,
      subItems: [
        {
          link: '/analises/eventos',
          icon: 'bi-bar-chart',
          text: 'Eventos',
          tooltip: 'Análise de eventos',
        },
        {
          link: '/analises/posicionamento',
          icon: 'bi-chat-dots',
          text: 'Posicionamento',
          tooltip: 'Análise de opinião',
        }
      ]
    }
  ];

  constructor() {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      this.isCollapsed = saved === 'true';
    } catch (e) { }
  }

  toggleSubmenu(menuId: string) {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isSubmenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  toggleSidebar() {}

}
