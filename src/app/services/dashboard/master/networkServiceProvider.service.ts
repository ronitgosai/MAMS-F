import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class NetWorkServiceProviderService {
  constructor(private http: HttpClient, private header: Header) { }

  getMasterNetworkServiceProvider() {
    return this.http.get(environment.apiUrl + "/master/get_master_network_service_provider_list", { headers: this.header.getToken() });
  }

  createMasterNetworkServiceProvider(data) {
    return this.http.post(environment.apiUrl + "/master/create_master_network_service_provider", data, { headers: this.header.getToken() });
  }

  updateMasterNetworkServiceProvider(data) {
    return this.http.put(environment.apiUrl + "/master/update_master_network_service_provider", data, { headers: this.header.getToken() });
  }

  deleteMasterNetworkServiceProvider(product) {
    return this.http.put(environment.apiUrl + "/master/delete_master_network_service_provider", product, { headers: this.header.getToken() });
  }
}
