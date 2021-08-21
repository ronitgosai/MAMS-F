import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductReportComponent } from './product-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    ProductReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ProductReportComponent
  ]
})
export class ProductReportModule { }
