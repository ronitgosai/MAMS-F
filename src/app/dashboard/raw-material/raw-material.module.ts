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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RawMaterialComponent } from './raw-material.component';
import { DataTablesModule } from 'angular-datatables';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';
import { NgxPrintModule } from 'ngx-print';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  {
    path: "",
    component: RawMaterialComponent,
  },
];

@NgModule({
  declarations: [
    RawMaterialComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    // PageNotAccessModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressBarModule,
    Ng2SearchPipeModule,
    OrderModule,
    NgxPrintModule,
    MatIconModule,
    NgxPaginationModule,
    NgMatSearchBarModule,
    RouterModule.forChild(routes),
    DataTablesModule
  ],
})
export class RawMaterialModule { }
