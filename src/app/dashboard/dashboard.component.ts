import { Component, OnInit } from '@angular/core';
import { UserService } from "app/services/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  isLogIn: boolean;

  ngOnInit(): void {
    this.isLogIn = this.userService.loggedIn()
  } 
}