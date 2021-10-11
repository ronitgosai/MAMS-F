import { Component, OnInit } from '@angular/core';
import { UserService } from "app/services/user.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  isLogIn: boolean;

  ngOnInit(): void {
    this.isLogIn = this.userService.loggedIn()
  } 
}