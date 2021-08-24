import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffReportComponent } from './staff-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    StaffReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    StaffReportComponent
  ]
})
export class StaffReportModule { }
