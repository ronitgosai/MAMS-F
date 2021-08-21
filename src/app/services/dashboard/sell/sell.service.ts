import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Header } from "app/header";

@Injectable({
  providedIn: "root",
})
export class SellService {
  constructor(private http: HttpClient,private header: Header) {}

  getSell() {
    return this.http.get(environment.api_url + "/sell/get_sell_list", { headers: this.header.getToken() });
  }

  getCategoryWiseProduct(category_id) {
    return this.http.post(environment.api_url + "/sell/get_category_wise_product",category_id, { headers: this.header.getToken() });
  }

  getProductWiseInventory() {
    return this.http.get(environment.api_url + "/sell/get_product_wise_inventory", { headers: this.header.getToken() });
  }

  getInventoryName(inventory_id) {
    return this.http.post(environment.api_url + "/sell/get_inventory_name",inventory_id, { headers: this.header.getToken() });
  }

  createSell(data) {
    return this.http.post(environment.api_url + "/sell/create_sell", data, { headers: this.header.getToken() });
  }

  productQuantitySubstratct(product_quantity) {
    return this.http.post(environment.api_url + "/sell/product_quantity_substratct",product_quantity, { headers: this.header.getToken() });
  }

  updateSellItem(updateSellInfo) {
    return this.http.put(environment.api_url + "/sell/update_sell",updateSellInfo, { headers: this.header.getToken()});
  }

  deleteSellItem(deleteSellItemId) {
    return this.http.put(environment.api_url + "/sell/delete_sell",deleteSellItemId, { headers: this.header.getToken() });
  }
}
