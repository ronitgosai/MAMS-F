import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkAreaService {

  constructor(private http: HttpClient, private header: Header) { }

  getMasterWorkArea() {
    return this.http.get(environment.apiUrl + "/master/get_master_work_area_list", { headers: this.header.getToken() }
    );
  }

  createMasterWorkArea(data) {
    return this.http.post(environment.apiUrl + "/master/create_master_work_area", data, { headers: this.header.getToken() }
    );
  }

  updateMasterWorkArea(data) {
    return this.http.put(environment.apiUrl + "/master/update_master_work_area", data, { headers: this.header.getToken() }
    );
  }

  deleteMasterWorkArea(product) {
    return this.http.put(environment.apiUrl + "/master/delete_master_work_area", product, { headers: this.header.getToken() }
    );
  }
}
