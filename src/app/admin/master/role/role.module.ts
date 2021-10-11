import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { RoleComponent } from './role.component';


@NgModule({
  declarations: [
    RoleComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    RoleComponent
  ]
})
export class RoleModule { }
