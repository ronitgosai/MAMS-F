import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { StockService } from 'app/services/dashboard/stock/stock.service';
import { GlobalService } from 'app/services/global.service';
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
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Stock | Modern Agrichem")
  }

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

  arr_product_data = [];
  arr_product_data_backup = [];

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

    this.getProduct();
  }

  getFunction(event){
    if(event.index === 0){
      this.getProduct();
    }else if(event.index === 1){
      this.getRawMaterial();
    }else{
      this.getInventory();
    }
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
