import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { CurrencyModule } from './currency/currency.module';
import { CategoryModule } from './category/category.module';
import { NetworkServiceProviderModule } from './network-service-provider/network-service-provider.module';
import { ShiftModule } from './shift/shift.module';
import { WorkAreaModule } from './work-area/work-area.module';
import { RawMaterialModule } from './raw-material/raw-material.module';
import { InventoryModule } from './inventory/inventory.module';
import { RoleComponent } from './role/role.component';
import { SharedModule } from 'app/shared.module';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module';
import { RoleModule } from './role/role.module';

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
    SharedModule,
    RawMaterialModule,
    InventoryModule,
    CategoryModule,
    ProductModule,
    NetworkServiceProviderModule,
    MailModule,
    WorkAreaModule,
    ShiftModule,
    CurrencyModule,
    RoleModule,
    RouterModule.forChild(routes)
  ]
})
export class MasterModule { }