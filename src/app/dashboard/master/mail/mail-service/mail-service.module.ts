import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailServiceComponent } from './mail-service.component';
import { SharedModule } from 'app/shared.module';

@NgModule({
  declarations: [
    MailServiceComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MailServiceComponent
  ]
})
export class MailServiceModule { }
