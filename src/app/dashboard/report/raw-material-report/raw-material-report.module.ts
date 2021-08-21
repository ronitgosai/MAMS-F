import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { RawMaterialReportComponent } from './raw-material-report.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationModule } from '../pagination/pagination.module';
import { MaterialReportComponent } from './material-report/material-report.component';

@NgModule({
  declarations: [
    RawMaterialReportComponent,
    MaterialReportComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PaginationModule
  ],
  exports: [
    RawMaterialReportComponent
  ],
  providers: [DatePipe]
})
export class RawMaterialReportModule { }