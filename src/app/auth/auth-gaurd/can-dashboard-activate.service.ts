import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CanDashboardActivateService {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private activated: ActivatedRoute,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userId = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (userId) {
      if (
        userRole === environment.adminRole ||
        ([environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sellRole, environment.customerRole, environment.staffRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/dashboard') ||
        ([environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sellRole, environment.customerRole, environment.staffRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/user-profile') ||
        ([environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sellRole, environment.customerRole, environment.staffRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/reset-password') ||
        ([environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sellRole, environment.customerRole, environment.staffRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/master') ||
        ([environment.adminRole, environment.rawMaterialRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/raw-material') ||
        ([environment.adminRole, environment.inventoryRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/inventory') ||
        ([environment.adminRole, environment.productionRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/production') ||
        ([environment.adminRole, environment.productRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/product') ||
        ([environment.adminRole, environment.stockRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/stock') ||
        ([environment.adminRole, environment.sellRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/sell') ||
        ([environment.adminRole, environment.customerRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/customer') ||
        ([environment.adminRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/user') ||
        ([environment.adminRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/attendance') ||
        ([environment.adminRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/payout') ||
        ([environment.adminRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/report') ||
        ([environment.adminRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/staff') ||
        ([environment.adminRole].some(ur => userRole.split(',').indexOf(ur) > -1) && state.url === '/pre-plan-production')
      ) {
        return true;
      }
      this.router.navigateByUrl('/page-not-access');
      return false;
    }
    else {
      this.toastr.error('Please Login First!');
      this.router.navigateByUrl('auth/login');
      return false;
    }
  }
}