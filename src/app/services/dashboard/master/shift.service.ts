import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ShiftService {

  constructor(private http: HttpClient, private header: Header) { }

  getMasterShift() {
    return this.http.get(environment.api_url + "/master/get_master_shift_list", { headers: this.header.getToken() }
    );
  }

  createMasterShift(data) {
    return this.http.post(environment.api_url + "/master/create_master_shift", data, { headers: this.header.getToken() }
    );
  }

  updateMasterShift(data) {
    return this.http.put(environment.api_url + "/master/update_master_shift", data, { headers: this.header.getToken() }
    );
  }

  deleteMasterShift(data) {
    return this.http.put(environment.api_url + "/master/delete_master_shift", data, { headers: this.header.getToken() }
    );
  }
}
