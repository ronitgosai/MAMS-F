import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerReportComponent } from './customer-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    CustomerReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CustomerReportComponent
  ]
})
export class CustomerReportModule { }
