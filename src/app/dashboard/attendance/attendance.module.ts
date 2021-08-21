import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { NgxPaginationModule } from 'ngx-pagination';
// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent
  }
]


@NgModule({
  declarations: [
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatFileUploadModule,
    NgMatSearchBarModule,
    NgxMatSelectSearchModule,
    NgxPaginationModule,
    MatProgressBarModule,
    // NgxMatTimepickerModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ]
})
export class AttendanceModule { }
