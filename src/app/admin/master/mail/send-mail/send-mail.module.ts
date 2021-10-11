import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendMailComponent } from './send-mail.component';
import { SharedModule } from 'app/shared.module';

@NgModule({
  declarations: [
    SendMailComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SendMailComponent
  ]
})
export class SendMailModule { }
