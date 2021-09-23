import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { ToastrService } from 'ngx-toastr';
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
  isTable: boolean;
  isData: boolean;

  productData = [];
  productDataBackup = [];

  productName: any;
  p: number = 1;
  entriesPerPage: any = '10';
  value = 'Clear me';

  ngOnInit(): void {
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;
    this.getProductTable();
  }

  getProductTable() {
    this.isProgressBar = true;
    this.productService.getProduct().subscribe((getProduct: any) => {
      this.productData = this.global.tableIndex(getProduct.data);
      this.productDataBackup = this.productData;
      this.isProgressBar = false;
      if (this.productData.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.productData.length === 0) {
        this.isData = true;
        this.isTable = false;
      }
    })
  }


  search() {
    if (this.productName === '') {
      this.productData = this.productDataBackup
    } else {
      this.productData = this.productDataBackup.filter(d => {
        return (
          d.product_name.toLowerCase().match(this.productName.toLowerCase()) ||
          d.product_technical_name.toLowerCase().match(this.productName.toLowerCase()) ||
          (d.category_id === 0 && ('FUNGICIDES').toLowerCase().match(this.productName.toLowerCase())) ||
          (d.category_id === 1 && ('HERBICIDES').toLowerCase().match(this.productName.toLowerCase())) ||
          (d.category_id === 2 && ('INSECTICIDES').toLowerCase().match(this.productName.toLowerCase()))
        )
      })
    }
  }

  pagination(event) {
  }
}