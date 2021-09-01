import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/services/global.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { SellService } from 'app/services/dashboard/sell/sell.service';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { ReportService } from 'app/services/dashboard/report/report.service';
@Component({
  selector: 'app-sell-report',
  templateUrl: './sell-report.component.html',
  styleUrls: ['./sell-report.component.scss']
})
export class SellReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private sellService: SellService,
    private reportService: ReportService,
    private datepipe: DatePipe,
    private titleService: Title
  ) { }

  sellForm: FormGroup;

  current_table: any;

  sell_product = [];
  sell_customer = [];
  sell_category = [];
  sell = [];
  sell_details = [];
  customer_details = [];

  sell_customer_product = [];
  sell_customer_category = [];
  sell_customer_date_range = [];
  sell_product_category = [];
  sell_product_date_range = [];
  sell_category_date_range = [];
  sell_customer_product_category = [];
  sell_customer_product_category_date_range = [];
  sell_product_category_date_range = [];
  date_arr = [];

  sell_customer_product_table: boolean;
  sell_customer_category_table: boolean;
  sell_customer_date_range_table: boolean;
  sell_product_category_table: boolean;
  sell_product_date_range_table: boolean;
  sell_category_date_range_table: boolean;
  sell_customer_product_category_table: boolean;
  sell_customer_product_category_date_range_table: boolean;
  sell_product_category_date_range_table: boolean;

  sell_product_table: boolean;
  sell_category_table: boolean;
  sell_customer_table: boolean;
  sell_table: boolean;

  sell_product_id: any;
  sell_category_id: any;
  sell_customer_id: any;

  start_date: any;
  end_date: any;

  protected _onDestroy = new Subject<void>();
  public sell_product_name_FilterCtrl: FormControl = new FormControl();
  public filtered_sell_product_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public sell_customer_name_FilterCtrl: FormControl = new FormControl();
  public filtered_sell_customer_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public sell_category_name_FilterCtrl: FormControl = new FormControl();
  public filtered_sell_category_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.sell_product_table = false;
    this.sell_category_table = false;
    this.sell_customer_table = false;
    this.sell_table = false;
    this.sell_customer_product_table = false;
    this.sell_customer_category_table = false;
    this.sell_customer_date_range_table = false;
    this.sell_product_category_table = false;
    this.sell_product_date_range_table = false;
    this.sell_category_date_range_table = false;
    this.sell_customer_product_category_table = false;
    this.sell_customer_product_category_date_range_table = false;
    this.sell_product_category_date_range_table = false;

    this.sellForm = this.formBuilder.group({
      customer_id: [''],
      product_id: [''],
      category_id: [''],
      start_date: [''],
      end_date: ['']
    })
    this.getSell();
  }

  /* sell */
  getSell() {
    this.sellService.getSell().subscribe((getSell: any) => {
      this.sell_details = this.global.tableIndex(getSell.data);
      this.filtered_sell_product_name.next(getSell.data.slice());
      this.sell_product_name_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterSellBanks();
      });
      this.filtered_sell_category_name.next(getSell.data.slice());
      this.sell_category_name_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterSellBanks();
      });
      this.filtered_sell_customer_name.next(getSell.data.slice());
      this.sell_customer_name_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterSellBanks();
      });
    })
  }

  sellCustomerChange(event) {
    this.sell_customer_id = event.value
  }

  sellProductChange(event) {
    this.sellForm.patchValue({
      category_id: this.sell_details.find(d => d.product_id === event.value).category_id,
    })
    this.sell_product_id = event.value
  }

  sellCategoryChange(event) {
    this.sell_category_id = event.value
  }

  onStart(event, start) {
    this.start_date = start;
  }

  onEnd(event, end) {
    this.end_date = end;
  }

  getSellList() {
    if ((this.sell_customer_id === undefined && this.sell_product_id === undefined && this.sell_category_id === undefined && this.start_date === undefined && this.end_date === undefined) || (this.sell_customer_id === '' && this.sell_product_id === '' && this.sell_category_id === '' && this.start_date === '' && this.end_date === '')) {
      this.sellService.getSell().subscribe((getSell: any) => {
        this.sell = this.global.tableIndex(getSell.data);
        this.sell_table = true;
      })
      this.sell_table = false;
    }
    /* product_details*/
    else if (this.sell_product_id != '' && (this.sell_customer_id === undefined && this.sell_category_id === undefined && this.start_date === undefined && this.end_date === undefined)) {
      let product_id = {
        'product_id': this.sell_product_id,
      }
      this.reportService.getSellProduct(product_id).subscribe((getSellProduct: any) => {
        this.sell_product = this.global.tableIndex(getSellProduct.data)
        this.sell_product_table = true;
      })
      this.sell_product_table = false;
    }
    /* customer detais */
    else if (this.sell_customer_id != '' && (this.sell_product_id === undefined && this.sell_category_id === undefined && this.start_date === undefined && this.end_date === undefined)) {
      let customer_id = {
        'customer_id': this.sell_customer_id,
      }
      this.reportService.getSellCustomer(customer_id).subscribe((getSellCustomer: any) => {
        this.sell_customer = this.global.tableIndex(getSellCustomer.data);
        this.sell_customer_table = true;
      })
      this.sell_customer_table = false;
    }
    /* product_details */
    else if (this.sell_category_id != '' && (this.sell_customer_id === undefined && this.sell_product_id === undefined && this.start_date === undefined && this.end_date === undefined)) {
      let category_id = {
        'category_id': this.sell_category_id,
      }
      this.reportService.getSellCategory(category_id).subscribe((getSellCategory: any) => {
        this.sell_category = this.global.tableIndex(getSellCategory.data)
        this.sell_category_table = true;
      })
      this.sell_category_table = false;
    }
    /*start and end date*/
    else if (this.start_date != '' && this.end_date != '' && (this.sell_customer_id === undefined && this.sell_product_id === undefined && this.sell_category_id === undefined)) {
      let start_date = this.datepipe.transform(this.start_date, "YYYY-dd-MM")
      let end_date = this.datepipe.transform(this.end_date, "YYYY-dd-MM")
      let date = {
        'start_date': start_date,
        'end_date': end_date,
      }
      this.reportService.getSellDate(date).subscribe((getSellDate: any) => {
        this.date_arr = this.global.tableIndex(getSellDate.data)
      })
    }
    /* customer and product */
    else if (this.sell_customer_id != '' && this.sell_product_id != '' && (this.sell_category_id === undefined && this.start_date === undefined && this.end_date === undefined)) {
      let customer_product = {
        'customer_id': this.sell_customer_id,
        'product_id': this.sell_product_id,
      }
      this.reportService.getSellCustomerProductList(customer_product).subscribe((getSellCustomerProduct: any) => {
        this.sell_customer_product = this.global.tableIndex(getSellCustomerProduct.data)
        this.sell_customer_product_table = true;
      })
      this.sell_customer_product_table = false;
    }
    /* customer and category */
    else if (this.sell_customer_id != '' && this.sell_category_id != '' && (this.sell_product_id === undefined && this.start_date === undefined && this.end_date === undefined)) {
      let customer_category = {
        'customer_id': this.sell_customer_id,
        'category_id': this.sell_category_id,
      }
      this.reportService.getSellCustomerCategoryList(customer_category).subscribe((getSellCustomerCategory: any) => {
        this.sell_customer_category = this.global.tableIndex(getSellCustomerCategory.data)
        this.sell_customer_category_table = true;
      })
      this.sell_customer_category_table = false;
    }
    /* customer and date range */
    else if (this.sell_customer_id != '' && this.start_date != '' && this.end_date != '' && (this.sell_category_id === undefined && this.sell_product_id === undefined)) {
      let start_date = this.datepipe.transform(this.start_date, "YYYY-dd-MM")
      let end_date = this.datepipe.transform(this.end_date, "YYYY-dd-MM")
      let customer_date = {
        'customer_id': this.sell_customer_id,
        'start_date': start_date,
        'end_date': end_date,
      }
      this.reportService.getSellCustomerDateRangeList(customer_date).subscribe((getSellCustomerDateRange: any) => {
        this.sell_customer_date_range = this.global.tableIndex(getSellCustomerDateRange.data)
        this.sell_customer_date_range_table = true;
      })
      this.sell_customer_date_range_table = false;
    }
    /* product and category*/
    else if (this.sell_product_id != '' && this.sell_category_id != '' && (this.start_date === undefined && this.end_date === undefined && this.sell_customer_id === undefined)) {
      let product_category = {
        'product_id': this.sell_product_id,
        'category_id': this.sell_category_id,
      }
      this.reportService.getSellProductCategoryList(product_category).subscribe((getSellProductCategory: any) => {
        this.sell_product_category = this.global.tableIndex(getSellProductCategory.data)
        this.sell_product_category_table = true;
      })
      this.sell_product_category_table = false;
    }
    /* product and date range */
    else if (this.sell_product_id != '' && this.start_date != '' && this.end_date != '' && (this.sell_category_id === undefined && this.sell_customer_id === undefined)) {
      let start_date = this.datepipe.transform(this.start_date, "YYYY-dd-MM")
      let end_date = this.datepipe.transform(this.end_date, "YYYY-dd-MM")

      let product_date = {
        'product_id': this.sell_product_id,
        'start_date': start_date,
        'end_date': end_date
      }
      this.reportService.getSellProductDateRangeList(product_date).subscribe((getSellProductDateRange: any) => {
        this.sell_product_date_range = this.global.tableIndex(getSellProductDateRange.data)
        this.sell_product_date_range_table = true;
      })
      this.sell_product_date_range_table = false;
    }
    /* category and date range */
    else if (this.sell_category_id != '' && this.start_date != '' && this.end_date != '' && (this.sell_product_id === undefined && this.sell_customer_id === undefined)) {
      let start_date = this.datepipe.transform(this.start_date, "YYYY-dd-MM")
      let end_date = this.datepipe.transform(this.end_date, "YYYY-dd-MM")

      let category_date = {
        'category_id': this.sell_category_id,
        'start_date': start_date,
        'end_date': end_date
      }
      this.reportService.getSellCategoryDateRangeList(category_date).subscribe((getSellCategoryDateRange: any) => {
        this.sell_category_date_range = this.global.tableIndex(getSellCategoryDateRange.data)
        this.sell_category_date_range_table = true;
      })
      this.sell_category_date_range_table = false;
    }
    /* customer and product and category */
    else if (this.sell_customer_id != '' && this.sell_product_id != '' && this.sell_category_id != '' && (this.start_date === undefined && this.end_date === undefined)) {
      let customer_product_category = {
        'customer_id': this.sell_customer_id,
        'product_id': this.sell_product_id,
        'category_id': this.sell_category_id
      }
      this.reportService.getSellCustomerProductCategoryList(customer_product_category).subscribe((getSellCustomerProductCategory: any) => {
        this.sell_customer_product_category = this.global.tableIndex(getSellCustomerProductCategory.data)
        this.sell_customer_product_category_table = true;
      })
      this.sell_customer_product_category_table = false;
    }
    /* customer and product and category and date range*/
    else if (this.sell_customer_id != '' && this.sell_product_id != '' && this.sell_category_id != '' && this.start_date != '' && this.end_date != '') {
      let start_date = this.datepipe.transform(this.start_date, "YYYY-dd-MM")
      let end_date = this.datepipe.transform(this.end_date, "YYYY-dd-MM")

      let customer_product_category_date = {
        'customer_id': this.sell_customer_id,
        'product_id': this.sell_product_id,
        'category_id': this.sell_category_id,
        'start_date': start_date,
        'end_date': end_date
      }
      this.reportService.getSellCustomerProductCategoryDateRangeList(customer_product_category_date).subscribe((getSellCustomerProductCategoryDateRange: any) => {
        this.sell_customer_product_category_date_range = this.global.tableIndex(getSellCustomerProductCategoryDateRange.data)
        this.sell_customer_product_category_date_range_table = true;
      })
      this.sell_customer_product_category_date_range_table = false;
    }
    /* product and category and date range*/
    else if (this.sell_product_id != '' && this.sell_category_id != '' && this.start_date != '' && this.end_date != '' && this.sell_customer_id === undefined) {
      let start_date = this.datepipe.transform(this.start_date, "YYYY-dd-MM")
      let end_date = this.datepipe.transform(this.end_date, "YYYY-dd-MM")

      let product_category_date = {
        'customer_id': this.sell_customer_id,
        'product_id': this.sell_product_id,
        'start_date': start_date,
        'end_date': end_date
      }
      this.reportService.getSellProductCategoryDateRangeList(product_category_date).subscribe((getSellProductCategoryDateRange: any) => {
        this.sell_product_category_date_range = this.global.tableIndex(getSellProductCategoryDateRange.data)
        this.sell_product_category_date_range_table = true;
      })
      this.sell_product_category_date_range_table = false;
    }
    this.cancel();
  }

  sellPdf() {
    if (this.sell.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* product_details*/
    else if (this.sell_product.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_product
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* customer detais */
    else if (this.sell_customer.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_customer
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* product_details */
    else if (this.sell_category.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_category
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /*start and end date*/
    else if (this.date_arr.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.date_arr
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* customer and product */
    else if (this.sell_customer_product.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_customer_product
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* customer and category */
    else if (this.sell_customer_category.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_customer_category
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* customer and date range */
    else if (this.sell_customer_date_range.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_customer_date_range
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* product and category*/
    else if (this.sell_product_category.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_product_category
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* product and date range */
    else if (this.sell_product_date_range.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_product_date_range
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* category and date range */
    else if (this.sell_category_date_range.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_category_date_range
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* customer and product and category */
    else if (this.sell_customer_product_category.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_customer_product_category
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* customer and product and category and date range*/
    else if (this.sell_customer_product_category_date_range.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_customer_product_category_date_range
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
    /* product and category and date range*/
    else if (this.sell_product_category_date_range.length > 0) {
      const data = {
        sellTitle: 'Sell',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        sellHeader: ['#', 'Customer Name', 'Product Name', 'Inventory Name', 'Quantity'],
        sellContents: this.sell_product_category_date_range
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
  }

  cancel() {
    this.sell_customer_id = '';
    this.sell_category_id = '';
    this.sell_product_id = '';
    this.sellForm.reset();
    this.sell_product_table = false;
    this.sell_category_table = false;
    this.sell_customer_table = false;
    this.sell_table = false;
    this.sell_customer_product_table = false;
    this.sell_customer_category_table = false;
    this.sell_customer_date_range_table = false;
    this.sell_product_category_table = false;
    this.sell_product_date_range_table = false;
    this.sell_category_date_range_table = false;
    this.sell_customer_product_category_table = false;
    this.sell_customer_product_category_date_range_table = false;
    this.sell_product_category_date_range_table = false;
  }

  protected filterSellBanks() {
    if (!this.sell_details) {
      return;
    }
    // get the search keyword
    let search_product = this.sell_product_name_FilterCtrl.value;
    let search_category = this.sell_category_name_FilterCtrl.value;
    let search_customer = this.sell_customer_name_FilterCtrl.value;
    if (!search_product || !search_category || !search_customer) {
      this.filtered_sell_product_name.next(this.sell_details.slice());
      this.filtered_sell_category_name.next(this.sell_details.slice());
      this.filtered_sell_customer_name.next(this.sell_details.slice());
      return;
    } else {
      search_product = search_product.toLowerCase();
      search_category = search_category.toLowerCase();
      search_customer = search_customer.toLowerCase();
    }
    // filter the banks
    this.filtered_sell_product_name.next(
      this.sell_details.filter(data => {
        return data.product_name.toLowerCase().indexOf(search_product) > -1
      })
    );
    this.filtered_sell_category_name.next(
      this.sell_details.filter(data => {
        return data.category_name.toLowerCase().indexOf(search_category) > -1
      })
    );
    this.filtered_sell_customer_name.next(
      this.sell_details.filter(data => {
        return data.customer_name.toLowerCase().indexOf(search_customer) > -1
      })
    );
    this.filtered_sell_product_name.subscribe(d => {
    })
    this.filtered_sell_category_name.subscribe(d => {
    })
    this.filtered_sell_customer_name.subscribe(d => {
    })
  }
}