import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private http: HttpClient, private header: Header) { }

  getMasterRole() {
    return this.http.get(environment.apiUrl + "/master/get_role", { headers: this.header.getToken() }
    );
  }

  createMasterRole(data) {
    return this.http.post(environment.apiUrl + "/master/create_role", data, { headers: this.header.getToken() }
    );
  }

  updateMasterRole(data) {
    return this.http.put(environment.apiUrl + "/master/update_role", data, { headers: this.header.getToken() }
    );
  }

  deleteMasterRole(data) {
    return this.http.put(environment.apiUrl + "/master/delete_role", data, { headers: this.header.getToken() }
    );
  }
}
