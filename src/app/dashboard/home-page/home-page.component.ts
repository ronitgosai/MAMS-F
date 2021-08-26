import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

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
    private userService: UserService,
    private rawMaterialService: RawMaterialService,
    private inventoryService: InventoryService,
    private productService: ProductService,
    private productionService: ProductionService,
    private sellService: SellService,
    private global: GlobalService,
    private titleService: Title
    ) {
      titleService.setTitle("Home-Page | Modern Agrichem");
    }

  userDetails = [];
  rawMaterial = [];
  importRawMaterial = [];
  importInventory = [];
  product = [];
  production = [];
  sell = [];
  id: any;

  ngOnInit(): void {

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
    this.getProduction();
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

  getProduction() {
    this.productionService.getProduction().subscribe((productionInfo: any) => {
      this.production = this.global.tableIndex(productionInfo.data);
      console.log(this.production)
    })
  }

  getSell() {
    this.sellService.getSell().subscribe((sellInfo: any) => {
      this.sell = this.global.tableIndex(sellInfo.data);
    })
  }
}
