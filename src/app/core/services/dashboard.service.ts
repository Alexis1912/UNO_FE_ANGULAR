import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<any> {
    if (environment.useMocks) {
      // Simula las estadísticas del backend
      const mockStats = {
        totalStudents: 1247,
        newStudents: 28,
        averageAge: 22.5,
        activeStudents: 1183,
      };
      return of(mockStats).pipe(delay(300));
    }
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
