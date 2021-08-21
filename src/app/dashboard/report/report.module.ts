import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { AdvanceSalaryReportModule } from './advance-salary-report/advance-salary-report.module';
import { AttendanceReportModule } from './attendance-report/attendance-report.module';
import { CustomerReportModule } from './customer-report/customer-report.module';
import { InventoryReportModule } from './inventory-report/inventory-report.module';
import { ProductReportModule } from './product-report/product-report.module';
import { ProductionReportModule } from './production-report/production-report.module';
import { RawMaterialReportModule } from './raw-material-report/raw-material-report.module';
import { SalaryReportModule } from './salary-report/salary-report.module';
import { SellReportModule } from './sell-report/sell-report.module';
import { StaffReportModule } from './staff-report/staff-report.module';
import { StockReportModule } from './stock-report/stock-report.module';
import { UserReportModule } from './user-report/user-report.module';
import { PaginationComponent } from './pagination/pagination.component';
import { SharedModule } from 'app/shared.module';

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
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    AdvanceSalaryReportModule,
    AttendanceReportModule,
    CustomerReportModule,
    InventoryReportModule,
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