import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvanceSalaryService {

  constructor(private http: HttpClient, private header: Header) { }

  getAdvanceSalary() {
    return this.http.get(environment.api_url + "/advance_salary/get_advance_salary_list", { headers: this.header.getToken() });
  }

  createAdvanceSalary(data) {
    return this.http.post(environment.api_url + "/advance_salary/x", data, { headers: this.header.getToken() });
  }

  updateAdvanceSalary(data) {
    return this.http.put(environment.api_url + "/advance_salary/update_advance_salary", data, { headers: this.header.getToken() });
  }

  deleteAdvanceSalary(data) {
    return this.http.post(environment.api_url + "/advance_salary/delete_advance_salary", data, { headers: this.header.getToken() });
  }
}
