import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeMailService {

  constructor(
    private httpClient: HttpClient, 
    private header: Header
  ) { }

  sendMail(formData: FormData){
    return this.httpClient.post(environment.apiUrl + '/node_mailer', formData, { headers: this.header.getToken() })
  }
}
