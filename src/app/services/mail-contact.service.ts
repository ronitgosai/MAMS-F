import { Injectable } from '@angular/core';
import { NodeMailService } from './node-mail.service';

@Injectable({
  providedIn: 'root'
})
export class MailContactService {

  constructor(
    private nodeMailService: NodeMailService 
  ) { }

  createFormData(object){
    const formData = new FormData()
    formData.append('email', object.email)
    // formData.append('Password', object.password)
    console.log(formData.get('email'))

    return this.nodeMailService.sendMail(formData);
  }
}
