import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from './directives/directives.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectiveModule
  ],
  exports: [
    DirectiveModule
  ]
})
export class CoreModule { }
