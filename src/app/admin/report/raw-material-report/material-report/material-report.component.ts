import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { SendMailService } from 'app/services/dashboard/master/send-mail.service';
import { MailContactService } from 'app/services/mail-contact.service';
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-material-report',
  templateUrl: './material-report.component.html',
  styleUrls: ['./material-report.component.scss']
})
export class MaterialReportComponent implements OnInit {
  
  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private mailService: SendMailService,
    private mailContactService: MailContactService,
    private toastr: ToastrService,
    private rawMaterialService: RawMaterialService,
    private reportService: ReportService,
    private titleService: Title
  ) {
  }

  rawMaterialForm: FormGroup;
  importRawMaterialForm: FormGroup;
  emailForm: FormGroup;

  emailInfo = [];
  rawMaterial = [];
  allRawMaterialName = [];
  rawMaterialName = [];
  importRawMaterial = [];
  allImportRawMaterial = [];
  importRawMaterialName = [];
  importRawMaterialDate = [];

  rawMaterialId: any;
  selectedDate: any;

  rawMaterialNameTable: boolean;
  allRawMaterialTable: boolean;
  importRawMaterialTable: boolean;
  importRawMaterialTableDate: boolean;
  importTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';

  currentTable = '';
  role = [];

  protected _onDestroy = new Subject<void>();
  public rawMaterialFilterCtrl: FormControl = new FormControl();
  public filteredRawMaterialName: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  public importRawMaterialFilterCtrl: FormControl = new FormControl();
  public filteredImportRawMaterialName: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.rawMaterialNameTable = false;
    this.allRawMaterialTable = false;
    this.importRawMaterialTable = false;
    this.importRawMaterialTableDate = false;

    this.rawMaterialForm = this.formBuilder.group({
      raw_material_id: [''],
      raw_material_name: [''],
    });

    this.importRawMaterialForm = this.formBuilder.group({
      raw_material_id_import: [''],
      import_raw_material_name: [''],
      import_raw_material_date_start: [''],
      import_raw_material_date_end: ['']
    });

    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })

    this.getRawMaterial();
    this.getEmailAddress();
  }

  /* Get Email Address */
  getEmailAddress(){
    this.mailService.getEmailAddress().subscribe((email: object) => {
      this.emailInfo = email['data']; 
    })
  }

  /* Raw Material */
  getRawMaterial() {
    this.rawMaterialService.getRawMaterial().subscribe((getRawMaterial: any) => {
      this.rawMaterial = this.global.tableIndex(getRawMaterial.data);
      this.filteredRawMaterialName.next(getRawMaterial.data.slice());
      this.rawMaterialFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterRawMaterialBanks();
      });
    })
  }

  rawMaterialChange(event) {
    this.rawMaterialId = event.value
    this.rawMaterialForm.patchValue({
      raw_material_id: this.rawMaterial.find(d => d.raw_material_id === event.value).raw_material_id,
    })
  }

  rawMaterialPdf() {
    if (this.allRawMaterialName.length > 0) {
      const data = {
        rawMaterial: 'Raw Material',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        titles: ['#', 'Raw Material Name', 'Quantity', 'Unit'],
        contents: this.allRawMaterialName
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    } else if (this.rawMaterialName.length > 0) {
      const data = {
        rawMaterial: 'Raw Material',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        titles: ['#', 'Raw Material Name', 'Quantity', 'Unit'],
        contents: this.rawMaterialName
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
  }

  // exportPdf() {
  //   console.log("export")    
  //   const doc = new jsPDF();
  //   autoTable(doc, { html: "#raw_Material" });
  //   doc.save("rawMaterialList.pdf");
  // }

  senMail(){
    if(this.emailForm.valid){
      this.mailContactService.createFormData(this.emailForm.value).subscribe(response => {
      })
    }
  }

  getRawMaterialList() {
    if (this.rawMaterialId === undefined || this.rawMaterialId.length === 0) {
      this.rawMaterialService.getRawMaterial().subscribe((getAllRawMaterial: any) => {
        this.allRawMaterialName = this.global.tableIndex(getAllRawMaterial.data);
        this.allRawMaterialTable = true;
        this.rawMaterialPdf();
      })
      this.allRawMaterialTable = false;
      this.cancel();
    } else {
      let rawMaterial = {
        'raw_material_id': this.rawMaterialId
      }
      this.reportService.getRawMaterial(rawMaterial).subscribe((getRawMaterialName: any) => {
        this.rawMaterialName = this.global.tableIndex(getRawMaterialName.data);
        this.rawMaterialNameTable = true;
        this.rawMaterialPdf();
      })
      this.rawMaterialNameTable = false;
      this.cancel();
    }
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

  // all table false and id empty 
  cancel() {
    this.rawMaterialId = '';
    this.rawMaterialForm.reset();
    this.rawMaterialNameTable = false;
    this.allRawMaterialTable = false;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterRawMaterialBanks() {
    if (!this.rawMaterial) {
      return;
    }
    // get the search keyword
    let search = this.rawMaterialFilterCtrl.value;
    if (!search) {
      this.filteredRawMaterialName.next(this.rawMaterial.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredRawMaterialName.next(
      this.rawMaterial.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredRawMaterialName.subscribe(d => {
    })
  }
}
