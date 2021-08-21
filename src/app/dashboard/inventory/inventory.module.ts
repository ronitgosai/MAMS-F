import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InventoryComponent } from './inventory.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  }
]

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    // PageNotAccessModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    Ng2SearchPipeModule,
    OrderModule,
    NgxPaginationModule,
    MatIconModule,
    MatProgressBarModule,
    NgMatSearchBarModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }