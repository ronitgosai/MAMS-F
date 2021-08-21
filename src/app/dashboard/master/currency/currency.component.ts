import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CurrencyService } from 'app/services/dashboard/master/currency.service';
import { NetWorkServiceProviderService } from 'app/services/dashboard/master/NetWorkServiceProvider.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private currencyService: CurrencyService,
    private global: GlobalService,
    private toastr: ToastrService,
    private titelService: Title,
  ) {
    titelService.setTitle("Network Service Provider | Modern Agrichem")
  }

  currencyForm: FormGroup;
  updateCurrencyForm: FormGroup;

  currency = [];
  currencyBackup = [];

  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';
  currencyName: any;
  old_card_index: any;

  ngOnInit(): void {
    this.currencyForm = this.formBuilder.group({
      currencyName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })

    this.updateCurrencyForm = this.formBuilder.group({
      updateCurrencyName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })
    this.getCurrency();
  }

  getCurrency() {
    this.currencyService.getCurrency().subscribe((masterCurrency: any) => {
      this.currency = this.global.tableIndex(masterCurrency.data);
      this.currencyBackup = this.currency;
      this.isProgressBar = false;
      if (this.currency.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.currency.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  search() {
    if (this.currencyName === '') {
      this.currency = this.currencyBackup
    } else {
      this.currency = this.currencyBackup.filter(res => {
        return res.currency_name.toLowerCase().match(this.currencyName.toLowerCase());
      })
    }
  }

  pagination(event) { }

  insertCurrency() {
    this.isTable = false;
    this.isProgressBar = true;
    if (this.currencyForm.valid) {
      let currencyInfo = {
        'currency_name': this.currencyForm.get('currencyName').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.currencyService.createCurrency(currencyInfo).subscribe(generateCurrency => {
        this.currencyService.getCurrency().subscribe((masterCurrency: any) => {
          this.currency = this.global.tableIndex(masterCurrency.data)
          this.isProgressBar = false;
          if (this.currency.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.currency.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success("Currency" + this.currencyForm.get('currencyName').value + " added successfully.");
      this.currencyForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
      this.toastr.error("Please input valid data.");
    }
  }

  editCurrency(currencyId, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("currencyInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }
    let editData = this.currency.find(d => d.currency_id === currencyId)
    this.updateCurrencyForm.patchValue({
      updateCurrencyName: editData.currency_name,
    })
  }

  updateCurrency(currencyId, currencyName) {
    let updateCurrency = {
      'currency_id': currencyId,
      'currency_name': this.updateCurrencyForm.get('updateCurrencyName').value,
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
      title: 'Are you sure want to update ' + this.updateCurrencyForm.get('updateCurrencyName').value + ' Currency Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateCurrencyForm.get('updateCurrencyName').value) {
          this.isTable = false;
          this.isProgressBar = true;
          this.currencyService.updateCurrency(updateCurrency).subscribe((data) => {
            this.currencyService.getCurrency().subscribe((masterCurrency: any) => {
              this.currency = this.global.tableIndex(masterCurrency.data)
              this.isProgressBar = false;
              if (this.currency.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.currency.length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
            this.toastr.success(this.updateCurrencyForm.get('updateCurrencyName').value + " Currency Name Successfully updated!")
            this.updateCurrencyForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Currency has beeen updated.',
              showConfirmButton: false,
              timer: 1500,
            })
          },
            (err) => {
              this.toastr.error("Something went wrong, Relaod the page and try again.")
            })
        }
        else {
          this.toastr.error("Please enter Updated Name.")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Currency is unchanged.',
          'error'
        )
      }
    })
  }

  deleteCurrency(currencyId, currencyName) {
    let deletData = {
      'currency_id': currencyId,
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
      title: 'Are you sure want to delete Currency ' + currencyName + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProgressBar = true;
        this.currencyService.deleteCurrency(deletData).subscribe(data => {
          this.currencyService.getCurrency().subscribe((masterCurrency: any) => {
            this.currency = this.global.tableIndex(masterCurrency.data)
            this.isProgressBar = false;
            if (this.currency.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.currency.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Currency ' + currencyName + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Currency  is safe :)',
          'error'
        )
      }
    })
  }
}