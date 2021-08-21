import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PayoutComponent } from './payout.component';
import { SalaryModule } from './salary/salary.module';
import { AdvanceSalaryModule } from './advance-salary/advance-salary.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path:"",
    component:PayoutComponent
  }
]

@NgModule({
  declarations: [
    PayoutComponent
  ],
  imports: [
    AdvanceSalaryModule,
    SalaryModule,
    CommonModule,
    MatTabsModule,
    MatIconModule,
    RouterModule.forChild(routes),
  ]
})
export class PayoutModule { }
