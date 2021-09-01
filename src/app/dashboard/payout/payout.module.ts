import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PayoutComponent } from './payout.component';
import { SalaryModule } from './salary/salary.module';
import { AdvanceSalaryModule } from './advance-salary/advance-salary.module';
import { SharedModule } from 'app/shared.module';


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
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class PayoutModule { }
