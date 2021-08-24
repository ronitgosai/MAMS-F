import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialReportComponent } from './material-report.component';
import { SharedModule } from 'app/shared.module';


@NgModule({
  declarations: [
    MaterialReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MaterialReportComponent
  ]
})
export class MaterialReportModule { }