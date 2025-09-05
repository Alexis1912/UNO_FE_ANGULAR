import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  login(credentials: { email: string, password: string }): Observable<any> {
    if (environment.useMocks) {
      // Simula una respuesta exitosa del backend
      const mockUser = { name: 'Admin User', email: credentials.email };
      const mockResponse = { token: 'mock-jwt-token', user: mockUser };
      return of(mockResponse).pipe(
        delay(500),
        tap(res => {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
        })
      );
    }

    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}
