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
        userRole === environment.adminRole||
        [environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sell, environment.customerRole, environment.staff].indexOf(userRole) > -1 && state.url === '/dashboard' ||
        [environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sell, environment.customerRole, environment.staff].indexOf(userRole) > -1 && state.url === '/user-profile' ||
        [environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sell, environment.customerRole, environment.staff].indexOf(userRole) > -1 && state.url === '/reset-password' ||
        [environment.adminRole, environment.rawMaterialRole, environment.inventoryRole, environment.productionRole, environment.productRole, environment.stockRole, environment.sell, environment.customerRole, environment.staff].indexOf(userRole) > -1 && state.url === '/master' ||
        [environment.adminRole, environment.rawMaterialRole].indexOf(userRole) > -1 && state.url === '/raw-material' ||
        [environment.adminRole, environment.inventoryRole].indexOf(userRole) > -1 && state.url === '/inventory' ||
        [environment.adminRole, environment.productionRole].indexOf(userRole) > -1 && state.url === '/production' ||
        [environment.adminRole, environment.productRole].indexOf(userRole) > -1 && state.url === '/product' ||
        [environment.adminRole, environment.stockRole].indexOf(userRole) > -1 && state.url === '/stock' ||
        [environment.adminRole, environment.sellRole].indexOf(userRole) > -1 && state.url === '/sell' ||
        [environment.adminRole, environment.customerRole].indexOf(userRole) > -1 && state.url === '/customer' ||
        [environment.adminRole] .indexOf(userRole) > -1 && state.url === '/user' ||
        [environment.adminRole] .indexOf(userRole) > -1 && state.url === '/report'
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