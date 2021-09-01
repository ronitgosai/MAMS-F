import { HttpClient } from '@angular/common/http';
import { environment } from "environments/environment";
import { Injectable } from '@angular/core';
import { Header } from 'app/header';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpClient, private header: Header) { }
  getMasterProductCategory() {
    return this.http.get(environment.apiUrl + "/master/get_master_product_category_list", { headers: this.header.getToken() });
  }

  createMasterProductCategory(id) {
    return this.http.post(environment.apiUrl + "/master/create_master_product_category", id, { headers: this.header.getToken() });
  }

  updateMasterProductCategory(id) {
    return this.http.put(environment.apiUrl + "/master/update_master_product_category", id, { headers: this.header.getToken() });
  }

  deleteMasterProductCategory(id) {
    return this.http.put(environment.apiUrl + "/master/delete_master_product_category", id, { headers: this.header.getToken() });
  }
}
