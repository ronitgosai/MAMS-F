import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryReportComponent } from './inventory-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    InventoryReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    InventoryReportComponent
  ]
})
export class InventoryReportModule { }
