import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  tableIndex(data) {
    for (let i = 0; i < data.length; i++) {
      data[i]['index'] = i + 1
    }
    return data;
  }

  tableComma(data) {
    // for (let i = 0; i < data[i].length; i++) {
    data = new Intl.NumberFormat('en-IN').format(data)
    // }
    return data;
  }

  tableNumber(data) {
    Number(data.split(',').join(''))
    return data;
  }

  getDateZone() {
    let currentTime = new Date();
    let currentOffset = currentTime.getTimezoneOffset();
    let ISTOffset = 330;   // IST offset UTC +5:30 
    let ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    // ISTTime now represents the time in IST coordinates
    // let hoursIST = ISTTime.getHours()
    // let minutesIST = ISTTime.getMinutes()
    // let secondesIST = ISTTime.getSeconds()

    return ISTTime.getFullYear() + "-" + ((ISTTime.getMonth() + 1) > 9 ? (ISTTime.getMonth() + 1) : "0" + (ISTTime.getMonth() + 1)) + "-" + ((ISTTime.getDate()) > 9 ? (ISTTime.getDate()) : "0" + (ISTTime.getDate()))
  }

  getTimeZone() {
    let currentTime = new Date();
    let currentOffset = currentTime.getTimezoneOffset();
    let ISTOffset = 330;   // IST offset UTC +5:30 
    let ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    // ISTTime now represents the time in IST coordinates
    let hoursIST = ISTTime.getHours()
    let minutesIST = ISTTime.getMinutes()
    let secondesIST = ISTTime.getSeconds()

    return hoursIST + ":" + minutesIST + ":" + secondesIST
  }

  getDay() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  role() {
    const admin = '397A244226452948404D635166546A576E5A7234753778214125442A462D4A61'
    const account = '733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46'
    const production = '58703273357638792F423F4428472B4B6250655368566D597133743677397A24'
    const sell = '66556A586E3272357538782F413F442A472D4B6150645367566B597033733676'
    const staff = '4D635166546A576E5A7234753778214125432A462D4A614E645267556B587032'
  }
}