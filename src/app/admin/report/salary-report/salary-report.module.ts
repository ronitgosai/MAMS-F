import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryReportComponent } from './salary-report.component';



@NgModule({
  declarations: [
    SalaryReportComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SalaryReportComponent
  ]
})
export class SalaryReportModule { }
