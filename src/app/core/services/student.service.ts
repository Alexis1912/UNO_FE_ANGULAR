import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

// Datos de prueba
const MOCK_STUDENTS = [
  { id: 1, first_name: 'Carlos', last_name: 'Santana', birth_date: '1998-05-20', email: 'carlos.s@example.com', course: 'Ingeniería de Software', status: 'Activo', registration_date: '2024-01-15T10:00:00Z', phone: '+57 300 123 4567' },
  { id: 2, first_name: 'Ana', last_name: 'Torres', birth_date: '2000-08-15', email: 'ana.t@example.com', course: 'Diseño Gráfico', status: 'Activo', registration_date: '2024-02-20T11:30:00Z', phone: '+57 301 234 5678' },
  { id: 3, first_name: 'Pedro', last_name: 'Ramirez', birth_date: '1999-11-30', email: 'pedro.r@example.com', course: 'Ciencia de Datos', status: 'Inactivo', registration_date: '2024-01-10T09:00:00Z', phone: '+57 302 345 6789' },
  { id: 4, first_name: 'Laura', last_name: 'Gomez', birth_date: '2001-02-10', email: 'laura.g@example.com', course: 'Ingeniería de Software', status: 'Activo', registration_date: '2024-03-05T14:00:00Z', phone: '+57 303 456 7890' },
 ];
@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  getStudents(page: number, limit: number, filters: any): Observable<any> {
    if (environment.useMocks) {
      // Simula la paginación y filtros
      let students = MOCK_STUDENTS;
      if (filters.name) students = students.filter(s => `${s.first_name} ${s.last_name}`.toLowerCase().includes(filters.name.toLowerCase()));
      if (filters.course) students = students.filter(s => s.course === filters.course);
      if (filters.status) students = students.filter(s => s.status === filters.status);
      return of({ data: students, total: students.length }).pipe(delay(400));
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (filters.name) params = params.set('name', filters.name);
    if (filters.course) params = params.set('course', filters.course);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get(this.apiUrl, { params });
  }

  getStudentById(id: number): Observable<any> {
    if (environment.useMocks) {
      const student = MOCK_STUDENTS.find(s => s.id === id);
      return of(student).pipe(delay(300));
    }

    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createStudent(student: any): Observable<any> {
    if (environment.useMocks) {
      const newStudent = { ...student, id: Math.floor(Math.random() * 1000) };
      MOCK_STUDENTS.push(newStudent);
      return of(newStudent).pipe(delay(500));
    }
    return this.http.post(this.apiUrl, student);
  }

  updateStudent(id: number, student: any): Observable<any> {
    if (environment.useMocks) {
      const index = MOCK_STUDENTS.findIndex(s => s.id === id);
      if (index > -1) MOCK_STUDENTS[index] = { ...MOCK_STUDENTS[index], ...student };
      return of(MOCK_STUDENTS[index]).pipe(delay(500));
    }
    return this.http.put(`${this.apiUrl}/${id}`, student);
  }
  
  deleteStudent(id: number): Observable<any> {
    if (environment.useMocks) {
      const index = MOCK_STUDENTS.findIndex(s => s.id === id);
      if (index > -1) MOCK_STUDENTS.splice(index, 1);
      return of({ success: true }).pipe(delay(500));
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
