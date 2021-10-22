import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { SharedModule } from 'app/shared.module';
import { FooterModule } from 'app/components/footer/footer.module';


const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent
  }
]

@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FooterModule,
    RouterModule.forChild(routes)
  ]
})
export class ResetPasswordModule { }
