import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellComponent } from './sell.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared.module';
const routes: Routes = [
  {
    path: '',
    component: SellComponent
  }
]
@NgModule({
  declarations: [
    SellComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SellModule { }