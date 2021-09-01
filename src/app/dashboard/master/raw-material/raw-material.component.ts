import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.scss']
})
export class RawMaterialComponent implements OnInit {

  constructor(
    private titelService: Title,
    private rawMaterialService: RawMaterialService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Raw Material | Modern Agrichem")
  }

  isSubmitted: boolean = false;
  buttons: boolean = false;
  isProgressBar: boolean;
  is_data: boolean;
  is_table: boolean;

  input_number: any;

  isCollapsed: boolean;

  rawMaterialForm: FormGroup;
  updatedRawMaterialForm: FormGroup;

  arr_raw_data = [];
  arr_raw_data_backup = [];

  raw_material_name;

  p: any = '1';
  entries_per_page: any = '10';
  value = 'Clear me';
  old_card_index: any;
  card_name = null;
  // user_role: any;

  importRawMaterialData = {
    raw_material_id: null,
    raw_material_quantity: null
  }

  protected _onDestroy = new Subject<void>();
  public raw_material_FilterCtrl: FormControl = new FormControl();
  public filtered_raw_material_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  unit: any;

  ngOnInit(): void {
    this.is_table = false;
    this.isProgressBar = true;
    this.is_data = false;

    this.rawMaterialForm = this.formBuilder.group({
      raw_material_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      raw_material_unit: ['', [Validators.required]],
    })

    this.updatedRawMaterialForm = this.formBuilder.group({
      update_raw_material_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      update_raw_material_unit: ['', [Validators.required]],
    })

    this.getRawMaterial();
  }

  getRawMaterial() {
    this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
      this.arr_raw_data = this.global.tableIndex(getRawMaterial.data)
      for (let i = 0; i < this.arr_raw_data.length; i++) {
        this.arr_raw_data[i].raw_material_quantity = this.global.tableComma(this.arr_raw_data[i].raw_material_quantity)
      }
      this.arr_raw_data_backup = this.arr_raw_data
      this.isProgressBar = false;
      if (this.arr_raw_data.length > 0) {
        this.is_data = false;
        this.is_table = true;
      } else if (this.arr_raw_data.length === 0) {
        this.is_table = false;
        this.is_data = true;
      }
      this.filtered_raw_material_name.next(getRawMaterial.data.slice());
      this.raw_material_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })
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

  pagination(event) {
  }

  insertRawMaterial() {
    this.is_table = false;
    this.isProgressBar = true;
    if (this.rawMaterialForm.valid) {
      this.isCollapsed = true;
      let rawMaterial = {
        'raw_material_name': this.rawMaterialForm.get('raw_material_name').value,
        'raw_material_unit': this.rawMaterialForm.get('raw_material_unit').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone(),
      }
      this.rawMaterialService.createRawMaterial(rawMaterial).subscribe(data => {
        this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
          this.arr_raw_data = this.global.tableIndex(getRawMaterial.data)
          for (let i = 0; i < this.arr_raw_data.length; i++) {
            this.arr_raw_data[i].raw_material_quantity = this.global.tableComma(this.arr_raw_data[i].raw_material_quantity)
          }
          this.isProgressBar = false;
          if (this.arr_raw_data.length > 0) {
            this.is_data = false;
            this.is_table = true;
          } else if (this.arr_raw_data.length === 0) {
            this.is_table = false;
            this.is_data = true;
          }
        })
      })
      this.toastr.success("Raw Material " + this.rawMaterialForm.get('raw_material_name').value + " added successfully.");
      this.rawMaterialForm.reset();
      document.getElementById('collapseButton').click();
    }
    else {
      this.isCollapsed = false;
      this.isProgressBar = false;
      this.is_table = true;
      this.toastr.error("Please enter valid data.");
    }
  }

  editRawMaterial(raw_material_id, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("rawmaterialInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }
    let editData = this.arr_raw_data.find(d => d.raw_material_id === raw_material_id)
    this.updatedRawMaterialForm.patchValue({
      update_raw_material_name: editData.raw_material_name,
      update_raw_material_unit: editData.raw_material_unit
    })
  }

  updateRawMaterialInfo(rawMaterialId) {
    let updateRawMaterialInfo = {
      'raw_material_id': rawMaterialId,
      'raw_material_name': this.updatedRawMaterialForm.get('update_raw_material_name').value,
      'raw_material_unit': this.updatedRawMaterialForm.get('update_raw_material_unit').value,
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
      title: 'Are you sure want to update ' + this.updatedRawMaterialForm.get('update_raw_material_name').value + ' Raw Material Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updatedRawMaterialForm.get('update_raw_material_name').value && this.updatedRawMaterialForm.get('update_raw_material_unit').value) {
          this.is_table = false;
          this.isProgressBar = true;
          this.rawMaterialService.updateRawMaterial(updateRawMaterialInfo).subscribe((data) => {
            this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
              this.arr_raw_data = this.global.tableIndex(getRawMaterial.data)
              for (let i = 0; i < this.arr_raw_data.length; i++) {
                this.arr_raw_data[i].raw_material_quantity = this.global.tableComma(this.arr_raw_data[i].raw_material_quantity)
              }
              this.isProgressBar = false;
              if (this.arr_raw_data.length > 0) {
                this.is_data = false;
                this.is_table = true;
              } else if (this.arr_raw_data.length === 0) {
                this.is_table = false;
                this.is_data = true;
              }
            });
            this.rawMaterialService.updateImportRawMaterial(updateRawMaterialInfo).subscribe((updateImportRawMaterialInfo: any) => {
            })
            this.toastr.success(this.updatedRawMaterialForm.get('update_raw_material_name').value + " Raw Material Successfully updated!")
            this.updatedRawMaterialForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Raw Material has beeen updated.',
              showConfirmButton: false,
              timer: 1500,
            })
          },
            (err) => {
              this.toastr.success("Something went wrong, Relaod the page and try again.")
            })
        }
        else {
          this.toastr.error("Please enter Updated Name and Unit.")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Raw Material is unchanged.',
          'error'
        )
      }
    })
  }

  deleteUpdateRawMaterialData(rawMaterialId, rawMaterialName) {
    let deletData = {
      'raw_material_id': rawMaterialId,
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
      title: 'Are you sure want to delete Raw Material ' + rawMaterialName + '?',
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
        this.rawMaterialService.deleteUpdateRawMaterial(deletData).subscribe(data => {
          this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
            this.arr_raw_data = this.global.tableIndex(getRawMaterial.data)
            for (let i = 0; i < this.arr_raw_data.length; i++) {
              this.arr_raw_data[i].raw_material_quantity = this.global.tableComma(this.arr_raw_data[i].raw_material_quantity)
            }
            this.isProgressBar = false;
            if (this.arr_raw_data.length > 0) {
              this.is_data = false;
              this.is_table = true;
            } else if (this.arr_raw_data.length === 0) {
              this.is_table = false;
              this.is_data = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Raw Material ' + rawMaterialName + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Raw Mterial  is safe :)',
          'error'
        )
      }
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.arr_raw_data) {
      return;
    }
    // get the search keyword
    let search = this.raw_material_FilterCtrl.value;
    if (!search) {
      this.filtered_raw_material_name.next(this.arr_raw_data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_raw_material_name.next(
      this.arr_raw_data.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_raw_material_name.subscribe(d => {
    })
  }
}