import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionReportComponent } from './production-report.component';
import { SharedModule } from 'app/shared.module';
import { OngoingProductionReportModule } from './ongoing-production-report/ongoing-production-report.module';
import { PastProductionReportModule } from './past-production-report/past-production-report.module';


@NgModule({
  declarations: [
    ProductionReportComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    OngoingProductionReportModule,
    PastProductionReportModule
  ],
  exports: [
    ProductionReportComponent
  ]
})
export class ProductionReportModule { }
