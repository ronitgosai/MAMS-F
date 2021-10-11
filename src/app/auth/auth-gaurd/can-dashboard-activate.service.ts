import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
        userRole === 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46', '58703273357638792F423F4428472B4B6250655368566D597133743677397A24', '66556A586E3272357538782F413F442A472D4B6150645367566B597033733676', '4D635166546A576E5A7234753778214125432A462D4A614E645267556B587032'].indexOf(userRole) > -1 && state.url === '/Dashboard' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46', '58703273357638792F423F4428472B4B6250655368566D597133743677397A24', '66556A586E3272357538782F413F442A472D4B6150645367566B597033733676', '4D635166546A576E5A7234753778214125432A462D4A614E645267556B587032'].indexOf(userRole) > -1 && state.url === '/user-profile' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46', '58703273357638792F423F4428472B4B6250655368566D597133743677397A24', '66556A586E3272357538782F413F442A472D4B6150645367566B597033733676', '4D635166546A576E5A7234753778214125432A462D4A614E645267556B587032'].indexOf(userRole) > -1 && state.url === '/reset-password' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46'].indexOf(userRole) > -1 && state.url === '/raw-material' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46'].indexOf(userRole) > -1 && state.url === '/inventory' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '58703273357638792F423F4428472B4B6250655368566D597133743677397A24'].indexOf(userRole) > -1 && state.url === '/production' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '58703273357638792F423F4428472B4B6250655368566D597133743677397A24'].indexOf(userRole) > -1 && state.url === '/product' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46', '66556A586E3272357538782F413F442A472D4B6150645367566B597033733676'].indexOf(userRole) > -1 && state.url === '/stock' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46', '66556A586E3272357538782F413F442A472D4B6150645367566B597033733676'].indexOf(userRole) > -1 && state.url === '/sell' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD', '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46'].indexOf(userRole) > -1 && state.url === '/customer' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD'].indexOf(userRole) > -1 && state.url === '/user' ||
        ['hyiplPDFbNmTAipsGakHYnVTZtZvgPsD'].indexOf(userRole) > -1 && state.url === '/report'
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