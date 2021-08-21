import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient, private header: Header) { }

  getCurrency() {
    return this.http.get(environment.api_url + "/master/get_master_currency_list", { headers: this.header.getToken() });
  }

  createCurrency(data) {
    return this.http.post(environment.api_url + "/master/create_master_currency", data, { headers: this.header.getToken() });
  }

  updateCurrency(data) {
    return this.http.put(environment.api_url + "/master/update_master_currency", data, { headers: this.header.getToken() });
  }

  deleteCurrency(data) {
    return this.http.put(environment.api_url + "/master/delete_master_currency", data, { headers: this.header.getToken() });
  }
}
