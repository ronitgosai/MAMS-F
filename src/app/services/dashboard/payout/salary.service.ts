import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private http: HttpClient, private header: Header) { }

  getSalaryList() {
    return this.http.get(environment.api_url + "/salary/get_salary_list", { headers: this.header.getToken() });
  }

  getSalaryDetails(id) {
    return this.http.post(environment.api_url + "/salary/get_salary_details", id, { headers: this.header.getToken() });
  }

  getSalarySum(id) {
    return this.http.post(environment.api_url + "/salary/get_salary_sum", id, { headers: this.header.getToken() });
  }

  getSalary(id) {
    return this.http.post(environment.api_url + "/salary/get_salary", id, { headers: this.header.getToken() });
  }

  createSalary(data) {
    return this.http.post(environment.api_url + "/salary/create_salary", data, { headers: this.header.getToken() });
  }

  createSalaryAdvanceSalary(data) {
    return this.http.post(environment.api_url + "/salary/create_salary_advancesalary", data, { headers: this.header.getToken() });
  }

  updateSalary(data) {
    return this.http.put(environment.api_url + "/salary/update_salary", data, { headers: this.header.getToken() });
  }

  deleteSalary(data) {
    return this.http.put(environment.api_url + "/salary/delete_salary", data, { headers: this.header.getToken() });
  }
}
