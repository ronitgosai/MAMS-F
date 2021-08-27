import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Header } from "app/header";
import { environment } from "environments/environment";
@Injectable({
  providedIn: "root",
})
export class InventoryService {
  constructor(private http: HttpClient, private header: Header) { }

  getInventory() {
    return this.http.get(environment.apiUrl + "/inventory/get_inventory_list", { headers: this.header.getToken() });
  }

  createInventory(data) {
    return this.http.post(environment.apiUrl + "/inventory/create_inventory", data, { headers: this.header.getToken() });
  }

  updateInventory(updateInventory) {
    return this.http.put(environment.apiUrl + "/inventory/update_inventory", updateInventory, { headers: this.header.getToken() });
  }

  updateInventoryQuantityAdd(inventoryAdd) {
    return this.http.put(environment.apiUrl + "/inventory/update_inventory_quantity_add", inventoryAdd, { headers: this.header.getToken() });
  }

  updateInventoryQuantitySub(inventorySub) {
    return this.http.put(environment.apiUrl + "/inventory/update_inventory_quantity_substract", inventorySub, { headers: this.header.getToken() });
  }

  updateDeleteInventory(updateInventoryInfo) {
    return this.http.put(environment.apiUrl + "/inventory/delete_inventory", updateInventoryInfo, { headers: this.header.getToken() });
  }

  getImportInvetory() {
    return this.http.get(environment.apiUrl + "/import_inventory/get_import_inventory_list", { headers: this.header.getToken() });
  }

  updateImportInventory(id) {
    return this.http.put(environment.apiUrl + "/import_inventory/update_import_inventory", id, { headers: this.header.getToken() });
  }

  createImportInventory(import_inventory) {
    return this.http.post(environment.apiUrl + "/import_inventory/create_import_inventory", import_inventory, { headers: this.header.getToken() });
  }

  deleteImportInventory(tblImportInventoryId) {
    return this.http.put(environment.apiUrl + "/import_inventory/delete_import_inventory", tblImportInventoryId, { headers: this.header.getToken() });
  }
}