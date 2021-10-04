import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: "root",
})

export class RawMaterialService {
  constructor(private http: HttpClient, private header: Header) { }

  // subProductListUrl() {
  //   return this.http.get(environment.subProductListUrl, { headers: this.header.getToken() });
  // }
  // attributeGroupUrl() {
  //   return this.http.get(environment.attributeGroupUrl, { headers: this.header.getToken() });
  // }
  // conversionTypeUrl() {
  //   return this.http.get(environment.conversionTypeUrl, { headers: this.header.getToken() });
  // }
  // productTypeUrl() {
  //   return this.http.get(environment.productTypeUrl, { headers: this.header.getToken() });
  // }
  // processListUrl() {
  //   return this.http.get(environment.processListUrl, { headers: this.header.getToken() });
  // }

  getRawMaterial() {
    return this.http.get(environment.apiUrl + "/raw_material/get_raw_material_list", { headers: this.header.getToken() });
  }

  createRawMaterial(insertRawMaterial) {
    return this.http.post(environment.apiUrl + "/raw_material/create_raw_material", insertRawMaterial, { headers: this.header.getToken() });
  }

  updateRawMaterial(updateRawMaterialInfo) {
    return this.http.put(environment.apiUrl + "/raw_material/update_raw_material", updateRawMaterialInfo, { headers: this.header.getToken() });
  }

  updateRawMaterialQuantityAdd(updateRawMaterialQuantity) {
    return this.http.put(environment.apiUrl + "/raw_material/update_raw_material_quantity", updateRawMaterialQuantity, { headers: this.header.getToken() });
  }

  updateRawMaterialQuantitySubstract(importRawMaterialData) {
    return this.http.put(environment.apiUrl + "/raw_material/update_raw_material_quantity_substract", importRawMaterialData, { headers: this.header.getToken() });
  }

  deleteUpdateRawMaterial(rawMaterialID) {
    return this.http.put(environment.apiUrl + "/raw_material/delete_raw_material", rawMaterialID, { headers: this.header.getToken() });
  }

  getImportRawMaterial() {
    return this.http.get(environment.apiUrl + "/import_raw_material/get_import_raw_material_list", { headers: this.header.getToken() });
  }

  updateImportRawMaterial(id) {
    return this.http.put(environment.apiUrl + "/import_raw_material/update_import_raw_material", id, { headers: this.header.getToken() });
  }

  createImportRawMaterial(importRawMaterial) {
    return this.http.post(environment.apiUrl + "/import_raw_material/create_import_raw_material", importRawMaterial, { headers: this.header.getToken() });
  }

  deleteImportRawMaterial(tblImportRawMaterialId) {
    return this.http.put(environment.apiUrl + "/import_raw_material/delete_import_raw_material", tblImportRawMaterialId, { headers: this.header.getToken() });
  }
}