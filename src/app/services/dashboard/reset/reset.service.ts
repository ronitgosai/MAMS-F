import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Header } from "app/header";
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  constructor(private http: HttpClient, private header: Header) { }

  getResetPassword(id) {
    return this.http.post(environment.api_url + '/reset/get_reset_password', id, { headers: this.header.getToken() })
  }

  resetPassword(reset) {
    return this.http.put(environment.api_url + '/reset/reset_password', reset, { headers: this.header.getToken() })
  }
}