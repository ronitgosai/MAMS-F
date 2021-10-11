import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserReportComponent } from './user-report.component';
import { SharedModule } from 'app/shared.module';



@NgModule({
  declarations: [
    UserReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    UserReportComponent
  ]
})
export class UserReportModule { }
