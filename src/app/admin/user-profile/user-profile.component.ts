import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userService: UserService,
    private titleService: Title
    ) {
      titleService.setTitle("User-Profile | Modern Agrichem");
    }

  user_details = [];

  ngOnInit(): void {
    let user = {
      "user_id": localStorage.getItem('user_id')
    }
    this.userService.getUser(user).subscribe((getUser: any) => {
      this.user_details = getUser.data
      console.log(this.user_details)
    })
  }
}
