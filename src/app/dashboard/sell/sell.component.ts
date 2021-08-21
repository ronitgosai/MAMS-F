import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CustomerService } from 'app/services/dashboard/customer/customer.service';
import { ProductCategoryService } from 'app/services/dashboard/master/product-category.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { SellService } from 'app/services/dashboard/sell/sell.service';
import { StockService } from 'app/services/dashboard/stock/stock.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  constructor(
    private titelService: Title,
    private sellService: SellService,
    private productService: ProductService,
    private stockService: StockService,
    private customerService: CustomerService,
    private productCategoryService: ProductCategoryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Sell | Modern Agrichem")
  }

  sellForm: FormGroup;
  updateSellFrom: FormGroup;

  isProgressBar: boolean;
  is_product_enable: boolean;
  is_inventory_enable: boolean;
  is_table: boolean;
  is_show: boolean;
  is_data: boolean;
  is_done: boolean;

  sell_data = [];
  stock_product = [];
  obj_customer_data = [];
  obj_customer_data_backup = [];
  arr_product_from_category = [];
  arr_inventory_from_product = [];
  category = [];

  key: string = 'customer_name';
  reverse: boolean = false;
  p: number = 1;
  entries_per_page: any = '10';
  value = 'Clear me';
  customer_name: any;
  product_id: any;
  qty: any;
  quantity: any;

  ngOnInit(): void {
    this.is_product_enable = false;
    this.is_inventory_enable = false;
    this.is_table = false;
    this.isProgressBar = true;
    this.is_data = false;

    this.sellForm = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      product_id: ['', [Validators.required]],
      inventory_id: ['', [Validators.required]],
      product_quantity: ['', [Validators.required]]
    })

    this.updateSellFrom = this.formBuilder.group({
      update_customer_name: [''],
      update_product_name: [''],
      update_product_quantity: [''],
    })

    // this.isProgressBar = true;
    this.sellService.getSell().subscribe((getSellDetail: any) => {
      this.sell_data = this.global.tableIndex(getSellDetail.data)
      for (let i = 0; i < this.sell_data.length; i++) {
        this.sell_data[i].product_quantity = new Intl.NumberFormat('en-IN').format(this.sell_data[i].product_quantity)
      }
      this.isProgressBar = false;
      if (this.sell_data.length > 0) {
        this.is_data = false;
        this.is_table = true;
      } else if (this.sell_data.length === 0) {
        this.is_table = false;
        this.is_data = true;
      }
    })

    this.sellService.getProductWiseInventory().subscribe((response: any) => {
      this.stock_product = response.data
      if (this.stock_product.length > 0) {
        this.isProgressBar = false;
        this.is_show = true;
      }
    })

    this.customerService.getCustomer().subscribe((response: any) => {
      this.obj_customer_data = response.data
      if (this.obj_customer_data.length > 0) {
        this.isProgressBar = false;
        this.is_show = true;
      }
    })
    this.getProductCategory();
  }

  productCategoryChange(event) {
    this.is_product_enable = false;
    let category_id = {
      'category_id': event.value,
    };
    this.sellService.getCategoryWiseProduct(category_id).subscribe((getCategoryWiceProduct: any) => {
      this.arr_product_from_category = getCategoryWiceProduct.data;
      if (this.arr_product_from_category.length > 0) {
        this.isProgressBar = false;
        this.is_product_enable = true;
      }
    });
  }

  productChange(event) {
    this.product_id = event.value;
    let tmp_inventory = this.stock_product.filter(d => d.product_id === event.value)
    let tmp_inventory_id = [];
    tmp_inventory.map((d, index) => {
      tmp_inventory_id[index] = d.inventory_id
    })
    let inventory_id = {
      'inventory_id': tmp_inventory_id
    }
    this.sellService.getInventoryName(inventory_id).subscribe((response: any) => {
      this.arr_inventory_from_product = response.data
      if (this.arr_inventory_from_product.length > 0) {
        this.is_product_enable = true;
        this.is_inventory_enable = true;
      }
    })
  }

  getProductCategory(){
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.category = this.global.tableIndex(categoryName.data);
    })
  }


  printNumber() {
    this.quantity = parseInt(this.sellForm.get('product_quantity').value.split(',').join('')).toLocaleString('en-IN')
  }

  search() {
    if (this.customer_name === '') {
      this.obj_customer_data = this.obj_customer_data_backup
    } else {
      this.obj_customer_data = this.obj_customer_data_backup.filter(res => {
        return res.customer_name.toLowerCase().match(this.customer_name.toLowerCase());
      })
    }
  }

  pagination(event) { }

  inventoryChange(event) {
    this.is_inventory_enable = true;
    this.qty = this.stock_product.find(d => d.inventory_id === event.value && d.product_id === this.product_id).quantity
  }

  insertSellDetails() {
    this.is_table = false;
    this.isProgressBar = true;
    this.is_done = true;
    // this.sellForm.get('product_quantity').value = Number(this.sellForm.get('product_quantity').value.split(',').join(''))
    let product_quantity = {
      'quantity': Number(this.sellForm.get('product_quantity').value.split(',').join('')),
      'inventory_id': this.sellForm.get('inventory_id').value,
      'product_id': this.sellForm.get('product_id').value,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    if (Number(this.sellForm.get('product_quantity').value.split(',').join('')) >= this.qty) {
      this.toastr.error("Please enter quantity less than stock quantity")
      this.is_done = false;
    } else if (Number(this.sellForm.get('product_quantity').value.split(',').join('')) === 0) {
      this.toastr.error("Please enter quantity greater than 0")
      this.is_done = false;
    }
    else {
      if (this.sellForm.valid && this.is_done === true) {
        let sellDetails = {
          'customer_id': this.sellForm.get('customer_id').value,
          'category_id': this.sellForm.get('category_id').value,
          'product_id': this.sellForm.get('product_id').value,
          'inventory_id': this.sellForm.get('inventory_id').value,
          'product_quantity': Number(this.sellForm.get('product_quantity').value.split(',').join('')),
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone()
        }
        this.sellService.createSell(sellDetails).subscribe(data => {
          this.sellService.getSell().subscribe((getSellDetail: any) => {
            this.sell_data = this.global.tableIndex(getSellDetail.data)
            for (let i = 0; i < this.sell_data.length; i++) {
              this.sell_data[i].product_quantity = new Intl.NumberFormat('en-IN').format(this.sell_data[i].product_quantity)
            }
            this.isProgressBar = false;
            if (this.sell_data.length > 0) {
              this.is_data = false;
              this.is_table = true;
            } else if (this.sell_data.length === 0) {
              this.is_table = false;
              this.is_data = true;
            }
          })
        })
        this.sellService.productQuantitySubstratct(product_quantity).subscribe(response => {
          // this.toastr.success("");
        })
        this.toastr.success("Sale has been made successfully!");
        this.sellForm.reset();
        this.is_product_enable = false;
        this.is_inventory_enable = false;
        document.getElementById('collapseButton').click();
      } else {
        this.isProgressBar = false;
        this.is_table = true;
        this.toastr.error("Please fill the form")
      }
    }
  }

  deleteSellItem(sell_id) {
    let delete_sell_item_id = {
      'sell_id': sell_id,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to delete sell details?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.is_table = false;
        this.isProgressBar = true;
        this.sellService.deleteSellItem(delete_sell_item_id).subscribe(data => {
          this.sellService.getSell().subscribe((getSellDetail: any) => {
            this.sell_data = this.global.tableIndex(getSellDetail.data)
            for (let i = 0; i < this.sell_data.length; i++) {
              this.sell_data[i].product_quantity = new Intl.NumberFormat('en-IN').format(this.sell_data[i].product_quantity)
            }
            this.isProgressBar = false;
            if (this.sell_data.length > 0) {
              this.is_data = false;
              this.is_table = true;
            } else if (this.sell_data.length === 0) {
              this.is_table = false;
              this.is_data = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Your Sell Details has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Sell Details are safe :)',
          'error'
        )
      }
    })
  }
}