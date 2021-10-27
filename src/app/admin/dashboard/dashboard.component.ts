import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InventoryService } from 'app/services/dashboard/inventory/inventory.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { ProductionService } from 'app/services/dashboard/production/production.service';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { SellService } from 'app/services/dashboard/sell/sell.service';
import { GlobalService } from 'app/services/global.service';
import { UserService } from 'app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @Input() get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private rawMaterialService: RawMaterialService,
    private inventoryService: InventoryService,
    private productService: ProductService,
    private productionService: ProductionService,
    private sellService: SellService,
    private global: GlobalService,
    private titleService: Title
  ) {
    titleService.setTitle("Dashboard | Modern Agrichem");
  }

  ff: FormGroup;
  userDetails = [];
  rawMaterial = [];
  importRawMaterial = [];
  importInventory = [];
  product = [];
  production = [];
  sell = [];
  id: any;

  isProgressBar: boolean;
  isData: boolean;

  ngOnInit(): void {
    // isProgressBar;
    this.isData = false;

    this.ff = this.formBuilder.group({
      value1: [''],
      value2: [''],
      value3: ['']
    })

    this.id = localStorage.getItem('user_id');

    let user = {
      "user_id": this.id
    }

    this.userService.getUser(user).subscribe((response: any) => {
      this.userDetails = response.data
    })

    this.getRawMaterial();
    this.getInventory();
    this.getProduct();
    this.getProductionList();
    this.getSell();
  }

  getRawMaterial() {
    this.rawMaterialService.getRawMaterial().subscribe((rawMaterial: any) => {
      this.rawMaterial = this.global.tableIndex(rawMaterial.data);
    })
    this.rawMaterialService.getImportRawMaterial().subscribe((importRawMaterialInfo: any) => {
      this.importRawMaterial = this.global.tableIndex(importRawMaterialInfo.data);
    })
  }

  getInventory() {
    this.inventoryService.getImportInvetory().subscribe((importInvetoryInfo: any) => {
      this.importInventory = this.global.tableIndex(importInvetoryInfo.data);
    })
  }

  getProduct() {
    this.productService.getProduct().subscribe((productInfo: any) => {
      this.product = this.global.tableIndex(productInfo.data);
    })
  }

  exportPdf() {
    const doc = new jsPDF();
    autoTable(doc, { html: "#rawMaterialTable" });
    doc.save("rawMaterialList.pdf");
  }

  getProductionList() {
    this.productionService.getProduction().subscribe((productionInfo: any) => {
      this.production = this.global.tableIndex(productionInfo.data);
      if (this.production.length > 0) {
        this.isData = false;
      } else if (this.production.length === 0) {
        this.isData = true;
      }
    })
  }

  getSell() {
    this.sellService.getSell().subscribe((sellInfo: any) => {
      this.sell = this.global.tableIndex(sellInfo.data);
    })
  }
}
