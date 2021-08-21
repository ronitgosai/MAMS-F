import { Component, OnInit } from '@angular/core';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { GlobalService } from 'app/services/global.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private productService: ProductService,
    private reportService: ReportService,
    private datepipe: DatePipe,
    private titleService: Title
  ) { }

  productForm: FormGroup;

  categoryProduct = [];
  product = [];
  // arr_product_data = [];

  productTable: boolean;
  categoryProductTable: boolean;

  categoryProductId: any;

  currentTable = '';

  protected _onDestroy = new Subject<void>();
  public categoryProductFilterCtrl: FormControl = new FormControl();
  public filteredCategoryProduct: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  // public product_FilterCtrl: FormControl = new FormControl();
  // public filtered_product_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.productTable = false;
    this.categoryProductTable = false;

    this.productForm = this.formBuilder.group({
      category_id: [''],
    })

    this.getProduct();
  }

  getProductList() {
    if (this.categoryProductId === undefined || this.categoryProductId.length === 0) {
      this.productService.getProduct().subscribe((getProduct: any) => {
        this.product = this.global.tableIndex(getProduct.data);
        this.productTable = true;
        this.categoryProductTable = false;
      })

    } else {
      let category = {
        'category_id': this.categoryProductId
      }
      this.reportService.getCategoryWiseProduct(category).subscribe((getCategoryWiceProduct: any) => {
        this.categoryProduct = this.global.tableIndex(getCategoryWiceProduct.data)
        this.productTable = false;
        this.categoryProductTable = true;
      })
    }
    this.cancel();
  }

  categoryProductChange(event) {
    this.categoryProductId = event.value
    this.productForm.patchValue({
      category_id: this.product.find(d => d.category_id === event.value).category_id,
    })
  }

  getProduct() {
    this.productService.getProduct().subscribe((getProduct: any) => {
      this.product = this.global.tableIndex(getProduct.data);
      this.filteredCategoryProduct.next(getProduct.data.slice());
      this.categoryProductFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterCategoryProductBanks();
      });
    })
  }

  cancel() {
    this.categoryProductId = '';
    this.productForm.reset();
    this.productTable = false;
    this.categoryProductTable = false;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterCategoryProductBanks() {
    if (!this.product) {
      return;
    }
    // get the search keyword
    let search = this.categoryProductFilterCtrl.value;
    if (!search) {
      this.filteredCategoryProduct.next(this.product.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCategoryProduct.next(
      this.product.filter(data => {
        return data.category_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredCategoryProduct.subscribe(d => {
    })
  }
}