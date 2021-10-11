import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateService } from './auth/auth-gaurd/can-activate.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./admin/admin.module').then(module => module.DashboardModule),
    canActivate: [CanActivateService]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
  },
  // page not access
  {
    path: 'page-not-access',
    loadChildren: () => import('./page-not-access/page-not-access.module').then((module) => module.PageNotAccessModule),
  },
  // page not found
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
  {
    path: '404',
    loadChildren: () => import('./page-not-found/page-not-found.module').then((module) => module.PageNotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'top'    
    }
    )],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }