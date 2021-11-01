import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { InventoryService } from "app/services/dashboard/inventory/inventory.service";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { GlobalService } from "app/services/global.service";
@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent implements OnInit {
  constructor(
    private titelService: Title,
    private inventoryService: InventoryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Inventory | Modern Agrichem");
  }
  date = new Date();

  isSubmitted: boolean = false;
  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;

  isProgressBarImport: boolean;
  isDataImport: boolean;
  isTableImport: boolean;

  inventoryForm: FormGroup;
  updateInventoryForm: FormGroup;
  importInventoryForm: FormGroup;

  inventoryInfo = [];
  inventoryInfoBackup = [];
  importInventoryInfo = [];

  qty: any;
  inventoryName: any;
  p: number = 1;
  pImport: number = 1;
  value = 'Clear me';
  entriesPerPage: any = '10';
  entriesPerPageImport: any = '10';

  importInventoryData = {
    inventoryId: null,
    inventoryQuantity: null
  }

  oldCardIndex: any;

  protected _onDestroy = new Subject<void>();
  public inventoryFilterCtrl: FormControl = new FormControl();
  public filteredInventoryName: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  // user_role: any;
  ngOnInit(): void {
    // this.user_role = localStorage.getItem('role');
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

    this.isTableImport = false;
    this.isProgressBarImport = true;
    this.isDataImport = false;

    this.inventoryForm = this.formBuilder.group({
      inventoryName: ["", [Validators.required, this.global.noWhitespaceValidator]],
      inventoryUnit: ["", [Validators.required]],
      productForm: ["", [Validators.required]],
    });

    this.updateInventoryForm = this.formBuilder.group({
      updateInventoryName: [""],
      updateInventoryUnit: [""],
      updateProductForm: [""],
    });

    this.importInventoryForm = this.formBuilder.group({
      inventoryIdImport: [""],
      importInventoryName: ["", [Validators.required]],
      inventoryQuantity: ["", [Validators.required]],
      inventoryUnit: [""],
      importInventoryDate: ["", [Validators.required]],
    });

    this.getInventory();
    this.getImportInventory();
  }

  getInventory() {
    this.inventoryService.getInventory().subscribe((inventoryInfo: any) => {
      this.inventoryInfo = this.global.tableIndex(inventoryInfo.data);
      for (let i = 0; i < this.inventoryInfo.length; i++) {
        this.inventoryInfo[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.inventoryInfo[i].inventory_quantity)
      }
      this.inventoryInfoBackup = this.inventoryInfo;
      this.isProgressBar = false;
      if (this.inventoryInfo.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.inventoryInfo.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
      this.filteredInventoryName.next(inventoryInfo.data.slice());
      this.inventoryFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    });
  }

  getImportInventory() {
    this.inventoryService.getImportInvetory().subscribe((importInventoryInfo: any) => {
      this.importInventoryInfo = this.global.tableIndex(importInventoryInfo.data);
      for (let i = 0; i < this.importInventoryInfo.length; i++) {
        this.importInventoryInfo[i].import_inventory_quantity = new Intl.NumberFormat('en-IN').format(this.importInventoryInfo[i].import_inventory_quantity)
      }
      this.isProgressBarImport = false;
      if (this.importInventoryInfo.length > 0) {
        this.isDataImport = false;
        this.isTableImport = true;
      } else if (this.importInventoryInfo.length === 0) {
        this.isTableImport = false;
        this.isDataImport = true;
      }
    });
  }

  printNumber() {
    this.qty = Number(this.importInventoryForm.get('inventoryQuantity').value.split(',').join('')).toLocaleString('en-IN')
  }

  search() {
    if (this.inventoryName === '') {
      this.inventoryInfo = this.inventoryInfoBackup
    } else {
      this.inventoryInfo = this.inventoryInfoBackup.filter(res => {
        return res.inventory_name.toLowerCase().match(this.inventoryName.toLowerCase());
      })
    }
  }

  pagination(event) {
  }

  paginationImport(event) {
  }

  insertInventory() {
    this.inventoryForm.markAllAsTouched();
    this.isTable = false;
    this.isProgressBar = true;
    if (this.inventoryForm.valid) {
      let inventory = {
        'inventory_name': this.inventoryForm.get('inventoryName').value,
        'inventory_unit': this.inventoryForm.get('inventoryUnit').value,
        'product_form': this.inventoryForm.get('productForm').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone(),
      }
      this.inventoryService.createInventory(inventory).subscribe((data) => {
        this.inventoryService.getInventory().subscribe((inventoryInfo: any) => {
          this.inventoryInfo = this.global.tableIndex(inventoryInfo.data);
          for (let i = 0; i < this.inventoryInfo.length; i++) {
            this.inventoryInfo[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.inventoryInfo[i].inventory_quantity)
          }
          this.isProgressBar = false;
          if (this.inventoryInfo.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.inventoryInfo.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        });
      });
      this.toastr.success("Inventory " + this.inventoryForm.get("inventoryName").value + " added successfully.");
      this.inventoryForm.reset();
      document.getElementById('collapse').click();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
    }
  }

  editInventory(inventoryId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById("invnetoryInfo" + this.oldCardIndex).classList.remove('show')
        this.oldCardIndex = cardIndex
      }
    }
    let editData = this.inventoryInfo.find(d => d.inventory_id === inventoryId)
    this.updateInventoryForm.patchValue({
      updateInventoryName: editData.inventory_name,
      updateInventoryUnit: editData.inventory_unit
    })
  }

  updateInventory(inventory_id) {
    let updateInventoryInfo = {
      'inventory_id': inventory_id,
      'inventory_name': this.updateInventoryForm.get("updateInventoryName").value,
      'inventory_unit': this.updateInventoryForm.get("updateInventoryUnit").value,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    };

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure want to update " + this.updateInventoryForm.get("updateInventoryName").value + " Inventory Information?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (this.updateInventoryForm.get("updateInventoryName").value || this.updateInventoryForm.get("updateInventoryUnit").value) {
            this.isTable = false;
            this.isProgressBar = true;
            this.inventoryService.updateInventory(updateInventoryInfo).subscribe((data) => {
              this.inventoryService.getInventory().subscribe((getInventory: any) => {
                this.inventoryInfo = this.global.tableIndex(getInventory.data);
                for (let i = 0; i < this.inventoryInfo.length; i++) {
                  this.inventoryInfo[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.inventoryInfo[i].inventory_quantity)
                }
                this.isProgressBar = false;
                if (this.inventoryInfo.length > 0) {
                  this.isData = false;
                  this.isTable = true;
                } else if (this.inventoryInfo.length === 0) {
                  this.isTable = false;
                  this.isData = true;
                }
              });
              this.inventoryService.updateImportInventory(updateInventoryInfo).subscribe(updateInventoryInfo => {
                this.inventoryService.getImportInvetory().subscribe((getImportInventory: any) => {
                  this.importInventoryInfo = this.global.tableIndex(getImportInventory.data);
                  for (let i = 0; i < this.importInventoryInfo.length; i++) {
                    this.importInventoryInfo[i].import_inventory_quantity = new Intl.NumberFormat('en-IN').format(this.importInventoryInfo[i].import_inventory_quantity)
                  }
                  this.isProgressBarImport = false;
                  if (this.importInventoryInfo.length > 0) {
                    this.isDataImport = false;
                    this.isTableImport = true;
                  } else if (this.importInventoryInfo.length === 0) {
                    this.isTableImport = false;
                    this.isDataImport = true;
                  }
                });
              })
              this.toastr.success("Inventory " + this.updateInventoryForm.get("updateInventoryName").value + " Successfully updated!");
              this.updateInventoryForm.reset();
              Swal.fire({
                icon: 'success',
                title: "Inventory has beeen updated.",
                showConfirmButton: false,
                timer: 1500,
              })
            }, (err) => {
              this.toastr.error("Something went wrong, Please Relaod page and try again!");
            }
            );
          } else {
            this.toastr.error("Please enter Updated Name and Unit.");
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Inventory are unchanged ",
            "error"
          );
        }
      }
      );
  }

  deleteInventory(deleteInventoryId, inventoryName) {
    let deleteInventory = {
      'inventory_id': deleteInventoryId,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    };
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure want to " + inventoryName + " Delete Inventory?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.isTable = false;
          this.isProgressBar = true;
          this.inventoryService.updateDeleteInventory(deleteInventory).subscribe((data) => {
            this.inventoryService.getInventory().subscribe((inventoryInfo: any) => {
              this.inventoryInfo = this.global.tableIndex(inventoryInfo.data);
              for (let i = 0; i < this.inventoryInfo.length; i++) {
                this.inventoryInfo[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.inventoryInfo[i].inventory_quantity)
              }
              this.isProgressBar = false;
              if (this.inventoryInfo.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.inventoryInfo.length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
          });
          Swal.fire({
            icon: 'success',
            title: 'Inventory has beeen deleted.',
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Inventory is safe.",
            "error"
          );
        }
      }
      );
  }

  importInventoryChange(event) {
    this.importInventoryForm.patchValue({
      inventoryIdImport: this.inventoryInfo.find((d) => d.inventory_name === event.value).inventory_id,
      inventoryUnit: this.inventoryInfo.find((d) => d.inventory_name === event.value).inventory_unit,
    });
  }

  importInventory() {
    this.importInventoryForm.markAllAsTouched();
    this.isTable = false;
    this.isProgressBarImport = true;
    if (this.importInventoryForm.valid) {
      let importInventoryData = {
        'inventory_id_import': this.importInventoryForm.get('inventoryIdImport').value,
        'import_inventory_name': this.importInventoryForm.get('importInventoryName').value,
        'inventory_quantity': Number(this.importInventoryForm.get('inventoryQuantity').value.split(',').join('')),
        'inventory_unit': this.importInventoryForm.get('inventoryUnit').value,
        'import_inventory_date': this.importInventoryForm.get('importInventoryDate').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }

      let importInventoryAdd = {
        'inventory_id': this.importInventoryForm.get('inventoryIdImport').value,
        'inventory_quantity': Number(this.importInventoryForm.get('inventoryQuantity').value.split(',').join('')),
        'session_id': localStorage.getItem('session_id'),
        'updated_date': this.global.getDateZone(),
        'updated_time': this.global.getTimeZone()
      }
      this.inventoryService.createImportInventory(importInventoryData).subscribe(data => {
        this.inventoryService.updateInventoryQuantityAdd(importInventoryAdd).subscribe(data => {
          this.inventoryService.getInventory().subscribe((inventoryInfo: any) => {
            this.inventoryInfo = this.global.tableIndex(inventoryInfo.data);
            for (let i = 0; i < this.inventoryInfo.length; i++) {
              this.inventoryInfo[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.inventoryInfo[i].inventory_quantity)
            }
            this.isProgressBar = false;
            if (this.inventoryInfo.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.inventoryInfo.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          });
          this.inventoryService.getImportInvetory().subscribe((importInventoryInfo: any) => {
            this.importInventoryInfo = this.global.tableIndex(importInventoryInfo.data);
            for (let i = 0; i < this.importInventoryInfo.length; i++) {
              this.importInventoryInfo[i].import_inventory_quantity = new Intl.NumberFormat('en-IN').format(this.importInventoryInfo[i].import_inventory_quantity)
            }
            this.isProgressBarImport = false;
            if (this.importInventoryInfo.length > 0) {
              this.isDataImport = false;
              this.isTableImport = true;
            } else if (this.importInventoryInfo.length === 0) {
              this.isTableImport = false;
              this.isDataImport = true;
            }
          });
        })
      })
      this.toastr.success("Import Inventory " + this.importInventoryForm.get("importInventoryName").value + " import successfully");
      this.importInventoryForm.reset();
      document.getElementById('colLapseCard').click();
    } else {
      this.isProgressBarImport = false;
      this.isTableImport = true;
    }
  }

  deleteImportInventory(inventoryId, tblImportInventoryId, importInventoryName, importInventoryQuantity, importInventoryDate) {
    let deletData = {
      'tbl_import_inventory_id': tblImportInventoryId,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }

    let inventoryData = {
      'inventory_id': inventoryId,
      'inventory_quantity': Number(importInventoryQuantity.split(',').join('')),
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }

    let formattedDate = (moment(importInventoryDate)).format('DD-MMM-YYYY')

    let sweetalerttext = "Are you sure want to delete the imported inventory " + importInventoryName + ', imported on the date ' + formattedDate + 'with the imported quantity ' + importInventoryQuantity + '?';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Delete Imported Inventory',
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
        this.importInventoryData.inventoryId = inventoryId;
        this.importInventoryData.inventoryQuantity = importInventoryQuantity;
        this.inventoryService.updateInventoryQuantitySub(inventoryData).subscribe(data => {
          this.inventoryService.getInventory().subscribe((inventoryInfo: any) => {
            this.inventoryInfo = this.global.tableIndex(inventoryInfo.data);
            for (let i = 0; i < this.inventoryInfo.length; i++) {
              this.inventoryInfo[i].inventory_quantity = new Intl.NumberFormat('en-IN').format(this.inventoryInfo[i].inventory_quantity)
            }
            this.isProgressBar = false;
            if (this.inventoryInfo.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.inventoryInfo.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
          this.inventoryService.deleteImportInventory(deletData).subscribe(data => {
            this.inventoryService.getImportInvetory().subscribe((getImportInventory: any) => {
              this.importInventoryInfo = this.global.tableIndex(getImportInventory.data);
              for (let i = 0; i < this.importInventoryInfo.length; i++) {
                this.importInventoryInfo[i].import_inventory_quantity = new Intl.NumberFormat('en-IN').format(this.importInventoryInfo[i].import_inventory_quantity)
              }
              this.isProgressBarImport = false;
              if (this.importInventoryInfo.length > 0) {
                this.isDataImport = false;
                this.isTableImport = true;
              } else if (this.importInventoryInfo.length === 0) {
                this.isTableImport = false;
                this.isDataImport = true;
              }
            })
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Import Inventory has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Imported Inventory is safe.',
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
    if (!this.inventoryInfo) {
      return;
    }
    // get the search keyword
    let search = this.inventoryFilterCtrl.value;
    if (!search) {
      this.filteredInventoryName.next(this.inventoryInfo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredInventoryName.next(
      this.inventoryInfo.filter((data) => {
        return data.inventory_name.toLowerCase().indexOf(search) > -1;
      })
    );
    this.filteredInventoryName.subscribe((d) => { });
  }
}
