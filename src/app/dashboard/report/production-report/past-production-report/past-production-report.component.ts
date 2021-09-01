import { Component, OnInit } from '@angular/core';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { GlobalService } from 'app/services/global.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';
import { ProductionService } from 'app/services/dashboard/production/production.service';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-past-production-report',
  templateUrl: './past-production-report.component.html',
  styleUrls: ['./past-production-report.component.scss']
})
export class PastProductionReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private rawMaterialService: RawMaterialService,
    private inventoryService: InventoryService,
    private productionService: ProductionService,
    private reportService: ReportService,
    private datepipe: DatePipe,
    private titleService: Title
  ) { }

  pastProductionForm: FormGroup;

  pastProduction = [];
  categoryPastProduction = [];

  category_id: any;
  isPastTable: boolean;
  isCategoryTable: boolean;
  currentTable: any;

  protected _onDestroy = new Subject<void>();
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.pastProductionForm = this.formBuilder.group({
      category_id: [''],
      // start_time: [''],
      // end_time: ['']
    })

    this.getPastProduction();
  }

  categoryChange(event) {
    this.category_id = event.value
    this.pastProductionForm.patchValue({
      category_id: this.pastProduction.find(d => d.category_id === event.value).category_id,
    })
  }

  getPastProduction() {
    this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
      this.pastProduction = this.global.tableIndex(getProductionTable.data);
      this.filteredCategory.next(getProductionTable.data.slice());
      this.categoryFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })
    for (let i = 0; i < this.pastProduction.length; i++) {
      // this.pastProduction[i].raw_material_quantity = this.pastProduction[i].raw_material_quantity.split(',')
      // this.pastProduction[i].inventory_qty = this.pastProduction[i].inventory_qty.split(',')
      for (let j = 0; j < this.pastProduction[i].inventory_qty.length; j++) {
        this.pastProduction[i].raw_material_quantity[j] = parseInt(this.pastProduction[i].raw_material_quantity[j]).toLocaleString('en-IN')
        this.pastProduction[i].inventory_qty[j] = parseInt(this.pastProduction[i].inventory_qty[j]).toLocaleString('en-IN')
      }
    }
  }

  getPastProductionList() {
    if (this.category_id === undefined || this.category_id.length === 0) {
      this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
        this.pastProduction = this.global.tableIndex(getProductionTable.data);
      });
      for (let i = 0; i < this.pastProduction.length; i++) {
        this.pastProduction[i].raw_material_quantity = this.pastProduction[i].raw_material_quantity.split(',')
        this.pastProduction[i].inventory_qty = this.pastProduction[i].inventory_qty.split(',')
        for (let j = 0; j < this.pastProduction[i].raw_material_quantity.length; j++) {
          this.pastProduction[i].raw_material_quantity[j] = parseInt(this.pastProduction[i].raw_material_quantity[j]).toLocaleString('en-IN')
          this.pastProduction[i].inventory_qty[j] = parseInt(this.pastProduction[i].inventory_qty[j]).toLocaleString('en-IN')
        }
      }
      this.isPastTable = true;
      this.isCategoryTable = false;
    } else {
      let category = {
        'category_id': this.category_id
      }
      this.reportService.getCategoryWiceProduction(category).subscribe((getCategoryWiceProduction: any) => {
        this.categoryPastProduction = this.global.tableIndex(getCategoryWiceProduction.data)
      })
      for (let i = 0; i < this.categoryPastProduction.length; i++) {
        this.categoryPastProduction[i].raw_material_quantity = this.categoryPastProduction[i].raw_material_quantity.split(',')
        this.categoryPastProduction[i].inventory_qty = this.categoryPastProduction[i].inventory_qty.split(',')
        for (let j = 0; j < this.categoryPastProduction[i].inventory_qty.length; j++) {
          this.categoryPastProduction[i].raw_material_quantity[j] = parseInt(this.categoryPastProduction[i].raw_material_quantity[j]).toLocaleString('en-IN')
          this.categoryPastProduction[i].inventory_qty[j] = parseInt(this.categoryPastProduction[i].inventory_qty[j]).toLocaleString('en-IN')
        }
      }
      this.isPastTable = false;
      this.isCategoryTable = true;
    }
    this.cancel();
  }

  pastProductionPdf() {
    if (this.pastProduction.length > 0) {
      const data = {
        pastProductionTitle: 'Past Production',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        pastProductionHeader: ['#', 'Product Name', 'Raw Material Info', 'Start Time', 'End Time'],
        pastProductionContents: this.pastProduction
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }else{
      const data = {
        pastProductionTitle: 'Past Production',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        pastProductionHeader: ['#', 'Product Name', 'Raw Material Info', 'Start Time', 'End Time'],
        pastProductionContents: this.categoryPastProduction
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
  }

  cancel() {
    this.category_id = '';
    this.pastProductionForm.reset();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.pastProduction) {
      return;
    }
    // get the search keyword
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredCategory.next(this.pastProduction.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCategory.next(
      this.pastProduction.filter(data => {
        return data.category_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredCategory.subscribe(d => {
    })
  }
}