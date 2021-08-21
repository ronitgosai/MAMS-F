import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReportComponent } from './stock-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    StockReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    StockReportComponent
  ]
})
export class StockReportModule { }
