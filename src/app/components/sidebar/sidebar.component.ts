import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "app/services/user.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

declare const $: any;
declare interface RouteInfo {
  path?: string;
  title?: string;
  icon?: string;
  role?: string[];
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "fas fa-home",
    role: [environment.adminRole,environment.accountRole,environment.productionRole,environment.sellRole,environment.staffRole],
  },
  {
    path: "/master",
    title: "Master",
    icon: "fas fa-stream",
    role: [environment.adminRole,environment.accountRole,environment.productionRole,environment.sellRole,environment.staffRole],
  },
  {
    path: "/raw-material",
    title: "Raw Material",
    icon: "fab fa-buromobelexperte",
    role: [environment.adminRole,environment.accountRole],
  },
  {
    path: "/inventory",
    title: "Inventory",
    icon: "fas fa-prescription-bottle",
    role: [environment.adminRole,environment.accountRole],
  },
  {
    path: "/pre-plan-production",
    title: "Pre Plan Production",
    icon: "fas fa-vials",
    role: [environment.adminRole,environment.productionRole],
  },
  {
    path: "/production",
    title: "Production",
    icon: "fas fa-vials",
    role: [environment.adminRole,environment.productionRole],
  },
  {
    path: "/product",
    title: "Products",
    icon: "fas fa-vial",
    role: [environment.adminRole,environment.productionRole],
  },
  {
    path: "/stock",
    title: "Stock",
    icon: "fas fa-warehouse",
    role: [environment.adminRole,environment.accountRole,environment.sellRole],
  },
  {
    path: "/sell",
    title: "Sell",
    icon: "fas fa-receipt",
    role: [environment.adminRole,environment.accountRole,environment.sellRole],
  },
  {
    path: "/customer",
    title: "Customers",
    icon: "fas fa-user-friends",
    role: [environment.adminRole,environment.accountRole],
  },
  {
    path: "/user",
    title: "User",
    icon: "fas fa-user",
    role: [environment.adminRole],
  },
  {
    path: "/staff",
    title: "Staff",
    icon: "fas fa-people-carry",
    role: [environment.adminRole],
  },
  {
    path: "/attendance",
    title: "Attendance",
    icon: "fas fa-id-badge",
    role: [environment.adminRole],
  },
  {
    path: "/payout",
    title: "Payout",
    icon: "fas fa-money-bill-alt",
    role: [environment.adminRole],
  },
  {
    path: "/report",
    title: "Report",
    icon: "fas fa-chart-line",
    role: [environment.adminRole],
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})

export class SidebarComponent implements OnInit {
  menuItems  = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  isLogIn: boolean;
  subMenu: boolean;
  id: any;
  session_id: any;
  userDetails = [];
  user_name: any;
  user_role: any;
  title: any;

  ngOnInit() {
    this.isLogIn = this.userService.isLoggedIn;
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.id = localStorage.getItem('user_id');
    this.user_role = localStorage.getItem('role')

    this.session_id = localStorage.getItem('session_id');

    let user = {
      "user_id": this.id
    }
    this.userService.getUser(user).subscribe((response: any) => {
      this.userDetails = response.data
    })
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  getTitle() {
  }

  logOut() {
    let user = {
      "user_id": localStorage.getItem('user_id'),
      'session_id': localStorage.getItem('session_id')
    }
    this.userService.createUserLogLoggedOut(user).subscribe((loggedOut) => {
    })
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('session_id');
    localStorage.removeItem('role');
    this.toastr.success("Logout");
    this.router.navigateByUrl("auth/login");
  }
}