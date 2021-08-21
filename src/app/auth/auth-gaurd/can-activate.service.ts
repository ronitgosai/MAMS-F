import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CanActivateService implements CanActivate {
  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(): boolean {
    if (!localStorage.getItem('token')) {
      this.toastr.error('Please Login First!');
      this.router.navigateByUrl('auth/login');
      return false;
    }
    return true;
  }
}