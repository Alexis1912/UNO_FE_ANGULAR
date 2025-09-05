import { Component, OnInit, inject, AfterViewInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable } from 'rxjs';
import localeEs from '@angular/common/locales/es';

// Registra el locale español para poder usar el pipe `date` en español.
registerLocaleData(localeEs);

// Importa Chart.js si lo vas a usar.
// import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }], // Provee el locale español al componente
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  stats$!: Observable<any>;
  currentDate = new Date();

  recentActivities = [
    {
      title: 'Nuevo estudiante registrado: Ana Gómez',
      time: 'Hace 5 minutos',
      icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
      color: '#0d6efd', // primary
    },
    {
      title: 'Reporte mensual generado',
      time: 'Hace 1 hora',
      icon: 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z',
      color: '#198754', // success
    },
    {
      title: 'Actualización de perfil: Carlos Santana',
      time: 'Hace 2 horas',
      icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
      color: '#ffc107', // warning
    },
  ];

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getStats();
  }
  ngAfterViewInit(): void {
    // La inicialización del gráfico iría aquí para asegurar que el <canvas> existe.
    // this.initializeChart();
  }

  initializeChart(): void {
    // Aquí iría la lógica para crear el gráfico con una librería como Chart.js
    // const ctx = document.getElementById('studentsChart');
    // new Chart(ctx, { ...config... });
    console.log('Chart inicializado (placeholder)');
  }
}
