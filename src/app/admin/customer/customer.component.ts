import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CustomerService } from 'app/services/dashboard/customer/customer.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor(
    private titelService: Title,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Customer | Modern Agrichem")
  }

  customerForm: FormGroup;
  updateCustomerForm: FormGroup;

  isProgressBar: boolean;
  isTable: boolean;
  isData: boolean;

  customerDetails = [];
  customerDetailsBackup = [];

  oldCardIndex: any;
  customerName: any;
  customerContact: any
  p: number = 1;
  entriesPerPage: any = '10';
  value = 'Clear me';
  userRole: any;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');

    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

    this.customerService.getCustomer().subscribe((getCustomer: any) => {
      this.customerDetails = this.global.tableIndex(getCustomer.data);
      this.customerDetailsBackup = this.customerDetails;
      this.isProgressBar = false;
      if (this.customerDetails.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.customerDetails.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })

    this.customerForm = this.formBuilder.group({
      customerName: ['', [Validators.required, this.global.noWhitespaceValidator]],
      customerContact: ['', [Validators.required, Validators.pattern('^([-+/*]\d+(\.\d+)?)*')]],
      customerAddress: ['', [Validators.required, this.global.noWhitespaceValidator]],
    })

    this.updateCustomerForm = this.formBuilder.group({
      updateCustomerName: ['', [Validators.required]],
      updateCustomerContact: ['', [Validators.required]],
      updateCustomerAddress: ['', [Validators.required]],
    })
  }

  search() {
    if (this.customerName === '') {
      this.customerDetails = this.customerDetailsBackup
    } else {
      this.customerDetails = this.customerDetailsBackup.filter(res => {
        return res.customer_name.toLowerCase().match(this.customerName.toLowerCase());
      })
    }
  }

  pagination(event) {
  }

  saveData() {
    this.isTable = false;
    this.isProgressBar = true;
    if (this.customerForm.valid) {
      let customerDetails = {
        'customer_name': this.customerForm.get('customerName').value,
        'customer_contact': this.customerForm.get('customerContact').value,
        'customer_address': this.customerForm.get('customerAddress').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.customerService.createCustomer(customerDetails).subscribe(data => {
        this.customerService.getCustomer().subscribe((customerInfo: any) => {
          this.customerDetails = this.global.tableIndex(customerInfo.data);
          this.isProgressBar = false;
          if (this.customerDetails.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.customerDetails.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success('Customer Details ' + this.customerForm.get('customerName').value + ' add successfully');
      this.customerForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
      this.toastr.error('Please input the all field');
    }
  }

  editCustomer(customerId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById("customerInfo" + this.oldCardIndex).classList.remove('show')
        this.oldCardIndex = cardIndex
      }
    }
    let editData = this.customerDetails.find(d => d.customer_id === customerId)
    this.updateCustomerForm.patchValue({
      updateCustomerName: editData.customer_name,
      updateCustomerContact: editData.customer_contact,
      updateCustomerAddress: editData.customer_address
    })
  }

  updateCustomer(customer_id) {
    let updateCustomerInfo = {
      'customer_id': customer_id,
      'customer_name': this.updateCustomerForm.get('updateCustomerName').value,
      'customer_contact': this.updateCustomerForm.get('updateCustomerContact').value,
      'customer_address': this.updateCustomerForm.get('updateCustomerAddress').value,
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
      title: 'Are you sure want to update ' + this.updateCustomerForm.get('updateCustomerName').value + ' Customer Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateCustomerForm.get('updateCustomerName').value || this.updateCustomerForm.get('updateCustomerContact').value || this.updateCustomerForm.get('updateCustomerAddress').value) {
          this.isTable = false;
          this.isProgressBar = true;
          this.customerService.updateCustomer(updateCustomerInfo).subscribe((data) => {
            this.customerService.getCustomer().subscribe((customerInfo: any) => {
              this.customerDetails = this.global.tableIndex(customerInfo.data);
              this.isProgressBar = false;
              if (this.customerDetails.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.customerDetails.length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
            this.toastr.success("Customer Info " + this.updateCustomerForm.get('updateCustomerName').value + " successfully updated!")
            this.updateCustomerForm.reset();
            Swal.fire({
              icon: 'success',
              title: "Customer Details has been Updated.",
              showConfirmButton: false,
              timer: 1500
            })
          },
            (err) => {
              this.toastr.error("Something went wrong, Please Relaod page and try again!")
            }
          )
        }
        else {
          this.toastr.error("Plese enter valid input")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Customer Information is unchanged.',
          'error'
        )
      }
    })
  }

  deleteCustomer(customer_id, customer_name) {
    let deleteCustomer = {
      'customer_id': customer_id,
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
      title: 'Are you sure want to ' + customer_name + ' delete Customer?',
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
        this.customerService.deleteCustomer(deleteCustomer).subscribe(data => {
          this.customerService.getCustomer().subscribe((customerInfo: any) => {
            this.customerDetails = this.global.tableIndex(customerInfo.data);
            this.isProgressBar = false;
            if (this.customerDetails.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.customerDetails.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'warning',
          title: "Customer Details has been Deleted.",
          showConfirmButton: false,
          timer: 1500
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Customer Details is safe.',
          'error'
        )
      }
    })
  }
}