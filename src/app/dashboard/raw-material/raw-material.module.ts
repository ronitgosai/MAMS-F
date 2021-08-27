import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RawMaterialComponent } from './raw-material.component';
import { SharedModule } from 'app/shared.module';

const routes: Routes = [
  {
    path: "",
    component: RawMaterialComponent,
  },
];

@NgModule({
  declarations: [
    RawMaterialComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class RawMaterialModule { }
