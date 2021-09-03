import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'app/services/dashboard/customer/customer.service';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { GlobalService } from 'app/services/global.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss']
})
export class CustomerReportComponent implements OnInit {

  constructor(
    private global: GlobalService,
    private customerService: CustomerService,
    private reportService: ReportService,
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
      console.log(this.customerDetails);
      this.customerTable = true;
    })
    this.customerTable = false;
  }

  customerPdf() {
    const data = {
      customerTitle: 'Customer',
      image: 'https://mams.modernagrichem.com/assets/img/logo.png',
      customerHeader: ['#', 'Customer Name', 'Customer Contact', 'Customer Address'],
      customerContent: this.customerDetails
    }
    this.reportService.pdf(data).subscribe((pdfmake) => {
      saveAs(pdfmake, "modernagrichem")
    })
  }

}