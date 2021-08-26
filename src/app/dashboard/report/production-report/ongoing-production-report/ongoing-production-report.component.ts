import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/services/global.service';
import { FormGroup } from '@angular/forms';
import { ProductionService } from 'app/services/dashboard/production/production.service';
import { saveAs } from 'file-saver';
import { ReportService } from 'app/services/dashboard/report/report.service';
@Component({
  selector: 'app-ongoing-production-report',
  templateUrl: './ongoing-production-report.component.html',
  styleUrls: ['./ongoing-production-report.component.scss']
})
export class OngoingProductionReportComponent implements OnInit {

  constructor(
    private global: GlobalService,
    private productionService: ProductionService,
    private reportService: ReportService
  ) { }

  ongoingProductionForm: FormGroup;

  allOngoingProduction = [];
  isData: boolean;
  isTable: boolean;


  ngOnInit(): void {
    this.getProductionList();
  }

  getProductionList() {
    this.productionService.getProduction().subscribe((getProduction: any) => {
      this.allOngoingProduction = this.global.tableIndex(getProduction.data)
      if (this.allOngoingProduction.length > 0) {
        this.isData = false;
        this.isTable = false;
      } else if (this.allOngoingProduction.length === 0) {
        this.isData = true;
        this.isTable = false;
      }
      for (let i = 0; i < this.allOngoingProduction.length; i++) {
        this.allOngoingProduction[i].raw_material_quantity = this.allOngoingProduction[i].raw_material_quantity.split(',')
        for (let j = 0; j < this.allOngoingProduction[i].raw_material_quantity.length; j++) {
          this.allOngoingProduction[i].raw_material_quantity[j] = parseInt(this.allOngoingProduction[i].raw_material_quantity[j]).toLocaleString('en-IN')
        }
      }
    })
  }

  ongoingProductionPdf() {
    console.log("ONGOING",this.allOngoingProduction)
    if (this.allOngoingProduction.length > 0) {
      const data = {
        ongoingProductionTitle: 'Ongoing Production',
        image: 'https://mams.modernagrichem.com/assets/img/logo.png',
        ongoingProductionHeader: ['#', 'Product Name', 'Raw Material Info', 'Start Time'],
        ongoingProductionContents: this.allOngoingProduction
      }
      this.reportService.pdf(data).subscribe((pdfmake) => {
        saveAs(pdfmake, "modernagrichem")
      })
    }
  }
}