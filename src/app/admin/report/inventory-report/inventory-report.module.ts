import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryReportComponent } from './inventory-report.component';
import { SharedModule } from 'app/shared.module';
import { ImportInventoryReportModule } from './import-inventory-report/import-inventory-report.module';
import { InventoryModule } from './inventory/inventory.module';

@NgModule({
  declarations: [
    InventoryReportComponent,
  ],
  imports: [
    CommonModule,
    InventoryModule,
    ImportInventoryReportModule,
    SharedModule,
  ],
  exports: [
    InventoryReportComponent
  ]
})
export class InventoryReportModule { }