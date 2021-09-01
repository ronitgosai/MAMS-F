import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { SharedModule } from 'app/shared.module';

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
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AttendanceModule { }
