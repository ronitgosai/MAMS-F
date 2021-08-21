import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class Header {

  constructor(public cookieService: CookieService) { }

  getToken(): HttpHeaders {
    return new HttpHeaders().set("Authorization", localStorage.getItem("token"));
  }
}
// export const header = new HttpHeaders().set("Authorization",localStorage.getItem("token"));
// src\app\header.ts