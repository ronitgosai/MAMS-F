import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { RawMaterialReportComponent } from './raw-material-report.component';
import { ImportMaterialReportModule } from './import-material-report/import-material-report.module';
import { MaterialReportModule } from './material-report/material-report.module';

@NgModule({
  declarations: [
    RawMaterialReportComponent,
  ],
  imports: [
    CommonModule,
    MaterialReportModule,
    ImportMaterialReportModule,
    SharedModule,
  ],
  exports: [
    RawMaterialReportComponent
  ],
  providers: [DatePipe]
})
export class RawMaterialReportModule { }