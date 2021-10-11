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

  inventoryForm: FormGroup;
  updateInventoryForm: FormGroup;

  inventoryInfo = [];
  inventoryInfoBackup = [];

  inventoryName: any;
  p: number = 1;
  value = 'Clear me';
  entriesPerPage: any = '10';

  oldCardIndex: any;

  protected _onDestroy = new Subject<void>();
  public inventoryFilterCtrl: FormControl = new FormControl();
  public filteredInventoryName: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

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

    this.getInventory();
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

  insertInventory() {
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
      this.toastr.error("Please enter valid data.");
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
