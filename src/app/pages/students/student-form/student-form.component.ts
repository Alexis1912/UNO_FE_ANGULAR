import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    birth_date: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    course: ['', Validators.required],
    status: ['Activo', Validators.required],
  });

  isEditMode = false;
  isLoading = false;
  studentId: number | null = null;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.studentId = this.route.snapshot.params['id'];
    if (this.studentId) {
      this.isEditMode = true;
      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: number): void {
    this.isLoading = true;
    this.studentService.getStudentById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (student) => {
          if (student) {
            this.studentForm.patchValue(student);
          } else {
            this.errorMessage = 'Estudiante no encontrado.';
          }
        },
        error: () => this.errorMessage = 'Error al cargar el estudiante.'
      });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const studentData = this.studentForm.value;
    const operation = this.isEditMode && this.studentId
      ? this.studentService.updateStudent(this.studentId, studentData)
      : this.studentService.createStudent(this.studentForm.value);

      operation
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.successMessage = this.isEditMode ? 'Estudiante actualizado exitosamente' : 'Estudiante creado exitosamente';
          setTimeout(() => this.router.navigate(['/students']), 2000);
        },
        error: () => this.errorMessage = 'Error al guardar el estudiante. Intenta nuevamente.'
      });
  }

  resetForm(): void {
    this.studentForm.reset({ status: 'Activo' });
    this.successMessage = '';
    this.errorMessage = '';
  }

  getFullName(): string {
    const firstName = this.studentForm.get('first_name')?.value || '';
    const lastName = this.studentForm.get('last_name')?.value || '';
    return `${firstName} ${lastName}`.trim();
  }

  getInitials(): string {
    const firstName = this.studentForm.get('first_name')?.value || '';
    const lastName = this.studentForm.get('last_name')?.value || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  private markFormGroupTouched(): void {
    Object.values(this.studentForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
