import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { UserService } from "app/services/user.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
    titleService.setTitle("Login | Modern Agrichem");
  }

  isSubmitted: boolean = false;
  loginForm: FormGroup;
  isProgressBar: boolean;
  hide = true;
  id: any;
  role: any;
  sessionId: any;
  roleId = [];

  ngOnInit(): void {
    this.isProgressBar = false;
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  login() {
    this.isSubmitted = true;
    this.isProgressBar = false;
    if (this.loginForm.valid) {
      this.isProgressBar = true;
      this.userService.loginUser(this.loginForm.value).subscribe(
        (userDetails: any) => {
          if (userDetails['success']) {
            userDetails.data.map((d) => {
              this.roleId.push(d.role_id)
            })
            localStorage.setItem('token', userDetails.token);
            localStorage.setItem('user_id', userDetails.data[0].user_id)
            localStorage.setItem('role', this.roleId.join(','))
            let user = {
              "user_id": userDetails.data[0].user_id
            }
            localStorage.getItem('role')
            this.userService.createUserLogLoggedIn(user).subscribe((createUserLogLogged: any) => {
              this.userService.getSession(user).subscribe((getSession: any) => {
                this.sessionId = getSession.data.find(d => d.session_id === d.session_id)
                localStorage.setItem('session_id', this.sessionId.session_id)
                this.toastr.success("Login Successfully! Welcome to MAMS");
                this.router.navigateByUrl('/dashboard');
              })
            })
          } else {
            this.isSubmitted = false;
            this.isProgressBar = false;
            this.toastr.error("Invalid Username or Password");
          }
        }
      );
    }
  }
}