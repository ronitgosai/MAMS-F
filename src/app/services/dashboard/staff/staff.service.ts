import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: "root",
})
export class StaffService {
  constructor(private http: HttpClient,private header: Header) {}

  getStaff() {
    return this.http.get(environment.api_url + "/login/get_user_list", {headers: this.header.getToken()});
  }

  createStaff(data) {
    return this.http.post(environment.api_url + "/login/create_user", data, {headers: this.header.getToken()});
  }

  updateStaff(updateUserInfo) {
    return this.http.put(environment.api_url + "/login/update_user",updateUserInfo,{ headers: this.header.getToken() });
  }

  updateStaffPassword(updateUserPassword) {
    return this.http.put(environment.api_url + "/login/update_user_password",updateUserPassword,{ headers: this.header.getToken() });
  }

  deleteStaff(deleteUser) {
    return this.http.put(environment.api_url + "/login/delete_user",deleteUser,{ headers: this.header.getToken() });
  }
}
