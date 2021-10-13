import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ResetService } from 'app/services/dashboard/reset/reset.service';
import { GlobalService } from 'app/services/global.service';
import { UserService } from 'app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private router: Router,
    private userService: UserService,
    private resetService: ResetService,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titleService.setTitle("Reset Password | Modern Agrichem");
  }

  isSubmitted: boolean = false;
  resetForm: FormGroup;

  userDetails = [];
  id = [];

  current_password = true;
  new_password = true;
  confirm_password = true;

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      current_password: ["", [Validators.required, this.global.noWhitespaceValidator]],
      new_password: ["", [Validators.required, this.global.noWhitespaceValidator]],
      confirm_password: ["", [Validators.required, this.global.noWhitespaceValidator, this.matchValues('new_password')]],
    });

    this.userService.get_user_list().subscribe((get_user_list: any) => {
      this.userDetails = get_user_list.data
      console.log(this.userDetails);
    })
  }

  matchValues(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

  getResetPassword() {
    let user = {
      'user_id': localStorage.getItem('user_id'),
      'password': this.resetForm.get('current_password').value
    }
    this.resetService.getResetPassword(user).subscribe((getResetPasswordCheck: any) => {
      if (getResetPasswordCheck['success']) {
        let reset = {
          'user_id': localStorage.getItem('user_id'),
          'password': this.resetForm.get('new_password').value,
          'updated_date': this.global.getDateZone(),
          'updated_time': this.global.getTimeZone()
        }
        this.resetService.resetPassword(reset).subscribe((resetPassword: any) => {
          this.toastr.success("Password change successfully")
        })
      } else {
        this.toastr.error("Invalid Old Password");
      }
    },
      (error) => {
        this.toastr.error("Invalid Old Password");
      })
  }
}
