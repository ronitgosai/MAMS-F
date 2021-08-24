import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { SharedModule } from 'app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent
  }
]

@NgModule({
  declarations: [
    StaffComponent,
    SharedModule
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class StaffModule { }
