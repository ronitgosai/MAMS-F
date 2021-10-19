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
    return this.http.get(environment.apiUrl + "/staff/get_staff_list", { headers: this.header.getToken() });
  }

  getSelectedStaffDetails(id) {
    return this.http.post(environment.apiUrl + "/staff/get_selected_staff_list", id, { headers: this.header.getToken() });
  }

  createStaffWithOutFile(staffDetails) {
    return this.http.post(environment.apiUrl + "/staff/create_staff_with_out_file", staffDetails, { headers: this.header.getToken() });
  }

  createStaffWithFile(staffDetails) {
    return this.http.post(environment.apiUrl + "/staff/create_staff_with_file", staffDetails, { headers: this.header.getToken() });
  }

  updateStaffSalary(id){
    return this.http.post(environment.apiUrl + "/staff/update_staff_salary", id, { headers: this.header.getToken() });
  }

  updateStaffInfo(updateStaffDetails) {
    return this.http.put(environment.apiUrl + "/staff/update_staff_info", updateStaffDetails, { headers: this.header.getToken() });
  }

  updateStaffIdProof(updateStaffDetails) {
    return this.http.put(environment.apiUrl + "/staff/update_staff_idproof", updateStaffDetails, { headers: this.header.getToken() });
  }

  deleteStaff(staffId) {
    return this.http.put(environment.apiUrl + "/staff/delete_staff_info", staffId, { headers: this.header.getToken() });
  }
}
