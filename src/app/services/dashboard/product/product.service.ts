import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient, private header: Header) { }

  getProduct() {
    return this.http.get(environment.apiUrl + "/product/get_product_list", { headers: this.header.getToken() });
  }

  getProductById(id) {
    return this.http.post(environment.apiUrl + "/product/get_product_by_id", id, { headers: this.header.getToken() });
  }

  createStockProduct(data) {
    return this.http.post(environment.apiUrl + "/product/create_stock_product", data, { headers: this.header.getToken() });
  }

  createProduct(data) {
    return this.http.post(environment.apiUrl + "/product/create_product", data, { headers: this.header.getToken() });
  }

  createProductDocument(data) {
    return this.http.post(environment.apiUrl + "/product/create_product_document", data, { headers: this.header.getToken() });
  }

  createStockProductCategory(data) {
    return this.http.post(environment.apiUrl + "/product/create_stock_product_category", data, { headers: this.header.getToken() });
  }

  createProductCategory(data) {
    return this.http.post(environment.apiUrl + "/product/create_product_category", data, { headers: this.header.getToken() });
  }

  createProductRawMaterial(data) {
    return this.http.post(environment.apiUrl + "/product/create_product_raw_material", data, { headers: this.header.getToken() });
  }

  deleteProduct(product) {
    return this.http.put(environment.apiUrl + "/product/delete_product", product, { headers: this.header.getToken() });
  }
}