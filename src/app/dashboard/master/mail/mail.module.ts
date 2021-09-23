import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { MailComponent } from './mail.component';
import { SendMailModule } from './send-mail/send-mail.module';
import { MailServiceModule } from './mail-service/mail-service.module';


@NgModule({
  declarations: [
    MailComponent
  ],
  imports: [
    CommonModule,
    MailServiceModule,
    SendMailModule,
    SharedModule
  ],
  exports: [
    MailComponent
  ]
})
export class MailModule { }
