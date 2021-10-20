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
  isData: boolean;
  isTable: boolean;

  input_number: any;

  isCollapsed: boolean;

  rawMaterialForm: FormGroup;
  updatedRawMaterialForm: FormGroup;

  rawMaterialData = [];
  rawMaterialDataBackup = [];

  rawMaterialName;

  userRole: any;

  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  oldCardIndex: any;
  // user_role: any;

  importRawMaterialData = {
    raw_material_id: null,
    raw_material_quantity: null
  }

  protected onDestroy = new Subject<void>();
  public rawMaterialFilterCtrl: FormControl = new FormControl();
  public filteredRawMaterialName: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  unit: any;

  ngOnInit(): void {
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

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
      this.rawMaterialData = this.global.tableIndex(getRawMaterial.data)
      for (let i = 0; i < this.rawMaterialData.length; i++) {
        this.rawMaterialData[i].raw_material_quantity = this.global.tableComma(this.rawMaterialData[i].raw_material_quantity)
      }
      this.rawMaterialDataBackup = this.rawMaterialData
      this.isProgressBar = false;
      if (this.rawMaterialData.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.rawMaterialData.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
      this.filteredRawMaterialName.next(getRawMaterial.data.slice());
      this.rawMaterialFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })
  }

  search() {
    if (this.rawMaterialName === '') {
      this.rawMaterialData = this.rawMaterialDataBackup
    } else {
      this.rawMaterialData = this.rawMaterialDataBackup.filter(res => {
        return res.raw_material_name.toLowerCase().match(this.rawMaterialName.toLowerCase());
      })
    }
  }

  pagination(event) {
  }

  insertRawMaterial() {
    this.isTable = false;
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
          this.rawMaterialData = this.global.tableIndex(getRawMaterial.data)
          for (let i = 0; i < this.rawMaterialData.length; i++) {
            this.rawMaterialData[i].raw_material_quantity = this.global.tableComma(this.rawMaterialData[i].raw_material_quantity)
          }
          this.isProgressBar = false;
          if (this.rawMaterialData.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.rawMaterialData.length === 0) {
            this.isTable = false;
            this.isData = true;
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
      this.isTable = true;
      this.toastr.error("Please enter valid data.");
    }
  }

  editRawMaterial(raw_material_id, card_index) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = card_index
    } else {
      if (this.oldCardIndex !== card_index) {
        let id = document.getElementById("rawmaterialInfo" + this.oldCardIndex).classList.remove('show')
        this.oldCardIndex = card_index
      }
    }
    let editData = this.rawMaterialData.find(d => d.raw_material_id === raw_material_id)
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
          this.isTable = false;
          this.isProgressBar = true;
          this.rawMaterialService.updateRawMaterial(updateRawMaterialInfo).subscribe((data) => {
            this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
              this.rawMaterialData = this.global.tableIndex(getRawMaterial.data)
              for (let i = 0; i < this.rawMaterialData.length; i++) {
                this.rawMaterialData[i].raw_material_quantity = this.global.tableComma(this.rawMaterialData[i].raw_material_quantity)
              }
              this.isProgressBar = false;
              if (this.rawMaterialData.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.rawMaterialData.length === 0) {
                this.isTable = false;
                this.isData = true;
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
        this.isTable = false;
        this.isProgressBar = true;
        this.rawMaterialService.deleteUpdateRawMaterial(deletData).subscribe(data => {
          this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
            this.rawMaterialData = this.global.tableIndex(getRawMaterial.data)
            for (let i = 0; i < this.rawMaterialData.length; i++) {
              this.rawMaterialData[i].raw_material_quantity = this.global.tableComma(this.rawMaterialData[i].raw_material_quantity)
            }
            this.isProgressBar = false;
            if (this.rawMaterialData.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.rawMaterialData.length === 0) {
              this.isTable = false;
              this.isData = true;
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
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.rawMaterialData) {
      return;
    }
    // get the search keyword
    let search = this.rawMaterialFilterCtrl.value;
    if (!search) {
      this.filteredRawMaterialName.next(this.rawMaterialData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredRawMaterialName.next(
      this.rawMaterialData.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredRawMaterialName.subscribe(d => {
    })
  }
}