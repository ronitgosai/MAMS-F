import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { CurrencyModule } from './currency/currency.module';
import { CategoryModule } from './category/category.module';
import { NetworkServiceProviderModule } from './network-service-provider/network-service-provider.module';
import { ShiftModule } from './shift/shift.module';
import { WorkAreaModule } from './work-area/work-area.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
  }
];

@NgModule({
  declarations: [
    MasterComponent,
  ],
  imports: [
    CommonModule,
    CategoryModule,
    NetworkServiceProviderModule,
    WorkAreaModule,
    ShiftModule,
    CurrencyModule,
    MatTabsModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ]
})
export class MasterModule { }