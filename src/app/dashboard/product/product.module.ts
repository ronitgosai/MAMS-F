import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ProductComponent } from "./product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { MatIconModule } from "@angular/material/icon";
import { NgMatSearchBarModule } from "ng-mat-search-bar";
import { CoreModule } from "app/core/core.module";
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes: Routes = [
  {
    path: "",
    component: ProductComponent,
  },
];

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    OrderModule,
    MatIconModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgMatSearchBarModule,
    RouterModule.forChild(routes),
  ],
})
export class ProductModule { }
