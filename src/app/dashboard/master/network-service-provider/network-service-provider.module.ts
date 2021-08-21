import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkServiceProviderComponent } from './network-service-provider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectModule } from "@angular/material/select";
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

@NgModule({
  declarations: [
    NetworkServiceProviderComponent
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
    NetworkServiceProviderComponent
  ]
})

export class NetworkServiceProviderModule { }