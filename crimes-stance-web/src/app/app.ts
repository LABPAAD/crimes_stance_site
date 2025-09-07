import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('crimes-stance-web');
  sidebarOpen = false;
  sidebarCollapsed = false;

  onSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    try {
      localStorage.setItem('sidebar-collapsed', String(this.sidebarCollapsed));
    } catch (e) {}
  }
}
