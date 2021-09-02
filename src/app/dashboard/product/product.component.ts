import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from "sweetalert2";
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { GlobalService } from 'app/services/global.service';
import { ProductCategoryService } from 'app/services/dashboard/master/product-category.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private titelService: Title,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private rawMaterialService: RawMaterialService,
    private productCategoryService: ProductCategoryService,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Product | Modern Agrichem")
  }

  isProgressBar: boolean;
  is_table: boolean;
  is_data: boolean;

  arr_product_data = [];
  arr_product_data_backup = [];

  product_name: any;
  p: number = 1;
  entries_per_page: any = '10';
  value = 'Clear me';

  ngOnInit(): void {
    this.is_table = false;
    this.isProgressBar = true;
    this.is_data = false;

    this.getProductTable();
  }

  getProductTable() {
    this.isProgressBar = true;
    this.productService.getProduct().subscribe((getProduct: any) => {
      this.arr_product_data = this.global.tableIndex(getProduct.data);
      this.arr_product_data_backup = this.arr_product_data;
      this.isProgressBar = false;
      if (this.arr_product_data.length > 0) {
        this.is_data = false;
        this.is_table = true;
      } else if (this.arr_product_data.length === 0) {
        this.is_table = false;
        this.is_data = true;
      }
    })
  }


  search() {
    if (this.product_name === '') {
      this.arr_product_data = this.arr_product_data_backup
    } else {
      this.arr_product_data = this.arr_product_data_backup.filter(d => {
        return (
          d.product_name.toLowerCase().match(this.product_name.toLowerCase()) ||
          d.product_technical_name.toLowerCase().match(this.product_name.toLowerCase()) ||
          (d.category_id === 0 && ('FUNGICIDES').toLowerCase().match(this.product_name.toLowerCase())) ||
          (d.category_id === 1 && ('HERBICIDES').toLowerCase().match(this.product_name.toLowerCase())) ||
          (d.category_id === 2 && ('INSECTICIDES').toLowerCase().match(this.product_name.toLowerCase()))
        )
      })
    }
  }

  pagination(event) {
  }
}