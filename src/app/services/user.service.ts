import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Header } from "app/header";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private header: Header) { }

  isLoggedIn = (localStorage.getItem('token')) ? true : false;

  get_user_list() {
    return this.http.get(environment.apiUrl + '/login/get_user_list')
  }

  getUser(userId) {
    return this.http.post(environment.apiUrl + '/login/get_list_user', userId)
  }

  getSession(userId) {
    return this.http.post(environment.apiUrl + '/login/get_session', userId)
  }

  loginUser(loginData) {
    return this.http.post(environment.apiUrl + '/login/get_user', loginData)
  }

  loggedIn() {
    return ((localStorage.getItem('token')) ? true : false);
  }

  createUserLogLoggedIn(loggedIn) {
    return this.http.post(environment.apiUrl + '/login/create_user_log_logged_in', loggedIn)
  }

  createUserLogLoggedOut(loggedOut) {
    return this.http.post(environment.apiUrl + '/login/create_user_log_logged_out', loggedOut)
  }
}