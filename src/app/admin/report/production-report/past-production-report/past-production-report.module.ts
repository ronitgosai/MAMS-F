import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastProductionReportComponent } from './past-production-report.component';
import { SharedModule } from 'app/shared.module';


@NgModule({
  declarations: [
    PastProductionReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PastProductionReportComponent
  ]
})
export class PastProductionReportModule { }