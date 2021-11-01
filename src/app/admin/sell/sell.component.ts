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
  isProductEnable: boolean;
  isInventoryEnable: boolean;
  isTable: boolean;
  isShow: boolean;
  isData: boolean;
  isDone: boolean;

  sellData = [];
  stockProduct = [];
  customerData = [];
  customerDataBackup = [];
  productFromCategory = [];
  inventoryFromProduct = [];
  category = [];

  key: string = 'customer_name';
  reverse: boolean = false;
  p: number = 1;
  entriesPerPage: any = '10';
  value = 'Clear me';
  customerName: any;
  productId: any;
  qty: any;
  quantity: any;

  ngOnInit(): void {
    this.isProductEnable = false;
    this.isInventoryEnable = false;
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

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
      this.sellData = this.global.tableIndex(getSellDetail.data);
      for (let i = 0; i < this.sellData.length; i++) {
        this.sellData[i].product_quantity = new Intl.NumberFormat('en-IN').format(this.sellData[i].product_quantity)
      }
      this.isProgressBar = false;
      if (this.sellData.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.sellData.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })

    this.sellService.getProductWiseInventory().subscribe((response: any) => {
      this.stockProduct = response.data
      if (this.stockProduct.length > 0) {
        this.isProgressBar = false;
        this.isShow = true;
      }
    })

    this.customerService.getCustomer().subscribe((response: any) => {
      this.customerData = response.data
      if (this.customerData.length > 0) {
        this.isProgressBar = false;
        this.isShow = true;
      }
    })
    this.getProductCategory();
  }

  productCategoryChange(event) {
    this.isProductEnable = false;
    let category_id = {
      'category_id': event.value,
    };
    this.sellService.getCategoryWiseProduct(category_id).subscribe((getCategoryWiceProduct: any) => {
      this.productFromCategory = getCategoryWiceProduct.data;
      if (this.productFromCategory.length > 0) {
        this.isProgressBar = false;
        this.isProductEnable = true;
      }
    });
  }

  productChange(event) {
    this.productId = event.value;
    let tmp_inventory = this.stockProduct.filter(d => d.product_id === event.value)
    let tmp_inventory_id = [];
    tmp_inventory.map((d, index) => {
      tmp_inventory_id[index] = d.inventory_id
    })
    let inventory_id = {
      'inventory_id': tmp_inventory_id
    }
    this.sellService.getInventoryName(inventory_id).subscribe((response: any) => {
      this.inventoryFromProduct = response.data
      if (this.inventoryFromProduct.length > 0) {
        this.isProductEnable = true;
        this.isInventoryEnable = true;
      }
    })
  }

  getProductCategory() {
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.category = this.global.tableIndex(categoryName.data);
    })
  }


  printNumber() {
    this.quantity = parseInt(this.sellForm.get('product_quantity').value.split(',').join('')).toLocaleString('en-IN')
  }

  search() {
    if (this.customerName === '') {
      this.customerData = this.customerDataBackup
    } else {
      this.customerData = this.customerDataBackup.filter(res => {
        return res.customer_name.toLowerCase().match(this.customerName.toLowerCase());
      })
    }
  }

  pagination(event) { }

  inventoryChange(event) {
    this.isInventoryEnable = true;
    this.qty = this.stockProduct.find(d => d.inventory_id === event.value && d.product_id === this.productId).quantity
  }

  insertSellDetails() {
    this.sellForm.markAllAsTouched();
    this.isTable = false;
    this.isProgressBar = true;
    this.isDone = true;
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
      this.isProgressBar = false;
      this.isDone = false;
    } else if (Number(this.sellForm.get('product_quantity').value.split(',').join('')) === 0) {
      this.toastr.error("Please enter quantity greater than 0")
      this.isProgressBar = false;
      this.isDone = false;
    }
    else {
      if (this.sellForm.valid && this.isDone === true) {
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
            this.sellData = this.global.tableIndex(getSellDetail.data)
            for (let i = 0; i < this.sellData.length; i++) {
              this.sellData[i].product_quantity = new Intl.NumberFormat('en-IN').format(this.sellData[i].product_quantity)
            }
            // this.isProgressBar = false;
            if (getSellDetail['success']) {
              this.isData = false;
              this.isTable = true;
              this.isProgressBar = false;
            } else if (!getSellDetail['success']) {
              this.isTable = false;
              this.isProgressBar = false;
              this.isData = true;
            }
          })
        })
        this.sellService.productQuantitySubstratct(product_quantity).subscribe(response => {
          // this.toastr.success("");
        })
        this.toastr.success("Sale has been made successfully!");
        this.sellForm.reset();
        // this.isProductEnable = false;
        // this.isInventoryEnable = false;
        document.getElementById('collapseButton').click();
      } else {
        this.isProgressBar = false;
        this.isTable = true;
      }
    }
  }

  cancel() {
    this.isProductEnable = false;
    this.isInventoryEnable = false;
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
        this.isTable = false;
        this.isProgressBar = true;
        this.sellService.deleteSellItem(delete_sell_item_id).subscribe(data => {
          this.sellService.getSell().subscribe((getSellDetail: any) => {
            this.sellData = this.global.tableIndex(getSellDetail.data)
            for (let i = 0; i < this.sellData.length; i++) {
              this.sellData[i].product_quantity = new Intl.NumberFormat('en-IN').format(this.sellData[i].product_quantity)
            }
            this.isProgressBar = false;
            if (this.sellData.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.sellData.length === 0) {
              this.isTable = false;
              this.isData = true;
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