import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/services/student.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { merge, startWith, switchMap, catchError, of, map, debounceTime, Subject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'student', 'email', 'course', 'status', 'actions'];
  data: any[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  selection = new SelectionModel<any>(true, []);
  nameFilter = new FormControl('');
  courseFilter = new FormControl('');
  statusFilter = new FormControl('');

  private reload$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    const filterChanges = merge(
      this.nameFilter.valueChanges.pipe(debounceTime(300)),
      this.courseFilter.valueChanges,
      this.statusFilter.valueChanges
    );

    filterChanges.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, filterChanges, this.reload$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const filters = {
            name: this.nameFilter.value,
            course: this.courseFilter.value,
            status: this.statusFilter.value,
          };
          return this.studentService.getStudents(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            filters
          ).pipe(catchError(() => of(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          if (data === null) return [];
          this.resultsLength = data.total;
          return data.data;
        })
      ).subscribe(data => (this.data = data));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.data);
  }

  clearFilters() {
    this.nameFilter.setValue('');
    this.courseFilter.setValue('');
    this.statusFilter.setValue('');
  }

  deleteStudent(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar a ${name}? Esta acción no se puede deshacer.`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe(() => {
          this.snackBar.open('Estudiante eliminado con éxito', 'Cerrar', { duration: 3000 });
          this.reload$.next(); // Forzar la recarga de datos
        });
      }
    });
  }
 
}
