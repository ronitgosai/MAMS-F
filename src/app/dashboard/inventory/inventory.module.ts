import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { InventoryComponent } from './inventory.component';
import { SharedModule } from 'app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  }
]

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }