import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: "root",
})

export class RawMaterialService {
  constructor(private http: HttpClient, private header: Header) { }

  getRawMaterial() {
    return this.http.get(environment.api_url + "/raw_material/get_raw_material_list", { headers: this.header.getToken() });
  }

  createRawMaterial(insertRawMaterial) {
    return this.http.post(environment.api_url + "/raw_material/create_raw_material", insertRawMaterial, { headers: this.header.getToken() });
  }

  updateRawMaterial(updateRawMaterialInfo) {
    return this.http.put(environment.api_url + "/raw_material/update_raw_material", updateRawMaterialInfo, { headers: this.header.getToken() });
  }

  updateRawMaterialQuantityAdd(updateRawMaterialQuantity) {
    return this.http.put(environment.api_url + "/raw_material/update_raw_material_quantity", updateRawMaterialQuantity, { headers: this.header.getToken() });
  }

  updateRawMaterialQuantitySubstract(importRawMaterialData) {
    return this.http.put(environment.api_url + "/raw_material/update_raw_material_quantity_substract", importRawMaterialData, { headers: this.header.getToken() });
  }

  deleteUpdateRawMaterial(rawMaterialID) {
    return this.http.put(environment.api_url + "/raw_material/delete_raw_material", rawMaterialID, { headers: this.header.getToken() });
  }

  getImportRawMaterial() {
    return this.http.get(environment.api_url + "/import_raw_material/get_import_raw_material_list", { headers: this.header.getToken() });
  }

  updateImportRawMaterial(id) {
    return this.http.put(environment.api_url + "/import_raw_material/update_import_raw_material", id, { headers: this.header.getToken() });
  }

  createImportRawMaterial(importRawMaterial) {
    return this.http.post(environment.api_url + "/import_raw_material/create_import_raw_material", importRawMaterial, { headers: this.header.getToken() });
  }

  deleteImportRawMaterial(tblImportRawMaterialId) {
    return this.http.put(environment.api_url + "/import_raw_material/delete_import_raw_material", tblImportRawMaterialId, { headers: this.header.getToken() });
  }
}