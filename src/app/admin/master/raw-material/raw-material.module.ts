import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { RawMaterialComponent } from './raw-material.component';



@NgModule({
  declarations: [
    RawMaterialComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    RawMaterialComponent
  ]
})
export class RawMaterialModule { }