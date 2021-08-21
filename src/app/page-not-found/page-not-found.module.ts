import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { FooterModule } from 'app/components/footer/footer.module';

const routes: Routes = [
  {
    path: '',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  declarations: [
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    FooterModule
  ],
  exports: [
    PageNotFoundComponent
  ]
})
export class PageNotFoundModule { }
