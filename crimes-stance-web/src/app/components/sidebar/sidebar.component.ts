import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo">
          <i class="pi pi-chart-bar"></i>
          <span class="logo-text">Crimes Stance</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          <i class="pi" [class.pi-angle-left]="!isCollapsed" [class.pi-angle-right]="isCollapsed"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <i class="pi pi-home"></i>
              <span class="nav-text">Visão Geral</span>
              <span class="tooltip">Dashboard principal</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/coletas" routerLinkActive="active" class="nav-link">
              <i class="pi pi-database"></i>
              <span class="nav-text">Coletas de Eventos</span>
              <span class="tooltip">Dados coletados</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/sentimento" routerLinkActive="active" class="nav-link">
              <i class="pi pi-chart-pie"></i>
              <span class="nav-text">Análise de Sentimento</span>
              <span class="tooltip">Métricas e resultados</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <div class="version-info">
          <small>v1.0.0</small>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
      color: #e2e8f0;
      transition: width 0.3s ease;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
      height: 100vh;
      min-height: 100vh;
      z-index: 10;
      overflow-x: hidden;
    }
    .sidebar.collapsed {
      width: 70px;
      min-width: 70px;
    }
    
    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .logo i {
      font-size: 1.5rem;
      color: #60a5fa;
    }
    
    .collapsed .logo-text {
      display: none;
    }
    
    .toggle-btn {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .toggle-btn:hover {
      background: rgba(255,255,255,0.1);
      color: #e2e8f0;
    }
    
    .sidebar-nav {
      flex: 1 1 auto;
      padding: 1rem 0;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-item {
      position: relative;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }
    
    .nav-link:hover {
      background: rgba(255,255,255,0.05);
      color: #e2e8f0;
      border-left-color: #60a5fa;
    }
    
    .nav-link.active {
      background: rgba(96,165,250,0.15);
      color: #93c5fd;
      border-left-color: #60a5fa;
    }
    
    .nav-link i {
      font-size: 1.3rem;
      min-width: 1.3rem;
      color: #60a5fa;
      flex-shrink: 0;
    }
    
    .collapsed .nav-text {
      display: none;
    }
    .collapsed .nav-link i {
      margin-right: 0;
    }
    
    .tooltip {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: #1f2937;
      color: #e5e7eb;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      margin-left: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
    }
    
    .collapsed .nav-item:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }
    
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }
    
    .version-info {
      color: #64748b;
    }
    
    .collapsed .version-info {
      display: none;
    }
    
    @media (max-width: 900px) {
      .sidebar {
        position: absolute;
        z-index: 1000;
        height: 100vh !important;
        min-height: 100vh !important;
        left: 0;
        top: 0;
      }
      .sidebar:not(.collapsed) {
        width: 100vw;
        max-width: 280px;
      }
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;
  
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
