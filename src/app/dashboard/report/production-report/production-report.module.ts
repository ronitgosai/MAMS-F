import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionReportComponent } from './production-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    ProductionReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ProductionReportComponent
  ]
})
export class ProductionReportModule { }
