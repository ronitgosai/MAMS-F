import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceReportComponent } from './attendance-report.component';



@NgModule({
  declarations: [
    AttendanceReportComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AttendanceReportComponent
  ]
})
export class AttendanceReportModule { }
