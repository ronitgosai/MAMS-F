import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotAccessComponent } from './page-not-access.component';
import { FooterModule } from 'app/components/footer/footer.module';

const routes: Routes = [
  {
    path: '',
    component: PageNotAccessComponent,
  },
];

@NgModule({
  declarations: [
    PageNotAccessComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    PageNotAccessComponent
  ]
})
export class PageNotAccessModule { }