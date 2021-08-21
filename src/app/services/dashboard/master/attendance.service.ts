import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Header } from 'app/header';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient, private header: Header) { }

  getAttendance(id) {
    return this.http.post(environment.api_url + "/attendance/get_attendace_list", id, { headers: this.header.getToken() }
    );
  }

  getAttendanceCount(date) {
    return this.http.post(environment.api_url + "/attendance/get_attendace_count_list", date, { headers: this.header.getToken() }
    );
  }

  createAttendance(data) {
    return this.http.post(environment.api_url + "/attendance/create_attendace", data, { headers: this.header.getToken() }
    );
  }

  deleteAttendace(data) {
    return this.http.put(environment.api_url + "/attendance/delete_attendace", data, { headers: this.header.getToken() }
    );
  }
}
