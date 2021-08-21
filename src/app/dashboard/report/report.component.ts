import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { GlobalService } from 'app/services/global.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';
import { CustomerService } from 'app/services/dashboard/customer/customer.service';
import { ProductionService } from 'app/services/dashboard/production/production.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { Title } from '@angular/platform-browser';
import { StockService } from 'app/services/dashboard/stock/stock.service';
import { SellService } from 'app/services/dashboard/sell/sell.service';
import { StaffService } from 'app/services/dashboard/staff/staff.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private rawMaterialService: RawMaterialService,
    private inventoryService: InventoryService,
    private productionService: ProductionService,
    private productService: ProductService,
    private stockService: StockService,
    private sellService: SellService,
    private customerService: CustomerService,
    private staffService: StaffService,
    private reportService: ReportService,
    private datepipe: DatePipe,
    private titleService: Title
  ) {
    titleService.setTitle("Report | Modern Agrichem");
  }

  rawMaterialForm: FormGroup;
  importRawMaterialForm: FormGroup;
  inventoryForm: FormGroup;
  importInventoryForm: FormGroup;
  ongoingProductionForm: FormGroup;
  pastProductionForm: FormGroup;
  productForm: FormGroup;
  stockForm: FormGroup;
  sellForm: FormGroup;
  staffForm: FormGroup;

  ongoing_production = [];
  all_ongoing_production = [];
  past_production = [];
  category_past_production = [];
  category_product = [];
  product = [];

  category_id: any;
  is_data: boolean;
  is_table: boolean;
  is_past_table: boolean;
  is_category_table: boolean;
  product_table: boolean;
  category_product_table: boolean;

  raw_material = [];
  import_raw_material = [];
  all_raw_material_name = [];
  all_import_raw_material = [];
  raw_material_name = [];
  import_raw_material_name = [];
  import_raw_material_date = [];
  inventory = [];
  all_inventory_name = [];
  inventory_name = [];
  import_inventory_name = [];
  import_inventory_date = [];
  arr_product_data = [];
  all_stock_product = [];
  stock_product = [];
  sell_product = [];
  sell_customer = [];
  sell_category = [];
  sell = [];
  sell_details = [];
  customer_details = [];
  staff_role = [];
  staff = [];
  start_date_arr = [];
  date_arr = [];

  sell_customer_product = [];
  sell_customer_category = [];
  sell_customer_date_range = [];
  sell_product_category = [];
  sell_product_date_range = [];
  sell_category_date_range = [];
  sell_customer_product_category = [];
  sell_customer_product_category_date_range = [];
  sell_product_category_date_range = [];

  sell_customer_product_table: boolean;
  sell_customer_category_table: boolean;
  sell_customer_date_range_table: boolean;
  sell_product_category_table: boolean;
  sell_product_date_range_table: boolean;
  sell_category_date_range_table: boolean;
  sell_customer_product_category_table: boolean;
  sell_customer_product_category_date_range_table: boolean;
  sell_product_category_date_range_table: boolean;

  raw_material_name_table: boolean;
  all_raw_material_table: boolean;
  inventory_name_table: boolean;
  inventory_date_table: boolean;
  all_inventory_name_table: boolean;
  import_inventory_name_table: boolean;
  import_table: boolean;
  import_raw_material_table: boolean;
  import_raw_material_table_date: boolean;
  full_table: boolean;
  // is_data: boolean;
  is_date: boolean;
  stock_product_table: boolean;
  all_stock_product_table: boolean;
  sell_product_table: boolean;
  sell_category_table: boolean;
  sell_customer_table: boolean;
  sell_table: boolean;
  customer_table: boolean;
  staff_table: boolean;
  staff_role_table: boolean;

  sell_product_id: any;
  sell_category_id: any;
  sell_customer_id: any;
  stock_product_id: any;
  category_product_id: any;
  inventory_id: any;
  raw_material_id: any;
  staff_role_id: any;
  selected_date: any;
  start_date: any;
  end_date: any;
  date: any;
  old_card_index: any;
  raw_material_id_import: any;

  current_table = '';
  role = [];

  protected _onDestroy = new Subject<void>();
  public raw_material_FilterCtrl: FormControl = new FormControl();
  public filtered_raw_material_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public import_raw_material_FilterCtrl: FormControl = new FormControl();
  public filtered_import_raw_material_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public inventory_FilterCtrl: FormControl = new FormControl();
  public filtered_inventory_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public import_inventory_FilterCtrl: FormControl = new FormControl();
  public filtered_import_inventory_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public category_FilterCtrl: FormControl = new FormControl();
  public filtered_category: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public category_product_FilterCtrl: FormControl = new FormControl();
  public filtered_category_product: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public product_FilterCtrl: FormControl = new FormControl();
  public filtered_product_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public sell_product_name_FilterCtrl: FormControl = new FormControl();
  public filtered_sell_product_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public sell_customer_name_FilterCtrl: FormControl = new FormControl();
  public filtered_sell_customer_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public sell_category_name_FilterCtrl: FormControl = new FormControl();
  public filtered_sell_category_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public role_FilterCtrl: FormControl = new FormControl();
  filtered_role = [];

  ngOnInit() {
    this.raw_material_name_table = false;
    this.all_raw_material_table = false;
    this.import_raw_material_table = false;
    this.import_raw_material_table_date = false;
    this.all_inventory_name_table = false;
    this.import_inventory_name_table = false;
    this.inventory_date_table = false;
    this.full_table = false;
    this.is_date = false;
    this.import_table = false;
    this.is_past_table = false;
    this.is_category_table = false;
    this.is_data = false;
    this.is_table = false;
    this.product_table = false;
    this.category_product_table = false;
    this.stock_product_table = false;
    this.all_stock_product_table = false;
    this.sell_product_table = false;
    this.sell_category_table = false;
    this.sell_customer_table = false;
    this.sell_table = false;
    this.customer_table = false;
    this.staff_table = false;
    this.staff_role_table = false;
    this.sell_customer_product_table = false;
    this.sell_customer_category_table = false;
    this.sell_customer_date_range_table = false;
    this.sell_product_category_table = false;
    this.sell_product_date_range_table = false;
    this.sell_category_date_range_table = false;
    this.sell_customer_product_category_table = false;
    this.sell_customer_product_category_date_range_table = false;
    this.sell_product_category_date_range_table = false;

    // this.rawMaterialForm = this.formBuilder.group({
    //   raw_material_id: [''],
    //   raw_material_name: [''],
    // })

    // this.importRawMaterialForm = this.formBuilder.group({
    //   raw_material_id_import: [''],
    //   import_raw_material_name: [''],
    //   import_raw_material_date_start: [''],
    //   import_raw_material_date_end: ['']
    // })

    // this.inventoryForm = this.formBuilder.group({
    //   inventory_id: [''],
    //   inventory_name: [''],
    // })

    // this.importInventoryForm = this.formBuilder.group({
    //   import_inventory_id: [''],
    //   import_inventory_name: [''],
    //   import_inventory_date_start: [''],
    //   import_inventory_date_end: ['']
    // })

    // this.pastProductionForm = this.formBuilder.group({
    //   category_id: [''],
    //   start_time: [''],
    //   end_time: ['']
    // })

    // this.productForm = this.formBuilder.group({
    //   category_id: [''],
    // })

    this.stockForm = this.formBuilder.group({
      product_name: [''],
    })

    this.sellForm = this.formBuilder.group({
      customer_id: [''],
      product_id: [''],
      category_id: [''],
      start_date: [''],
      end_date: ['']
    })

    this.staffForm = this.formBuilder.group({
      staff_id: [''],
    })

    // this.getRawMaterial();
    // this.getImportRawMaterial();
    // this.getInventory();
    // this.getProductionList();
    // this.getPastProduction();
    // this.getProduct();
    // this.getStockProduct();
    this.getsell();
    this.getStaff();
  }

  pdf(){
    const data = {
      titles: ['#','Raw Material Name','Quantity','Unit'],
      contents: this.raw_material
    }
    this.reportService.pdf(data).subscribe((pdfmake) => {
      saveAs(pdfmake,"mypdf")
    })
  }


  // raw material
  // getRawMaterial() {
  //   this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
  //     this.raw_material = this.global.tableIndex(getRawMaterial.data);
  //     this.filtered_raw_material_name.next(getRawMaterial.data.slice());
  //     this.raw_material_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
  //       this.filterRawMaterialBanks();
  //     });
  //   })
  // }

  // getImportRawMaterial() {
  //   this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
  //     this.import_raw_material = this.global.tableIndex(getImportRawMaterial.data);
  //     this.filtered_import_raw_material_name.next(getImportRawMaterial.data.slice());
  //     this.import_raw_material_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
  //       this.filterImportBanks();
  //     });
  //   })
  // }

  // rawMaterialChange(event) {
  //   this.raw_material_id = event.value
  //   this.rawMaterialForm.patchValue({
  //     raw_material_id: this.raw_material.find(d => d.raw_material_id === event.value).raw_material_id,
  //   })
  // }

  // getRawMaterialList() {
  //   if (this.raw_material_id === undefined || this.raw_material_id.length === 0) {
  //     this.rawMaterialService.getRawMaterial().subscribe((getAllRawMaterial: any) => {
  //       this.all_raw_material_name = this.global.tableIndex(getAllRawMaterial.data);
  //       this.all_raw_material_table = true
  //     })
  //     this.all_raw_material_table = false;
  //     this.cancel();
  //   } else {
  //     let raw_material = {
  //       'raw_material_id': this.raw_material_id
  //     }
  //     this.reportService.getRawMaterial(raw_material).subscribe((getRawMaterialName: any) => {
  //       this.raw_material_name = this.global.tableIndex(getRawMaterialName.data)
  //       this.raw_material_name_table = true;
  //     })
  //     this.raw_material_name_table = false;
  //     this.cancel();
  //   }
  // }

  // importRawMaterialChange(event) {
  //   this.raw_material_id = event.value
  //   this.importRawMaterialForm.patchValue({
  //     raw_material_id_import: this.import_raw_material.find(d => d.raw_material_id === event.value).raw_material_id,
  //   })
  // }

  // onKey(event, value) {
  //   this.selected_date = value
  // }

  // getImportRawMaterialList() {
  //   if ((this.raw_material_id === undefined && this.selected_date === undefined) || (this.raw_material_id === '' && this.selected_date === '')) {
  //     this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
  //       this.all_import_raw_material = this.global.tableIndex(getImportRawMaterial.data)
  //       this.import_table = true;
  //       this.import_raw_material_table = false;
  //       this.import_raw_material_table_date = false;
  //     })
  //   } else if (this.raw_material_id != '') {
  //     let raw_material = {
  //       'import_raw_material_id': this.raw_material_id
  //     }
  //     this.reportService.getImportRawMaterial(raw_material).subscribe((getImportRawMaterialName: any) => {
  //       this.import_raw_material_name = this.global.tableIndex(getImportRawMaterialName.data)
  //       this.import_table = false;
  //       this.import_raw_material_table = true;
  //       this.import_raw_material_table_date = false;
  //     })
  //   } else if (this.selected_date != '') {
  //     let formattedDate = this.datepipe.transform(this.selected_date, "YYYY-dd-MM")
  //     let raw_material_date = {
  //       'import_raw_material_date_start': formattedDate
  //     }
  //     this.reportService.getImportRawMaterialDate(raw_material_date).subscribe((getImportRawMaterialDate: any) => {
  //       this.import_raw_material_date = this.global.tableIndex(getImportRawMaterialDate.data)
  //       this.import_table = false;
  //       this.import_raw_material_table = false;
  //       this.import_raw_material_table_date = true;
  //     })
  //   }
  //   this.cancel();
  // }


  // inventory 
  
  /* inventory */
  // getInventory() {
  //   this.inventoryService.getInventory().subscribe((getInventory: any) => {
  //     this.inventory = this.global.tableIndex(getInventory.data);
  //     this.filtered_inventory_name.next(getInventory.data.slice());
  //     this.inventory_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
  //       this.filterInventoryBanks();
  //     });
  //   })
  // }

  // inventoryChange(event) {
  //   this.inventory_id = event.value
  //   this.inventoryForm.patchValue({
  //     inventory_id: this.inventory.find(d => d.inventory_id === event.value).inventory_id,
  //   })
  // }

  // getInventoryList() {
  //   if (this.inventory_id === undefined || this.inventory_id === '') {
  //     this.inventoryService.getInventory().subscribe((getAllInventory: any) => {
  //       this.all_inventory_name = this.global.tableIndex(getAllInventory.data);
  //       this.all_inventory_name_table = true;
  //     })
  //     this.all_inventory_name_table = false;
  //     this.cancel();
  //   } else {
  //     let inventory = {
  //       'inventory_id': this.inventory_id
  //     }
  //     this.reportService.getInventory(inventory).subscribe((getInventoryName: any) => {
  //       this.inventory_name = this.global.tableIndex(getInventoryName.data)
  //       this.inventory_name_table = true;
  //     })
  //     this.inventory_name_table = false;
  //     this.cancel();
  //   }
  // }

  // onSelect(event, value) {
  //   this.selected_date = value;
  // }

  // getImportInventoryList() {
  //   if ((this.inventory_id === undefined && this.selected_date === undefined) || (this.inventory_id === '' && this.selected_date === '')) {
  //     this.inventoryService.getImportInvetory().subscribe((getImportInvetory: any) => {
  //       this.all_inventory_name = this.global.tableIndex(getImportInvetory.data);
  //       this.all_inventory_name_table = true;
  //     })
  //     this.all_inventory_name_table = false;
  //   } else if (this.inventory_id != '') {
  //     let inventory = {
  //       'inventory_id': this.inventory_id
  //     }
  //     this.reportService.getImportInventory(inventory).subscribe((getImporInventoryName: any) => {
  //       this.import_inventory_name = this.global.tableIndex(getImporInventoryName.data);
  //       this.inventory_name_table = true;
  //     })
  //     this.inventory_name_table = false;
  //   } else if (this.selected_date != '') {
  //     let formattedDate = this.datepipe.transform(this.selected_date, "YYYY-dd-MM")
  //     let inventory_date = {
  //       'import_inventory_date_start': formattedDate
  //     }
  //     this.reportService.getImportInventoryDate(inventory_date).subscribe((getImportInventoryDate: any) => {
  //       this.import_inventory_date = this.global.tableIndex(getImportInventoryDate.data)
  //       this.inventory_date_table = true;
  //     })
  //     this.inventory_date_table = false;
  //   }
  //   this.cancel();
  // }


  // production
  
  /* Production */
  // getProductionList() {
  //   this.productionService.getProduction().subscribe((getProduction: any) => {
  //     this.all_ongoing_production = this.global.tableIndex(getProduction.data)
  //     if (this.all_ongoing_production.length > 0) {
  //       this.is_data = false;
  //       this.is_table = false;
  //     } else if (this.all_ongoing_production.length === 0) {
  //       this.is_data = true;
  //       this.is_table = false;
  //     }
  //     for (let i = 0; i < this.all_ongoing_production.length; i++) {
  //       this.all_ongoing_production[i].raw_material_quantity = this.all_ongoing_production[i].raw_material_quantity.split(',')
  //       for (let j = 0; j < this.all_ongoing_production[i].raw_material_quantity.length; j++) {
  //         this.all_ongoing_production[i].raw_material_quantity[j] = parseInt(this.all_ongoing_production[i].raw_material_quantity[j]).toLocaleString('en-IN')
  //       }
  //     }
  //   })
  // }

  // categoryChange(event) {
  //   this.category_id = event.value
  //   this.pastProductionForm.patchValue({
  //     category_id: this.past_production.find(d => d.category_id === event.value).category_id,
  //   })
  // }

  // getPastProduction() {
  //   this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
  //     this.past_production = this.global.tableIndex(getProductionTable.data);
  //     this.filtered_category.next(getProductionTable.data.slice());
  //     this.category_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
  //       this.filterBanks();
  //     });
  //   })
  //   for (let i = 0; i < this.past_production.length; i++) {
  //     // this.past_production[i].raw_material_quantity = this.past_production[i].raw_material_quantity.split(',')
  //     // this.past_production[i].inventory_qty = this.past_production[i].inventory_qty.split(',')
  //     for (let j = 0; j < this.past_production[i].inventory_qty.length; j++) {
  //       this.past_production[i].raw_material_quantity[j] = parseInt(this.past_production[i].raw_material_quantity[j]).toLocaleString('en-IN')
  //       this.past_production[i].inventory_qty[j] = parseInt(this.past_production[i].inventory_qty[j]).toLocaleString('en-IN')
  //     }
  //   }
  // }

  // getPastProductionList() {
  //   if (this.category_id === undefined || this.category_id.length === 0) {
  //     this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
  //       this.past_production = this.global.tableIndex(getProductionTable.data);
  //     });
  //     for (let i = 0; i < this.past_production.length; i++) {
  //         this.past_production[i].raw_material_quantity = this.past_production[i].raw_material_quantity.split(',')
  //         this.past_production[i].inventory_qty = this.past_production[i].inventory_qty.split(',')
  //       for (let j = 0; j < this.past_production[i].raw_material_quantity.length; j++) {
  //         this.past_production[i].raw_material_quantity[j] = parseInt(this.past_production[i].raw_material_quantity[j]).toLocaleString('en-IN')
  //         this.past_production[i].inventory_qty[j] = parseInt(this.past_production[i].inventory_qty[j]).toLocaleString('en-IN')
  //       }
  //     }
  //     this.is_past_table = true;
  //     this.is_category_table = false;
  //   } else {
  //     let category = {
  //       'category_id': this.category_id
  //     }
  //     this.reportService.getCategoryWiceProduction(category).subscribe((getCategoryWiceProduction: any) => {
  //       this.category_past_production = this.global.tableIndex(getCategoryWiceProduction.data)
  //     })
  //     for (let i = 0; i < this.category_past_production.length; i++) {
  //       this.category_past_production[i].raw_material_quantity = this.category_past_production[i].raw_material_quantity.split(',')
  //       this.category_past_production[i].inventory_qty = this.category_past_production[i].inventory_qty.split(',')
  //       for (let j = 0; j < this.category_past_production[i].inventory_qty.length; j++) {
  //         this.category_past_production[i].raw_material_quantity[j] = parseInt(this.category_past_production[i].raw_material_quantity[j]).toLocaleString('en-IN')
  //         this.category_past_production[i].inventory_qty[j] = parseInt(this.category_past_production[i].inventory_qty[j]).toLocaleString('en-IN')
  //       }
  //     }
  //     this.is_past_table = false;
  //     this.is_category_table = true;
  //   }
  //   this.cancel();
  // }


  // product
  
  /* Product */
  // getProductList() {
  //   if (this.category_product_id === undefined || this.category_product_id.length === 0) {
  //     this.productService.getProduct().subscribe((getProduct: any) => {
  //       this.product = this.global.tableIndex(getProduct.data);
  //       this.product_table = true;
  //       this.category_product_table = false;
  //     })

  //   } else {
  //     let category = {
  //       'category_id': this.category_product_id
  //     }
  //     this.reportService.getCategoryWiseProduct(category).subscribe((getCategoryWiceProduct: any) => {
  //       this.category_product = this.global.tableIndex(getCategoryWiceProduct.data)
  //       this.product_table = false;
  //       this.category_product_table = true;
  //     })
  //   }
  //   this.cancel();
  // }

  // categoryProductChange(event) {
  //   this.category_product_id = event.value
  //   this.pastProductionForm.patchValue({
  //     category_id: this.product.find(d => d.category_id === event.value).category_id,
  //   })
  // }

  // getProduct() {
  //   this.productService.getProduct().subscribe((getProduct: any) => {
  //     this.product = this.global.tableIndex(getProduct.data);
  //     this.filtered_category_product.next(getProduct.data.slice());
  //     this.category_product_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
  //       this.filterRawMaterialBanks();
  //     });
  //   })
  // }


  /* Stock */
  // getStockProduct() {
  //   this.stockService.getStock().subscribe((getStock: any) => {
  //     this.arr_product_data = this.global.tableIndex(getStock.data);
  //     this.filtered_product_name.next(getStock.data.slice());
  //     this.product_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
  //       this.filterStockProductBanks();
  //     });
  //     for (let i = 0; i < this.arr_product_data.length; i++) {
  //       this.arr_product_data[i].quantity = new Intl.NumberFormat('en-IN').format(this.arr_product_data[i].quantity)
  //     }
  //   })
  // }

  // stockProductChange(event) {
  //   this.stock_product_id = event.value
  //   this.stockForm.patchValue({
  //     product_id: this.arr_product_data.find(d => d.product_id === event.value).product_id,
  //   })
  // }

  // getStockProductList() {
  //   if (this.stock_product_id === undefined || this.stock_product_id === '') {
  //     this.stockService.getStock().subscribe((getAllProduct: any) => {
  //       this.all_stock_product = this.global.tableIndex(getAllProduct.data);
  //       this.all_stock_product_table = true
  //     })
  //     this.all_stock_product_table = false;
  //     this.cancel();
  //   } else {
  //     let product = {
  //       'product_id': this.stock_product_id
  //     }
  //     this.reportService.getStockProduct(product).subscribe((getProductName: any) => {
  //       this.stock_product = this.global.tableIndex(getProductName.data)
  //       this.stock_product_table = true;
  //     })
  //     this.stock_product_table = false;
  //     this.cancel();
  //   }
  // }


  /* sell */
  getsell() {
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
        this.sell = this.global.tableIndex(getSell.data)
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


  /* customer */
  getCustomer() {
    this.customerService.getCustomer().subscribe((getCustomer: any) => {
      this.customer_details = this.global.tableIndex(getCustomer.data);
      this.customer_table = true;
    })
    this.customer_table = false;
  }


  /* staff */
  getStaff() {
    this.staffService.getStaff().subscribe((getStaff: any) => {
      this.staff = this.global.tableIndex(getStaff.data);
      this.staff.map((d, index) => {
        if (this.filtered_role.indexOf(d.user_role) === -1) {
          this.filtered_role.push(d.user_role)
        }
      })
      this.role_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((d) => {
        this.filterStaffBanks();
      });
    })
  }

  staffChange(event) {
    this.staff_role_id = event.value
  }

  getStaffList() {
    if (this.staff_role_id === undefined || this.staff_role_id.length === '') {
      this.staffService.getStaff().subscribe((getStaff: any) => {
        this.staff = this.global.tableIndex(getStaff.data)
        this.staff_table = true;
      })
      this.staff_table = false;
    } else {
      let staff = {
        'user_role': this.staff_role_id
      }
      this.reportService.getStaff(staff).subscribe((getStaff: any) => {
        this.staff_role = this.global.tableIndex(getStaff.data)
        this.staff_role_table = true;
      })
      this.staff_role_table = false;
    }
    this.cancel();
  }


  // all table false and id empty 
  cancel() {
    this.category_id = '';
    this.pastProductionForm.reset();
    this.productForm.reset();
    this.raw_material_id = '';
    this.importRawMaterialForm.reset();
    this.rawMaterialForm.reset();
    this.raw_material_name_table = false;
    this.all_raw_material_table = false;
    this.import_table = false;
    this.import_raw_material_table = false;
    this.import_raw_material_table_date = false;
    this.inventory_id = '';
    this.importInventoryForm.reset();
    this.inventoryForm.reset();
    this.inventory_name_table = false;
    this.all_inventory_name_table = false;
    this.inventory_date_table = false;
    this.category_product_id = '';
    this.productForm.reset();
    this.product_table = false;
    this.category_product_table = false;
    this.stock_product_id = '';
    this.sell_customer_id = '';
    this.sell_category_id = '';
    this.sell_product_id = '';
    this.start_date = '';
    this.sellForm.reset();
    this.sell_product_table = false;
    this.sell_category_table = false;
    this.sell_customer_table = false;
    this.sell_table = false;
    this.customer_table = false;
    this.staff_role_id = '';
    this.staffForm.reset();
    this.staff_table = false;
    this.staff_role_table = false;
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterRawMaterialBanks() {
    if (!this.raw_material) {
      return;
    }
    // get the search keyword
    let search = this.raw_material_FilterCtrl.value;
    if (!search) {
      this.filtered_raw_material_name.next(this.raw_material.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_raw_material_name.next(
      this.raw_material.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_raw_material_name.subscribe(d => {
    })
  }

  protected filterInventoryBanks() {
    if (!this.inventory) {
      return;
    }
    // get the search keyword
    let search = this.inventory_FilterCtrl.value;
    if (!search) {
      this.filtered_inventory_name.next(this.inventory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_inventory_name.next(
      this.inventory.filter(data => {
        return data.inventory_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_inventory_name.subscribe(d => {
    })
  }

  // protected filterImportBanks() {
  //   if (!this.import_raw_material) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.import_raw_material_FilterCtrl.value;
  //   if (!search) {
  //     this.filtered_import_raw_material_name.next(this.import_raw_material.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the banks
  //   this.filtered_import_raw_material_name.next(
  //     this.import_raw_material.filter(data => {
  //       return data.import_raw_material_name.toLowerCase().indexOf(search) > -1
  //     })
  //   );
  //   this.filtered_import_raw_material_name.subscribe(d => {
  //   })
  // }

  protected filterBanks() {
    if (!this.past_production) {
      return;
    }
    // get the search keyword
    let search = this.category_FilterCtrl.value;
    if (!search) {
      this.filtered_category.next(this.past_production.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_category.next(
      this.past_production.filter(data => {
        return data.category_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_category.subscribe(d => {
    })
  }

  protected filterCategoryProductBanks() {
    if (!this.product) {
      return;
    }
    // get the search keyword
    let search = this.category_product_FilterCtrl.value;
    if (!search) {
      this.filtered_category_product.next(this.product.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_category_product.next(
      this.product.filter(data => {
        return data.category_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_category.subscribe(d => {
    })
  }

  protected filterStockProductBanks() {
    if (!this.arr_product_data) {
      return;
    }
    // get the search keyword
    let search = this.product_FilterCtrl.value;
    if (!search) {
      this.filtered_category_product.next(this.arr_product_data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_product_name.next(
      this.arr_product_data.filter(data => {
        return data.product_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_product_name.subscribe(d => {
    })
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

  protected filterStaffBanks() {
    if (!this.staff) {
      return;
    }
    // get the search keyword
    let search = this.role_FilterCtrl.value;
    if (!search) {
      // this.filtered_role.next(this.staff.slice());
      this.filtered_role
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_role = this.staff.filter(data => {
      return data.user_role.toLowerCase().indexOf(search) > -1
    })
  }
}