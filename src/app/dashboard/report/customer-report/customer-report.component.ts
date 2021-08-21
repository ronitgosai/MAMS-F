import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'app/services/dashboard/customer/customer.service';
import { GlobalService } from 'app/services/global.service';
@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss']
})
export class CustomerReportComponent implements OnInit {

  constructor(
    private global: GlobalService,
    private customerService: CustomerService,
  ) { }

  customerDetails = [];
  customerTable: boolean;
  currentTable: any;

  ngOnInit(): void {
    this.getCustomer();
  }

  getCustomer() {
    this.customerService.getCustomer().subscribe((getCustomer: any) => {
      this.customerDetails = this.global.tableIndex(getCustomer.data);
      this.customerTable = true;
    })
    this.customerTable = false;
  }

}
