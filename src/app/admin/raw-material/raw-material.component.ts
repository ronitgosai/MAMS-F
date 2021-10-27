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
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  name: string;
};
@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.scss']
})


export class RawMaterialComponent implements OnInit {

  dataSource: MatTableDataSource<UserData>;

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

  isDataImport: boolean;
  isTableImport: boolean;
  isProgressBarImport: boolean;
  isCollapsed: boolean;

  rawMaterialForm: FormGroup;
  updatedRawMaterialForm: FormGroup;
  importRawMaterialForm: FormGroup;

  RawMaterialData = [];
  RawMaterialDataBackup = [];
  importRawMaterialData = [];
  importRawMaterialDataBackup = [];

  rawMaterialName;
  importRawMaterialName;

  p: any = '1';
  pImport: any = '1';
  entriesPerPage: any = '10';
  entriesPerPageImport: any = '10';
  value = 'Clear me';
  value1 = 'Clear me';
  oldCardIndex: any;
  card_name = null;
  // user_role: any;

  importRawMaterialDataObject = {
    rawMaterialId: null,
    rawMaterialQuantity: null
  }

  protected onDestroy = new Subject<void>();
  public rawMaterialFilterCtrl: FormControl = new FormControl();
  public filteredRawMaterialName: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  unit: any;

  ngOnInit(): void {
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

    this.isTableImport = false;
    this.isProgressBarImport = true;
    this.isDataImport = false;

    this.rawMaterialForm = this.formBuilder.group({
      raw_material_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      raw_material_unit: ['', [Validators.required]],
    })

    this.updatedRawMaterialForm = this.formBuilder.group({
      update_raw_material_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      update_raw_material_unit: ['', [Validators.required]],
    })

    this.importRawMaterialForm = this.formBuilder.group({
      raw_material_id_import: [''],
      import_raw_material_name: ['', [Validators.required]],
      raw_material_quantity: ['', [Validators.required]],
      import_raw_material_unit: [''],
      import_raw_material_date: ['', [Validators.required]]
    })

    this.getRawMaterial();
    this.getImportRawMaterial();
  }

  printNumber() {
    this.unit = Number(this.importRawMaterialForm.get('raw_material_quantity').value.split(',').join('')).toLocaleString('en-IN');
  }

