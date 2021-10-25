import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import { RouterModule, Routes } from "@angular/router";
import { SidebarComponent } from "app/components/sidebar/sidebar.component";
import { NavbarComponent } from "app/components/navbar/navbar.component";
import { FooterModule } from "app/components/footer/footer.module";
import { CanDashboardActivateService } from "app/auth/auth-gaurd/can-dashboard-activate.service";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () => import("./Dashboard/Dashboard.module").then((module) => module.DashboardModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "reset-password",
        loadChildren: () => import("./reset-password/reset-password.module").then((module) => module.ResetPasswordModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "raw-material",
        loadChildren: () => import("./raw-material/raw-material.module").then((module) => module.RawMaterialModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "inventory",
        loadChildren: () => import("./inventory/inventory.module").then((module) => module.InventoryModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "pre-plan-production",
        loadChildren: () => import("./pre-plan-production/pre-plan-production.module").then((module) => module.PrePlanProductionModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "production",
        loadChildren: () => import("./production/production.module").then((module) => module.ProductionModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "product",
        loadChildren: () => import("./product/product.module").then((module) => module.ProductModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "product-details/:id",
        loadChildren: () => import("./master/product-details/product-details.module").then((module) => module.ProductDetailsModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "sell",
        loadChildren: () => import("./sell/sell.module").then((module) => module.SellModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "stock",
        loadChildren: () => import("./stock/stock.module").then((module) => module.StockModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "user",
        loadChildren: () => import("./staff/staff.module").then((module) => module.StaffModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "customer",
        loadChildren: () => import("./customer/customer.module").then((module) => module.CustomerModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "user-profile",
        loadChildren: () => import("./user-profile/user-profile.module").then((module) => module.UserProfileModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "staff",
        loadChildren: () => import("./registration/registration.module").then((module) => module.RegistrationModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "attendance",
        loadChildren: () => import("./attendance/attendance.module").then((module) => module.AttendanceModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "report",
        loadChildren: () => import("./report/report.module").then((module) => module.ReportModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "master",
        loadChildren: () => import("./master/master.module").then((module) => module.MasterModule),
        canActivate: [CanDashboardActivateService],
      },
      {
        path: "payout",
        loadChildren: () => import("./payout/payout.module").then((module) => module.PayoutModule),
        canActivate: [CanDashboardActivateService],
      },
    ]
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    FooterModule,
    RouterModule.forChild(routes)
  ],
})
export class DashboardModule { }