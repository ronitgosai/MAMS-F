import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";

@Injectable({
  providedIn: "root",
})

export class CustomerService {
  constructor(private http: HttpClient, private header: Header) { }

  getCustomer() {
    return this.http.get(environment.apiUrl + "/customer/get_customer_list", { headers: this.header.getToken() });
  }

  createCustomer(data) {
    return this.http.post(environment.apiUrl + "/customer/create_customer", data, { headers: this.header.getToken() });
  }

  updateCustomer(customerInfo) {
    return this.http.put(environment.apiUrl + "/customer/update_customer", customerInfo, { headers: this.header.getToken() });
  }

  deleteCustomer(customerId) {
    return this.http.put(environment.apiUrl + "/customer/delete_customer", customerId, { headers: this.header.getToken() });
  }
}