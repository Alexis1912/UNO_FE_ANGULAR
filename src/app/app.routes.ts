import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentListComponent } from './pages/students/student-list/student-list.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      { path: 'students', component: StudentListComponent, title: 'Estudiantes' },
      { path: 'students/new', component: StudentFormComponent, title: 'Nuevo Estudiante' },
      { path: 'students/:id/edit', component: StudentFormComponent, title: 'Editar Estudiante' },
      // Rutas de ejemplo para el futuro
      { path: 'reports', component: StudentListComponent, title: 'Reportes' },
      { path: 'settings', component: StudentListComponent, title: 'Configuración' },
    ],
  },
  // Redirigir cualquier otra ruta al dashboard o al login
  { path: '**', redirectTo: '' }
];
