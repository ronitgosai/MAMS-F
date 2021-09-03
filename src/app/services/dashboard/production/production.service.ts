import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: "root",
})
export class ProductionService {
  constructor(private http: HttpClient, private header: Header) { }

  getProduction() {
    return this.http.get(environment.apiUrl + "/production/get_production_list", { headers: this.header.getToken() });
  }

  getProductionRawMaterial() {
    return this.http.get(environment.apiUrl + "/production/get_production_raw_material", { headers: this.header.getToken() });
  }

  getProductionTable() {
    return this.http.get(environment.apiUrl + "/production/get_production_table", { headers: this.header.getToken() });
  }

  getProductionInventoryTable() {
    return this.http.get(environment.apiUrl + "/production/get_production_inventory_table", { headers: this.header.getToken() });
  }

  getCategoryWiceProduct(categtory_id) {
    return this.http.post(environment.apiUrl + "/production/get_category_wise_product", categtory_id, { headers: this.header.getToken() });
  }

  getProductWiseRawMaterial(raw_material_ids) {
    return this.http.post(environment.apiUrl + "/production/get_product_wise_raw_material", raw_material_ids, { headers: this.header.getToken() });
  }

  getStockIdWise(ids) {
    return this.http.post(environment.apiUrl + "/production/get_stock_id_wise", ids, { headers: this.header.getToken() });
  }

  startProduction(production) {
    return this.http.post(environment.apiUrl + "/production/create_production", production);
  }

  insertProductProduction(product_info) {
    return this.http.post(environment.apiUrl + "/production/insert_product_production", product_info, { headers: this.header.getToken() });
  }

  insertRawMaterialProduction(raw_material_info) {
    console.log("services-->",raw_material_info)
    return this.http.post(environment.apiUrl + "/production/insert_raw_material_production", raw_material_info, { headers: this.header.getToken() });
  }

  createProductStock(product_stock) {
    return this.http.post(environment.apiUrl + "/production/create_product_stock", product_stock, { headers: this.header.getToken() });
  }

  addProductStock(product_stock) {
    return this.http.put(environment.apiUrl + "/production/add_product_stock", product_stock, { headers: this.header.getToken() });
  }

  updateProductionRawMaterialsQuantity(raw_material_quantity) {
    return this.http.post(environment.apiUrl + "/production/update_production_raw_materials_quantity", raw_material_quantity, { headers: this.header.getToken() });
  }

  updateProductionInventoryQuantity(raw_material_quantity) {
    return this.http.put(environment.apiUrl + "/production/update_production_inventory_quantity", raw_material_quantity, { headers: this.header.getToken() });
  }

  stopProduction(production_info) {
    return this.http.put(environment.apiUrl + "/production/stop_production", production_info, { headers: this.header.getToken() });
  }

  deleteProductionRawMaterial(production_raw_material_id) {
    return this.http.put(environment.apiUrl + "/production/delete_production_raw_material", production_raw_material_id, { headers: this.header.getToken() });
  }

  deleteStopProduction(production_id) {
    return this.http.put(environment.apiUrl + "/production/delete_stop_production", production_id, { headers: this.header.getToken() });
  }

  deleteProduciton(production_id) {
    return this.http.put(environment.apiUrl + "/production/delete_production", production_id, { headers: this.header.getToken() });
  }

  deletePastProduciton(production_id) {
    return this.http.put(environment.apiUrl + "/production/delete_past_production", production_id, { headers: this.header.getToken() });
  }
}