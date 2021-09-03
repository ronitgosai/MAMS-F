import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";

@Injectable({
  providedIn: 'root'
})
export class PrePalnProductionService {
  constructor(private http: HttpClient, private header: Header) { }

  getPrPlanProductionList() {
    return this.http.get(environment.apiUrl + "/pre_plan_production/get_pre_plan_production_list", { headers: this.header.getToken() });
  }

  createPrePlanProduction(data) {
    return this.http.post(environment.apiUrl + "/pre_plan_production/create_pre_plan_production", data, { headers: this.header.getToken() });
  }

  updatePrePlanProduction(data){
    console.log("updatePrePlanProduction",data)
    return this.http.put(environment.apiUrl + "/pre_plan_production/update_pre_plan_production", data, { headers: this.header.getToken() });
  }
}