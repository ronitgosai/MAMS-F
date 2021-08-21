import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import  {MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent
  }
]

@NgModule({
  declarations: [
    StaffComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,  
    Ng2SearchPipeModule,
    NgxPaginationModule,
    OrderModule,
    NgMatSearchBarModule,
    RouterModule.forChild(routes)
  ]
})
export class StaffModule { }
