import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Header } from "app/header";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient, private header: Header) { }

  getStaffDetails() {
    return this.http.get(environment.api_url + "/staff/get_staff_list", { headers: this.header.getToken() });
  }

  getSelectedStaffDetails(id) {
    return this.http.post(environment.api_url + "/staff/get_selected_staff_list", id, { headers: this.header.getToken() });
  }

  createStaff(staffDetails) {
    return this.http.post(environment.api_url + "/staff/create_staff", staffDetails, { headers: this.header.getToken() });
  }

  updateStaffSalary(id){
    return this.http.post(environment.api_url + "/staff/update_staff_salary", id, { headers: this.header.getToken() });
  }

  updateStaffInfo(updateStaffDetails) {
    return this.http.put(environment.api_url + "/staff/update_staff_info", updateStaffDetails, { headers: this.header.getToken() });
  }

  deleteStaff(staffId) {
    return this.http.put(environment.api_url + "/staff/delete_staff_info", staffId, { headers: this.header.getToken() });
  }
}
