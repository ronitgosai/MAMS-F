import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrePlanProductionComponent } from './pre-plan-production.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared.module';
import { CoreModule } from 'app/core/core.module';

const routes: Routes = [
  {
    path: '',
    component: PrePlanProductionComponent
  }
]

@NgModule({
  declarations: [
    PrePlanProductionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule.forChild(routes)
  ]
})
export class PrePlanProductionModule { }