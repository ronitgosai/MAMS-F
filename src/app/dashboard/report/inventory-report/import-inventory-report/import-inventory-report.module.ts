import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { ImportInventoryReportComponent } from './import-inventory-report.component';


@NgModule({
  declarations: [
    ImportInventoryReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ImportInventoryReportComponent
  ]
})
export class ImportInventoryReportModule { }
