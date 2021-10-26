import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GlobalService } from 'app/services/global.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private userService: UserService,
    private titleService: Title
  ) {
    titleService.setTitle("User-Profile | Modern Agrichem");
  }

  userProfileForm: FormGroup;
  user_details = [];

  ngOnInit(): void {
    this.userProfileForm = this.formBuilder.group({
      fullName: [''],
      userName: [''],
      email: [''],
      contact: [''],
      userRole: ['']
    })

    let user = {
      "user_id": localStorage.getItem('user_id')
    }
    this.userService.getUser(user).subscribe((getUser: any) => {
      this.user_details = getUser.data;
      this.userProfileForm.patchValue({
        fullName: this.user_details[0]['full_name'],
        userName: this.user_details[0]['username'],
        email: this.user_details[0]['user_email'],
        contact: this.user_details[0]['user_contact'],
        userRole: this.user_details[0]['role_name'],
      })
    })
  }
}