  getRawMaterial() {
    this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
      this.RawMaterialData = this.global.tableIndex(getRawMaterial.data);
      this.RawMaterialData.map((d, i) => {
      })
      for (let i = 0; i < this.RawMaterialData.length; i++) {
        this.RawMaterialData[i].raw_material_quantity = this.global.tableComma(this.RawMaterialData[i].raw_material_quantity)
      }
      this.RawMaterialDataBackup = this.RawMaterialData
      this.isProgressBar = false;
      if (this.RawMaterialData.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.RawMaterialData.length === 0) {
        this.isData = true;
        this.isTable = false;
      }
      this.filteredRawMaterialName.next(getRawMaterial.data.slice());
      this.rawMaterialFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })
  }

  getImportRawMaterial() {
    this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
      this.importRawMaterialData = this.global.tableIndex(getImportRawMaterial.data)
      for (let i = 0; i < this.importRawMaterialData.length; i++) {
        this.importRawMaterialData[i].raw_material_quantity = this.global.tableComma(this.importRawMaterialData[i].raw_material_quantity)
      }
      this.importRawMaterialDataBackup = this.importRawMaterialData
      this.isProgressBarImport = false;
      if (this.importRawMaterialData.length > 0) {
        this.isTableImport = true;
        this.isDataImport = false;
      } else if (this.importRawMaterialData.length === 0) {
        this.isTableImport = false;
        this.isDataImport = true;
      }
    })
  }

  search() {
    if (this.rawMaterialName === '') {
      this.RawMaterialData = this.RawMaterialDataBackup
    } else {
      this.RawMaterialData = this.RawMaterialDataBackup.filter(res => {
        return res.raw_material_name.toLowerCase().match(this.rawMaterialName.toLowerCase());
      })
    }
  }

  searchImport() {
    if (this.importRawMaterialName === '') {
      this.importRawMaterialData = this.importRawMaterialDataBackup
    } else {
      this.importRawMaterialData = this.importRawMaterialDataBackup.filter(res => {
        return res.import_raw_material_name.toLowerCase().match(this.importRawMaterialName.toLowerCase());
      })
    }
  }

  pagination(event) {
  }

  paginationImport(event) {
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
          this.RawMaterialData = this.global.tableIndex(getRawMaterial.data)
          for (let i = 0; i < this.RawMaterialData.length; i++) {
            this.RawMaterialData[i].raw_material_quantity = this.global.tableComma(this.RawMaterialData[i].raw_material_quantity)
          }
          this.isProgressBar = false;
          if (this.RawMaterialData.length > 0) {
            this.isTable = true;
            this.isData = false;
          } else if (this.RawMaterialData.length === 0) {
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
      this.toastr.error("Please input valid data.");
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
    let editData = this.RawMaterialData.find(d => d.raw_material_id === raw_material_id)
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
          this.isTableImport = false;
          this.isProgressBarImport = true;
          this.rawMaterialService.updateRawMaterial(updateRawMaterialInfo).subscribe((data) => {
            this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
              this.RawMaterialData = this.global.tableIndex(getRawMaterial.data)
              for (let i = 0; i < this.RawMaterialData.length; i++) {
                this.RawMaterialData[i].raw_material_quantity = this.global.tableComma(this.RawMaterialData[i].raw_material_quantity)
              }
              this.isProgressBar = false;
              if (this.RawMaterialData.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.RawMaterialData.length === 0) {
                this.isData = true;
                this.isTable = false;
              }
            });
            this.rawMaterialService.updateImportRawMaterial(updateRawMaterialInfo).subscribe((updateImportRawMaterialInfo: any) => {
              this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
                this.importRawMaterialData = this.global.tableIndex(getImportRawMaterial.data)
                for (let i = 0; i < this.importRawMaterialData.length; i++) {
                  this.importRawMaterialData[i].raw_material_quantity = this.global.tableComma(this.importRawMaterialData[i].raw_material_quantity)
                }
                this.importRawMaterialDataBackup = this.importRawMaterialData
                this.isProgressBarImport = false;
                if (this.importRawMaterialData.length > 0) {
                  this.isTableImport = true;
                  this.isDataImport = false;
                } else if (this.importRawMaterialData.length === 0) {
                  this.isTableImport = false;
                  this.isDataImport = true;
                }
              })
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
            this.RawMaterialData = this.global.tableIndex(getRawMaterial.data)
            for (let i = 0; i < this.RawMaterialData.length; i++) {
              this.RawMaterialData[i].raw_material_quantity = this.global.tableComma(this.RawMaterialData[i].raw_material_quantity)
            }
            this.isProgressBar = false;
            if (this.RawMaterialData.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.RawMaterialData.length === 0) {
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

  importRawMaterialChange(event) {
    this.importRawMaterialForm.patchValue({
      raw_material_id_import: this.RawMaterialData.find(d => d.raw_material_name === event.value).raw_material_id,
      import_raw_material_unit: this.RawMaterialData.find(d => d.raw_material_name === event.value).raw_material_unit,
    })
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.RawMaterialData) {
      return;
    }
    // get the search keyword
    let search = this.rawMaterialFilterCtrl.value;
    if (!search) {
      this.filteredRawMaterialName.next(this.RawMaterialData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredRawMaterialName.next(
      this.RawMaterialData.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredRawMaterialName.subscribe(d => {
    })
  }

  importRawMaterial() {
    this.isTable = false;
    this.isProgressBarImport = true;
    if (this.importRawMaterialForm.valid) {
      let importRawMaterial = {
        'raw_material_id_import': this.importRawMaterialForm.get('raw_material_id_import').value,
        'import_raw_material_name': this.importRawMaterialForm.get('import_raw_material_name').value,
        'raw_material_quantity': Number(this.importRawMaterialForm.get('raw_material_quantity').value.split(',').join('')),
        'import_raw_material_unit': this.importRawMaterialForm.get('import_raw_material_unit').value,
        'import_raw_material_date': this.importRawMaterialForm.get('import_raw_material_date').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      let importRawMaterialData = {
        'raw_material_id': this.importRawMaterialForm.get('raw_material_id_import').value,
        'raw_material_quantity': Number(this.importRawMaterialForm.get('raw_material_quantity').value.split(',').join('')),
        'updated_date': this.global.getDateZone(),
        'updated_time': this.global.getTimeZone()
      }
      this.rawMaterialService.createImportRawMaterial(importRawMaterial).subscribe(data => {
        this.rawMaterialService.updateRawMaterialQuantityAdd(importRawMaterialData).subscribe(data => {
          this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
            this.RawMaterialData = this.global.tableIndex(getRawMaterial.data);
            for (let i = 0; i < this.RawMaterialData.length; i++) {
              this.RawMaterialData[i].raw_material_quantity = this.global.tableComma(this.RawMaterialData[i].raw_material_quantity)
            }
            this.isProgressBar = false;
            if (this.RawMaterialData.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.RawMaterialData.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          });
          this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
            this.importRawMaterialData = this.global.tableIndex(getImportRawMaterial.data);
            for (let i = 0; i < this.importRawMaterialData.length; i++) {
              this.importRawMaterialData[i].raw_material_quantity = this.global.tableComma(this.importRawMaterialData[i].raw_material_quantity)
            }
            this.isProgressBarImport = false;
            if (this.importRawMaterialData.length > 0) {
              this.isTableImport = true;
              this.isDataImport = false;
            } else if (this.importRawMaterialData.length === 0) {
              this.isTableImport = false;
              this.isDataImport = true;
            }
          });
        })
      })
      this.toastr.success("Product " + this.importRawMaterialForm.get('import_raw_material_name').value + " of quantity " + this.importRawMaterialForm.get('raw_material_quantity').value + " added successfully.")
      this.importRawMaterialForm.reset()
      document.getElementById('collapseCard').click();
    } else {
      this.isTableImport = true;
      this.isProgressBarImport = false;
      this.toastr.error("Please input valid data.");
    }
  }

  deleteImportRawMaterial(raw_material_id, tbl_import_raw_material_id, import_raw_material_name, import_raw_material_quantity, import_raw_material_date) {
    let deletData = {
      'tbl_import_raw_material_id': tbl_import_raw_material_id,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    let importRawMaterialData = {
      'raw_material_id': raw_material_id,
      'raw_material_quantity': Number(import_raw_material_quantity.split(',').join('')),
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    let formattedDate = (moment(import_raw_material_date)).format('DD-MMM-YYYY')

    let sweetalerttext = "Are you sure want to delete the imported raw material " + import_raw_material_name + ', imported on the date ' + formattedDate + 'with the imported quantity ' + import_raw_material_quantity + '?';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Delete Imported Raw Material',
      text: sweetalerttext,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isTableImport = false;
        this.isProgressBarImport = true;
        this.importRawMaterialDataObject.rawMaterialId = raw_material_id;
        this.importRawMaterialDataObject.rawMaterialQuantity = import_raw_material_quantity;
        this.rawMaterialService.updateRawMaterialQuantitySubstract(importRawMaterialData).subscribe(data => {
          this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
            this.RawMaterialData = this.global.tableIndex(getRawMaterial.data)
            for (let i = 0; i < this.RawMaterialData.length; i++) {
              this.RawMaterialData[i].raw_material_quantity = this.global.tableComma(this.RawMaterialData[i].raw_material_quantity)
            }
            this.isProgressBar = false;
            if (this.RawMaterialData.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.RawMaterialData.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
          this.rawMaterialService.deleteImportRawMaterial(deletData).subscribe(data => {
            this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
              this.importRawMaterialData = this.global.tableIndex(getImportRawMaterial.data)
              for (let i = 0; i < this.importRawMaterialData.length; i++) {
                this.importRawMaterialData[i].raw_material_quantity = this.global.tableComma(this.importRawMaterialData[i].raw_material_quantity)
              }
              this.isProgressBarImport = false;
              if (this.importRawMaterialData.length > 0) {
                this.isTableImport = true;
                this.isDataImport = false;
              } else if (this.importRawMaterialData.length === 0) {
                this.isTableImport = false;
                this.isDataImport = true;
              }
            })
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Import Raw Material ' + import_raw_material_name + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Imported Raw Material' + import_raw_material_name + ' is safe.',
          'error'
        )
      }
    })
  }
}