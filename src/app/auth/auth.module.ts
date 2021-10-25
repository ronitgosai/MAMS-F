import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';
import { CanLoadLoginService } from './auth-gaurd/can-load-login.service';
import { CanDashboardActivateService } from './auth-gaurd/can-dashboard-activate.service';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((module) => module.LoginModule),
        canLoad: [CanLoadLoginService],
      }
    ]
  }
]

@NgModule({
  declarations: [
    AuthComponent  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
