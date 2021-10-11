import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  constructor(private http: HttpClient, private header: Header) { }

  getEmailAddress(){
    return this.http.get(environment.apiUrl + "/master/get_mail_address", { headers: this.header.getToken() });
  }

  getMail() {
    return this.http.get(environment.apiUrl + "/master/get_mail", { headers: this.header.getToken() });
  }

  sendMail(data) {
    return this.http.post(environment.apiUrl + "/master/send_mail", data, { headers: this.header.getToken() });
  }

  updateMail(data) {
    return this.http.put(environment.apiUrl + "/master/update_mail", data, { headers: this.header.getToken() });
  }

  deleteMail(data) {
    return this.http.put(environment.apiUrl + "/master/delete_mail", data, { headers: this.header.getToken() });
  }
}
