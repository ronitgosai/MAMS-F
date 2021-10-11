import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellReportComponent } from './sell-report.component';
import { SharedModule } from 'app/shared.module';

@NgModule({
  declarations: [
    SellReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SellReportComponent
  ]
})
export class SellReportModule { }