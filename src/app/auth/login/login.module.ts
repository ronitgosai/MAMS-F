import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { FooterModule } from 'app/components/footer/footer.module';
import { SharedModule } from 'app/shared.module';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
]

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FooterModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
