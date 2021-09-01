import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private header: Header) { }

  pdf(id) {
    return this.http.post(environment.apiUrl + "/generate_pdf", id, { headers: this.header.getToken(), responseType:'blob' });
  }
  
  getRawMaterial(raw_material) {
    return this.http.post(environment.apiUrl + "/report/get_raw_material_list", raw_material);
  }

  getImportRawMaterial(raw_material) {
    return this.http.post(environment.apiUrl + "/report/get_import_raw_material_list", raw_material);
  }

  getImportRawMaterialDate(date) {
    return this.http.post(environment.apiUrl + "/report/get_import_raw_material_date", date);
  }

  getInventory(inventory) {
    return this.http.post(environment.apiUrl + "/report/get_inventory_list", inventory);
  }

  getImportInventory(inventory) {
    return this.http.post(environment.apiUrl + "/report/get_import_inventory_list", inventory);
  }

  getImportInventoryDate(date) {
    return this.http.post(environment.apiUrl + "/report/get_import_inventory_date_list", date);
  }

  getCategoryWiseProduct(category){
    return this.http.post(environment.apiUrl + "/report/get_category_wise_product_list", category);
  }

  getCategoryWiceProduction(category) {
    return this.http.post(environment.apiUrl + "/report/get_category_wise_production_list", category);
  }

  getStockProduct(product){
    return this.http.post(environment.apiUrl + "/report/get_stock_product_list", product);
  }

  getSellProduct(sell_product){
    return this.http.post(environment.apiUrl + "/report/get_sell_product_list", sell_product);
  }

  getSellCustomer(sell_customer){
    return this.http.post(environment.apiUrl + "/report/get_sell_customer_list", sell_customer);
  }

  getSellCategory(sell_category){
    return this.http.post(environment.apiUrl + "/report/get_sell_category_list", sell_category);
  }

  getSellDate(sell_date){
    return this.http.post(environment.apiUrl + "/report/get_sell_date_list", sell_date);
  }

  getSellCustomerProductList(sell_customer_product){
    return this.http.post(environment.apiUrl + "/report/get_sell_customer_product_list", sell_customer_product);
  }

  getSellCustomerCategoryList(sell_customer_category){
    return this.http.post(environment.apiUrl + "/report/get_sell_customer_category_list", sell_customer_category);
  }

  getSellCustomerDateRangeList(sell_customer_date_range){
    return this.http.post(environment.apiUrl + "/report/get_sell_customer_date_range_list", sell_customer_date_range);
  }

  getSellProductCategoryList(sell_product_category){
    return this.http.post(environment.apiUrl + "/report/get_sell_product_category_list", sell_product_category);
  }

  getSellProductDateRangeList(sell_product_date_range){
    return this.http.post(environment.apiUrl + "/report/get_sell_product_date_range_list", sell_product_date_range);
  }

  getSellCategoryDateRangeList(sell_category_date_range){
    return this.http.post(environment.apiUrl + "/report/get_sell_category_date_range_list", sell_category_date_range);
  }

  getSellCustomerProductCategoryList(sell_customer_product_category){
    return this.http.post(environment.apiUrl + "/report/get_sell_customer_product_category_list", sell_customer_product_category);
  }

  getSellCustomerProductCategoryDateRangeList(sell_customer_product_category_date_range){
    return this.http.post(environment.apiUrl + "/report/get_sell_customer_product_category_date_range_list", sell_customer_product_category_date_range);
  }

  getSellProductCategoryDateRangeList(sell_product_category_date_range){
    return this.http.post(environment.apiUrl + "/report/get_sell_product_category_date_range_list", sell_product_category_date_range);
  }

  getUser(id){
    return this.http.post(environment.apiUrl + "/report/get_user_list", id);
  }

  getStaff(id){
    return this.http.post(environment.apiUrl + "/report/get_staff_list", id);
  }

  get_attendance_list(id){
    return this.http.post(environment.apiUrl + "/report/get_attendance_list", id);
  }
}