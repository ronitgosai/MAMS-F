import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared.module';
import { ReportComponent } from './report.component';
import { DatePipe } from '@angular/common';
import { AdvanceSalaryReportModule } from './advance-salary-report/advance-salary-report.module';
import { AttendanceReportModule } from './attendance-report/attendance-report.module';
import { CustomerReportModule } from './customer-report/customer-report.module';
import { InventoryReportModule } from './inventory-report/inventory-report.module';
import { ProductReportModule } from './product-report/product-report.module';
import { SalaryReportModule } from './salary-report/salary-report.module';
import { SellReportModule } from './sell-report/sell-report.module';
import { StaffReportModule } from './staff-report/staff-report.module';
import { StockReportModule } from './stock-report/stock-report.module';
import { UserReportModule } from './user-report/user-report.module';
import { ImportInventoryReportModule } from './inventory-report/import-inventory-report/import-inventory-report.module';
import { RawMaterialReportModule } from './raw-material-report/raw-material-report.module';
import { ProductionReportModule } from './production-report/production-report.module';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent
  }
]

@NgModule({
  declarations: [
    ReportComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdvanceSalaryReportModule,
    AttendanceReportModule,
    CustomerReportModule,
    InventoryReportModule,
    ImportInventoryReportModule,
    ProductReportModule,
    ProductionReportModule,
    RawMaterialReportModule,
    SalaryReportModule,
    SellReportModule,
    StaffReportModule,
    StockReportModule,
    UserReportModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [DatePipe]
})
export class ReportModule { }