import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { SharedModule } from 'app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent
  }
]


@NgModule({
  declarations: [
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RegistrationModule { }
