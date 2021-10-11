import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-import-material-report',
  templateUrl: './import-material-report.component.html',
  styleUrls: ['./import-material-report.component.scss']
})
export class ImportMaterialReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private rawMaterialService: RawMaterialService,
    private reportService: ReportService,
  ) {}

  importRawMaterialForm: FormGroup;

  importRawMaterial = [];
  allImportRawMaterial = [];
  importRawMaterialName = [];
  importRawMaterialDate = [];

  rawMaterialId: any;
  selectedDate: any;

  importRawMaterialTable: boolean;
  importRawMaterialTableDate: boolean;
  importTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';

  role = [];

  protected _onDestroy = new Subject<void>();
  public importRawMaterialFilterCtrl: FormControl = new FormControl();
  public filteredImportRawMaterialName: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.importRawMaterialTable = false;
    this.importRawMaterialTableDate = false;

    this.importRawMaterialForm = this.formBuilder.group({
      raw_material_id_import: [''],
      import_raw_material_name: [''],
      import_raw_material_date_start: [''],
      import_raw_material_date_end: ['']
    });
    this.getImportRawMaterial();
  }

  getImportRawMaterial() {
    this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
      this.importRawMaterial = this.global.tableIndex(getImportRawMaterial.data);
      this.filteredImportRawMaterialName.next(getImportRawMaterial.data.slice());
      this.importRawMaterialFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterImportBanks();
      });
    })
  }

  importRawMaterialPdf() {
    if (this.allImportRawMaterial.length > 0) {
      const data = {
        importRawMaterial: 'Import Raw Material',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        title: ['#', 'Date', 'Raw Material Name', 'Quantity', 'Unit'],
        content: this.allImportRawMaterial
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    } else if (this.importRawMaterialName.length > 0) {
      const data = {
        importRawMaterial: 'Import Raw Material',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        title: ['#', 'Date', 'Raw Material Name', 'Quantity', 'Unit'],
        content: this.importRawMaterialName
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    } else if (this.importRawMaterialDate.length > 0) {
      const data = {
        importRawMaterial: 'Import Raw Material',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        title: ['#', 'Date', 'Raw Material Name', 'Quantity', 'Unit'],
        content: this.importRawMaterialDate
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
  }

  importRawMaterialChange(event) {
    this.rawMaterialId = event.value
    this.importRawMaterialForm.patchValue({
      raw_material_id_import: this.importRawMaterial.find(d => d.raw_material_id === event.value).raw_material_id,
    })
  }

  onKey(event, value) {
    this.selectedDate = value
  }

  getImportRawMaterialList() {
    if ((this.rawMaterialId === undefined && this.selectedDate === undefined) || (this.rawMaterialId === '' && this.selectedDate === '')) {
      this.rawMaterialService.getImportRawMaterial().subscribe((getImportRawMaterial: any) => {
        this.allImportRawMaterial = this.global.tableIndex(getImportRawMaterial.data);
        this.importTable = true;
        this.importRawMaterialTable = false;
        this.importRawMaterialTableDate = false;
      })
    } else if (this.rawMaterialId != '') {
      let rawMaterial = {
        'import_raw_material_id': this.rawMaterialId
      }
      this.reportService.getImportRawMaterial(rawMaterial).subscribe((getImportRawMaterialName: any) => {
        this.importRawMaterialName = this.global.tableIndex(getImportRawMaterialName.data);
        this.importTable = false;
        this.importRawMaterialTable = true;
        this.importRawMaterialTableDate = false;
      })
    } else if (this.selectedDate != '') {
      let formattedDate = this.selectedDate.split('-').reverse().join('-');
      let raw_material_date = {
        'import_raw_material_date_start': formattedDate
      }
      this.reportService.getImportRawMaterialDate(raw_material_date).subscribe((getImportRawMaterialDate: any) => {
        this.importRawMaterialDate = this.global.tableIndex(getImportRawMaterialDate.data);
        this.importTable = false;
        this.importRawMaterialTable = false;
        this.importRawMaterialTableDate = true;
      })
    }
    this.cancel();
  }

  cancel() {
    this.importRawMaterialForm.reset();
    this.importTable = false;
    this.importRawMaterialTable = false;
    this.importRawMaterialTableDate = false;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterImportBanks() {
    if (!this.importRawMaterial) {
      return;
    }
    // get the search keyword
    let search = this.importRawMaterialFilterCtrl.value;
    if (!search) {
      this.filteredImportRawMaterialName.next(this.importRawMaterial.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredImportRawMaterialName.next(
      this.importRawMaterial.filter(data => {
        return data.import_raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredImportRawMaterialName.subscribe(d => {
    })
  }
}
