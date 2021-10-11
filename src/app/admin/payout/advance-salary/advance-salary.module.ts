import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceSalaryComponent } from './advance-salary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPrintModule } from 'ngx-print';

const routes: Routes = [
  {
    path:'',
    component:AdvanceSalaryComponent
  }
]

@NgModule({
  declarations: [
    AdvanceSalaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
    Ng2SearchPipeModule,
    OrderModule,
    NgxPrintModule,
    MatIconModule,
    NgxPaginationModule,
    NgMatSearchBarModule,
  ],
  exports:[
    AdvanceSalaryComponent,
  ]
})
export class AdvanceSalaryModule { }
