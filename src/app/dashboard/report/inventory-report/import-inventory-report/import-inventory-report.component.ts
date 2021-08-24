import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/services/global.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';

@Component({
  selector: 'app-import-inventory-report',
  templateUrl: './import-inventory-report.component.html',
  styleUrls: ['./import-inventory-report.component.scss']
})
export class ImportInventoryReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private inventoryService: InventoryService,
    private reportService: ReportService,
    private datepipe: DatePipe,
  ) { }

  inventoryForm: FormGroup;
  importInventoryForm: FormGroup;

  inventory = [];
  allInventoryName = [];
  inventoryName = [];
  importInventoryName = [];
  importInventoryDate = [];

  inventoryNameTable: boolean;
  inventoryDateTable: boolean;
  allInventoryNameTable: boolean;
  importInventoryNameTable: boolean;

  selectedDate: any;
  inventoryId: any;
  currentTable = '';

  protected _onDestroy = new Subject<void>();
  public inventory_FilterCtrl: FormControl = new FormControl();
  public filtered_inventory_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public import_inventory_FilterCtrl: FormControl = new FormControl();
  public filtered_import_inventory_name: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.allInventoryNameTable = false;
    this.importInventoryNameTable = false;
    this.inventoryDateTable = false;

    this.inventoryForm = this.formBuilder.group({
      inventory_id: [''],
      inventoryName: [''],
    })

    this.importInventoryForm = this.formBuilder.group({
      import_inventory_id: [''],
      importInventoryName: [''],
      import_inventory_date_start: [''],
      import_inventory_date_end: ['']
    })
    this.getImportInvetory();

  }

  getImportInvetory() {
    this.inventoryService.getImportInvetory().subscribe((getInventory: any) => {
      this.inventory = this.global.tableIndex(getInventory.data);
      this.filtered_inventory_name.next(getInventory.data.slice());
      this.inventory_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterInventoryBanks();
      });
    })
  }

  inventoryChange(event) {
    this.inventoryId = event.value
    this.inventoryForm.patchValue({
      inventory_id: this.inventory.find(d => d.inventory_id === event.value).inventory_id,
    })
  }

  getInventoryList() {
    if (this.inventoryId === undefined || this.inventoryId === '') {
      this.inventoryService.getImportInvetory().subscribe((getAllInventory: any) => {
        this.allInventoryName = this.global.tableIndex(getAllInventory.data);
        this.allInventoryNameTable = true;
      })
      this.allInventoryNameTable = false;
      this.cancel();
    } else {
      let inventory = {
        'inventory_id': this.inventoryId
      }
      this.reportService.getInventory(inventory).subscribe((getInventoryName: any) => {
        this.inventoryName = this.global.tableIndex(getInventoryName.data)
        this.inventoryNameTable = true;
      })
      this.inventoryNameTable = false;
      this.cancel();
    }
  }

  onSelect(event, value) {
    this.selectedDate = value;
  }

  onKey(event,input){}

  getImportInventoryList() {
    if ((this.inventoryId === undefined && this.selectedDate === undefined) || (this.inventoryId === '' && this.selectedDate === '')) {
      this.inventoryService.getImportInvetory().subscribe((getImportInvetory: any) => {
        this.allInventoryName = this.global.tableIndex(getImportInvetory.data);
        this.allInventoryNameTable = true;
      })
      this.allInventoryNameTable = false;
    } else if (this.inventoryId != '') {
      let inventory = {
        'inventory_id': this.inventoryId
      }
      this.reportService.getImportInventory(inventory).subscribe((getImporInventoryName: any) => {
        this.importInventoryName = this.global.tableIndex(getImporInventoryName.data);
        this.inventoryNameTable = true;
      })
      this.inventoryNameTable = false;
    } else if (this.selectedDate != '') {
      let formattedDate = this.datepipe.transform(this.selectedDate, "YYYY-dd-MM")
      let inventory_date = {
        'import_inventory_date_start': formattedDate
      }
      this.reportService.getImportInventoryDate(inventory_date).subscribe((getImportInventoryDate: any) => {
        this.importInventoryDate = this.global.tableIndex(getImportInventoryDate.data)
        this.inventoryDateTable = true;
      })
      this.inventoryDateTable = false;
    }
    this.cancel();
  }

  cancel() {
    this.inventoryId = '';
    this.importInventoryForm.reset();
    this.inventoryForm.reset();
    this.inventoryNameTable = false;
    this.allInventoryNameTable = false;
    this.inventoryDateTable = false;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterInventoryBanks() {
    if (!this.inventory) {
      return;
    }
    // get the search keyword
    let search = this.inventory_FilterCtrl.value;
    if (!search) {
      this.filtered_inventory_name.next(this.inventory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtered_inventory_name.next(
      this.inventory.filter(data => {
        return data.inventoryName.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_inventory_name.subscribe(d => {
    })
  }
}