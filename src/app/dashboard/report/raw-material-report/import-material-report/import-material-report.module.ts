import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportMaterialReportComponent } from './import-material-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    ImportMaterialReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ImportMaterialReportComponent
  ]
})
export class ImportMaterialReportModule { }
