import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';
import { ProductCategoryService } from 'app/services/dashboard/master/product-category.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { ProductionService } from 'app/services/dashboard/production/production.service';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { StockService } from 'app/services/dashboard/stock/stock.service';
import { GlobalService } from 'app/services/global.service';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  constructor(
    private titelService: Title,
    private stockService: StockService,
    private rawMaterialService: RawMaterialService,
    private inventoryService: InventoryService,
    private productionService: ProductionService,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Stock | Modern Agrichem")
  }

  productForm: FormGroup;
  stockForm: FormGroup;
  updatedRawMaterialForm: FormGroup;

  isProgressBar_product: boolean;
  isProgressBar_raw_material: boolean;
  isProgressBar_inventory: boolean;

  is_table_product: boolean;
  is_table_raw_material: boolean;
  is_table_inventory: boolean;

  is_data_product: boolean;
  is_data_raw_material: boolean;
  is_data_inventory: boolean;


  raw_material_name: any;
  inventory_name: any;
  product_name: any;


  p_product: number = 1;
  p_raw_material: number = 1;
  p_inventory: number = 1;
  value = 'Clear me';
  entries_per_page_product: any = '10';
  entries_per_page_raw_material: any = '10';
  entries_per_page_inventory: any = '10';

  arr_raw_data = [];
  arr_raw_data_backup = [];

  arr_inventory_data = [];
  arr_inventory_data_backup = [];

  categoryProduct = [];
  categoryId: string;
  productName: string;
  manuallyProduct = [];
  inventoryFromProduct = [];
  arr_product_data = [];
  arr_product_data_backup = [];

  unit;

  ngOnInit(): void {
    // this.isProgressBar = true;
    this.is_table_product = false;
    this.is_table_raw_material = false;
    this.is_table_inventory = false;

    this.isProgressBar_product = true;
    this.isProgressBar_raw_material = true;
    this.isProgressBar_inventory = true;

    this.is_data_product = false;
    this.is_data_raw_material = false;
    this.is_data_inventory = false;

    this.productForm = this.formBuilder.group({
      categoryId: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      productTechnicalName: ['', [Validators.required]],
      productForm: ['', [Validators.required]],
      inventoryId: ['', [Validators.required]],
      productQuantity: ['', [Validators.required]]
    })

    this.getProduct();
    this.getCategory();
    this.inventoryName();
    // this.getInventoryFromProduct();
  }

  getFunction(event) {
    if (event.index === 0) {
      this.getProduct();
    } else if (event.index === 1) {
      this.getRawMaterial();
    } else {
      this.getInventory();
    }
  }

  getCategory() {
    this.productCategoryService.getMasterProductCategory().subscribe((getMasterProductCategory: any) => {
      this.categoryProduct = this.global.tableIndex(getMasterProductCategory.data);
    })
  }

  categoryChange(event) {
    let categoryId = {
      'category_id': event.value,
    };
    this.productionService.getCategoryWiceProduct(categoryId).subscribe((getCategoryWiceProduct: any) => {
      this.productName = this.global.tableIndex(getCategoryWiceProduct.data);
    });
  }

  inventoryName() {
    this.inventoryService.getInventory().subscribe((getInventoryFromProduct: any) => {
      this.inventoryFromProduct = this.global.tableIndex(getInventoryFromProduct.data);
    });
  }

  printNumber() {
    this.unit = Number(this.productForm.get('productQuantity').value.split(',').join('')).toLocaleString('en-IN');
  }

  search() {
    if (this.raw_material_name === '') {
      this.arr_raw_data = this.arr_raw_data_backup
    } else {
      this.arr_raw_data = this.arr_raw_data_backup.filter(res => {
        return res.raw_material_name.toLowerCase().match(this.raw_material_name.toLowerCase());
      })
    }
  }

  searchInventory() {
    if (this.inventory_name === '') {
      this.arr_inventory_data = this.arr_inventory_data_backup
    } else {
      this.arr_inventory_data = this.arr_inventory_data_backup.filter(res => {
        return res.inventory_name.toLowerCase().match(this.inventory_name.toLowerCase());
      })
    }
  }

  searchProduct() {
    if (this.product_name === '') {
      this.arr_product_data = this.arr_product_data_backup
    } else {
      this.arr_product_data = this.arr_product_data_backup.filter(res => {
        return res.product_name.toLowerCase().match(this.product_name.toLowerCase());
      })
    }
  }

  pagination(event) {
  }

  getRawMaterial() {
    this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
      this.arr_raw_data = this.global.tableIndex(getRawMaterial.data);
      for (let i = 0; i < this.arr_raw_data.length; i++) {
        this.arr_raw_data[i].raw_material_quantity = new Intl.NumberFormat('en-IN').format(this.arr_raw_data[i].raw_material_quantity)
      }
      this.arr_raw_data_backup = this.arr_raw_data
      this.isProgressBar_raw_material = false;
      if (this.arr_raw_data.length > 0) {
        this.is_data_raw_material = false;
        this.is_table_raw_material = true;
      } else if (this.arr_raw_data.length === 0) {
        this.is_table_raw_material = false;
        this.is_data_raw_material = true;
      }
    })
  }

  getInventory() {
    this.inventoryService.getInventory().subscribe((getInventory: any) => {
      this.arr_inventory_data = this.global.tableIndex(getInventory.data);
      for (let i = 0; i < this.arr_inventory_data.length; i++) {
        this.arr_inventory_data[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.arr_inventory_data[i].inventory_quantity)
      }
      this.arr_inventory_data_backup = this.arr_inventory_data
      this.isProgressBar_inventory = false;
      if (this.arr_inventory_data.length > 0) {
        this.is_data_inventory = false;
        this.is_table_inventory = true;
      } else if (this.arr_inventory_data.length === 0) {
        this.is_table_inventory = false;
        this.is_data_inventory = true;
      }
    })
  }

  insertProduct() {
    this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      let productInfo = {
        'product_name': this.productForm.get('productName').value,
        'product_technical_name': this.productForm.get('productTechnicalName').value,
        'product_form': this.productForm.get('productForm').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      };
      /* For Product Table */
      this.productService.createStockProduct(productInfo).subscribe((createStockProduct: any) => {
        /* For Category Product Table */
        let categoryProduct = {
          'stock_product_id': createStockProduct.data.stock_product_id,
          'category_id': this.productForm.get('categoryId').value,
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone()
        };
        this.productService.createStockProductCategory(categoryProduct).subscribe((createProductCategory: any) => {});
        let stockProductInfo = {
          'category_id': this.productForm.get('categoryId').value,
          'stock_product_id': createStockProduct.data.stock_product_id ,
          'inventory_id': this.productForm.get('inventoryId').value,
          'quantity': Number(this.productForm.get('productQuantity').value.split(',').join('')),
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone()
        };
        /* Stock Product Table */
        this.stockService.createStock(stockProductInfo).subscribe(createStock => {
          this.stockService.getStock().subscribe((getStock: any) => {
            this.arr_product_data = this.global.tableIndex(getStock.data);
            for (let i = 0; i < this.arr_product_data.length; i++) {
              this.arr_product_data[i].quantity = new Intl.NumberFormat('en-IN').format(this.arr_product_data[i].quantity)
            }
            this.arr_product_data_backup = this.arr_product_data
            this.isProgressBar_product = false;
            if (this.arr_product_data.length > 0) {
              this.is_data_product = false;
              this.is_table_product = true;
            } else if (this.arr_product_data.length === 0) {
              this.is_table_product = false;
              this.is_data_product = true;
            }
          })
        })
      })
      this.toastr.success("Product " + this.productForm.get('productName').value + " add successfully");
      this.productForm.reset();
      document.getElementById('collapseButton').click();

      // let productInfo = {
      //   'category_id': this.productForm.get('categoryId').value,
      //   'product_id': this.productForm.get('productId').value,
      //   'product_technical_name': this.productForm.get('productTechnicalName').value,
      //   'product_form': this.productForm.get('productForm').value,
      //   'inventory_id': this.productForm.get('inventoryId').value,
      //   'quantity': Number(this.productForm.get('productQuantity').value.split(',').join('')),
      //   'session_id': localStorage.getItem('session_id'),
      //   'created_date': this.global.getDateZone(),
      //   'created_time': this.global.getTimeZone()
      // }
      // this.productService.createProduct(productInfo).subscribe(data => { 
      //
      // })
    }
  }

  getProduct() {
    this.stockService.getStock().subscribe((getStock: any) => {
      this.arr_product_data = this.global.tableIndex(getStock.data);
      for (let i = 0; i < this.arr_product_data.length; i++) {
        this.arr_product_data[i].quantity = new Intl.NumberFormat('en-IN').format(this.arr_product_data[i].quantity)
      }
      this.arr_product_data_backup = this.arr_product_data
      this.isProgressBar_product = false;
      if (this.arr_product_data.length > 0) {
        this.is_data_product = false;
        this.is_table_product = true;
      } else if (this.arr_product_data.length === 0) {
        this.is_table_product = false;
        this.is_data_product = true;
      }
    })
  }
}
