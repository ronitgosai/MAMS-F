import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Header } from "app/header";
@Injectable({
  providedIn: "root",
})
export class StockService {
  constructor(private http: HttpClient,private header: Header) {}

  getStock() {
    return this.http.get(environment.api_url + "/stock/get_stock_list", {headers: this.header.getToken()});
  }

  createStock(data) {
    return this.http.post(environment.api_url + "/stock/create_stock", data, {headers: this.header.getToken()});
  }
}
