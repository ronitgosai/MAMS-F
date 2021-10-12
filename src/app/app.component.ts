import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import * as moment from 'moment';
import { Header } from './header';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  route: string;

  constructor(location: Location, private userService: UserService, router: Router, private header: Header) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.route = location.path();
      } else {
        this.route = 'Home'
      }
    });
  }

  isLogIn: boolean;

  ngOnInit(): void {
    this.isLogIn = this.userService.isLoggedIn;
    // /*right but not "IST"*/new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
}