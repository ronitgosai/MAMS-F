import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/services/global.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { StockService } from 'app/services/dashboard/stock/stock.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private stockService: StockService,
    private reportService: ReportService,
    private datepipe: DatePipe,
    private titleService: Title
  ) { }

  stockForm: FormGroup;

  arrProductData = [];
  allStockProduct = [];
  stockProduct = [];

  stockProductTable: boolean;
  allStockProductTable: boolean;

  stockProductId: any;
  currentTable: any;

  protected _onDestroy = new Subject<void>();

  // public category_product_FilterCtrl: FormControl = new FormControl();
  // public filtered_category_product: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public productFilterCtrl: FormControl = new FormControl();
  public filteredProductName: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.stockForm = this.formBuilder.group({
      product_name: [''],
    })

    this.getStockProduct();
  }

  getStockProduct() {
    this.stockService.getStock().subscribe((getStock: any) => {
      this.arrProductData = this.global.tableIndex(getStock.data);
      this.filteredProductName.next(getStock.data.slice());
      this.productFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterStockProductBanks();
      });
      for (let i = 0; i < this.arrProductData.length; i++) {
        this.arrProductData[i].quantity = new Intl.NumberFormat('en-IN').format(this.arrProductData[i].quantity)
      }
    })
  }

  stockProductChange(event) {
    this.stockProductId = event.value
    this.stockForm.patchValue({
      product_id: this.arrProductData.find(d => d.product_id === event.value).product_id,
    })
  }

  getStockProductList() {
    if (this.stockProductId === undefined || this.stockProductId === '') {
      this.stockService.getStock().subscribe((getAllProduct: any) => {
        this.allStockProduct = this.global.tableIndex(getAllProduct.data);
        this.allStockProductTable = true
      })
      this.cancel();
    } else {
      let product = {
        'product_id': this.stockProductId
      }
      this.reportService.getStockProduct(product).subscribe((getProductName: any) => {
        this.stockProduct = this.global.tableIndex(getProductName.data);
        this.stockProductTable = true;
      })
      this.cancel();
    }
  }

  stockPdf() {
    if (this.allStockProduct.length > 0) {
      const data = {
        stockTitle: 'Stock',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        stockHeader: ['#', 'Product Name', 'Technical Name', 'Inventory Name', 'Quantity'],
        stockContents: this.allStockProduct
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }else{
      const data = {
        stockTitle: 'Stock',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        stockHeader: ['#', 'Product Name', 'Technical Name', 'Inventory Name', 'Quantity'],
        stockContents: this.stockProduct
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
  }

  cancel() {
    this.stockProductId = '';
    this.allStockProduct = [''];
    this.stockProduct = [''];
    this.stockProductTable = false;
    this.allStockProductTable = false;
    this.stockForm.reset();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterStockProductBanks() {
    if (!this.arrProductData) {
      return;
    }
    // get the search keyword
    let search = this.productFilterCtrl.value;
    if (!search) {
      this.filteredProductName.next(this.arrProductData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredProductName.next(
      this.arrProductData.filter(data => {
        return data.product_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredProductName.subscribe(d => {
    })
  }
}
