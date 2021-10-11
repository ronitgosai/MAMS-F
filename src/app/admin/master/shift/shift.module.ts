import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftComponent } from './shift.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMatSearchBarModule } from 'ng-mat-search-bar'
@NgModule({
  declarations: [
    ShiftComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgxPaginationModule,
    NgMatSearchBarModule,
  ],
  exports: [
    ShiftComponent
  ]
})
export class ShiftModule { }
