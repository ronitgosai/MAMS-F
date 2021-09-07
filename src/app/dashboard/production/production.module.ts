import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionComponent } from '../production/production.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ProductionComponent
  }
]

@NgModule({
  declarations: [
    ProductionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ProductionModule { }
