import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CanLoadLoginService implements CanLoad {
  constructor(
    private router: Router
  ) { }

  canLoad(): boolean {
    if (!localStorage.getItem('token')) {
      return true;
    }
    this.router.navigateByUrl('dashboard/raw-material');
    return false;
  }
}
