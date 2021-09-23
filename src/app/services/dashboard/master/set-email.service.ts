import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetEmailService {

  constructor(private http: HttpClient, private header: Header) { }

  getEmail() {
    return this.http.get(environment.apiUrl + "/master/get_email", { headers: this.header.getToken() });
  }

  setEmail(data) {
    return this.http.post(environment.apiUrl + "/master/set_email", data, { headers: this.header.getToken() });
  }

  updateEmail(data) {
    return this.http.put(environment.apiUrl + "/master/update_email", data, { headers: this.header.getToken() });
  }

  deleteEmail(data) {
    return this.http.put(environment.apiUrl + "/master/delete_email", data, { headers: this.header.getToken() });
  }
}
