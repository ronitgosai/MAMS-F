import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from "app/services/user.service";
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(
    private userService: UserService,
    private titleService: Title
  ) {
    titleService.setTitle("Page-Not-Found | Modern Agrichem");
  }

  isLogIn: boolean;

  ngOnInit(): void {
    this.isLogIn = this.userService.isLoggedIn;
  }
}
