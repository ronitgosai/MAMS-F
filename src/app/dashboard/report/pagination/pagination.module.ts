import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { PaginationComponent } from './pagination.component';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PaginationComponent,
  },
];

@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PaginationComponent
  ]
})
export class PaginationModule { }