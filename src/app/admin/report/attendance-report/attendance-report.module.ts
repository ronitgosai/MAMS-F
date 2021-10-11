import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceReportComponent } from './attendance-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    AttendanceReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AttendanceReportComponent
  ]
})
export class AttendanceReportModule { }
