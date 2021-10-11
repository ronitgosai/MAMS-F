import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { SharedModule } from 'app/shared.module';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ColorPickerModule } from 'ngx-color-picker';
// import {ColorPickerModule} from 'angular2-color-picker';
@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    // ColorPickerModule,
    NgxMatColorPickerModule,
    ColorPickerModule
  ],
  exports: [
    CategoryComponent
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ]
})
export class CategoryModule { }
