import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { SharedModule } from 'app/shared.module';

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    InventoryComponent
  ]
})
export class InventoryModule { }
