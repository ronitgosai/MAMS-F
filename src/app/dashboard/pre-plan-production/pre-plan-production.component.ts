import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ProductCategoryService } from 'app/services/dashboard/master/product-category.service';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { ProductionService } from 'app/services/dashboard/production/production.service';
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { PrePalnProductionService } from 'app/services/dashboard/pre-plan-production/pre-paln-production.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pre-plan-production',
  templateUrl: './pre-plan-production.component.html',
  styleUrls: ['./pre-plan-production.component.scss']
})
export class PrePlanProductionComponent implements OnInit {

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService,
    private productionService: ProductionService,
    private rawMaterialService: RawMaterialService,
    private PrePalnProductionService: PrePalnProductionService,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService
  ) {
    titleService.setTitle("Pre Plan Production | Modern Agrichem")
  }

  isSubmitted: boolean;
  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;
  isProduct: boolean;
  isRawMaterial: boolean;
  isRawMaterialTable: boolean;
  isProgressBarTable: boolean;

  prePlanProductionForm: FormGroup;

  prePlanProductionData = [];
  rawMaterialName = [];
  rawMaterialNameBackup = [];
  categoryName = [];
  productName = [];

  productionName: string;
  categoryId: string;
  productId: string;

  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  old_card_index: any;

  protected _onDestroy = new Subject<void>();
  public rawMaterialMultiFilterCtrl: FormControl = new FormControl();
  public filteredRawMaterialMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.prePlanProductionForm = this.formBuilder.group({
      categoryId: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      rawMaterialId: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    })

    this.getRawMaterialName();
    this.getCategoryName();
    // this.getProductName();
  }

  getRawMaterialName() {
    this.rawMaterialService.getRawMaterial().subscribe((getRawMaterialName: any) => {
      this.rawMaterialName = this.global.tableIndex(getRawMaterialName.data);
      this.filteredRawMaterialMulti.next(getRawMaterialName.data.slice());
      this.rawMaterialMultiFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })
  }

  getCategoryName() {
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.categoryName = this.global.tableIndex(categoryName.data);
    })
  }

  categoryChange(event){
    this.categoryId = event.value
    this.isRawMaterial = false;
    this.isRawMaterialTable = false;
    this.isProduct = false;
    let categoryId = {
      'category_id': event.value,
    };
    this.productionService.getCategoryWiceProduct(categoryId).subscribe((getCategoryWiceProduct: any) => {
      this.productName = getCategoryWiceProduct.data;
      this.isProgressBarTable = false;
      this.isProduct = true;
    });
  }

  productChange(event){
    this.productId = event.value
    this.isRawMaterial = true;
    this.isProgressBarTable = true;
    this.isRawMaterialTable = false;
    // this.product_id = event.value
    let rawMaterialID = {
      'product_id': event.value
    }
    this.productionService.getProductWiseRawMaterial(rawMaterialID).subscribe((getProductWiseRawMaterial: any) => {
      this.rawMaterialName = getProductWiseRawMaterial.data;
      console.log(this.rawMaterialName)
      for (let i = 0; i < this.rawMaterialName.length; i++) {
        this.rawMaterialName[i].raw_material_quantity = new Intl.NumberFormat('en-IN').format(this.rawMaterialName[i].raw_material_quantity)
      }
      getProductWiseRawMaterial.data.map((d) => {
        this.rawMaterialNameBackup.push(null);
        this.isProgressBarTable = false;
      });
      if (this.rawMaterialName.length > 0) {
        this.isRawMaterialTable = true;
      } else if (this.rawMaterialName.length === 0) {
        this.isRawMaterialTable = false;
      }
    });
    this.rawMaterialNameBackup.length = 0;
  }

  search() {

  }


  insertPrePlanProduction() {
    console.log(this.rawMaterialNameBackup)
    this.rawMaterialName.map((d,i) => {
      let prePlanData = {
        'category_id': this.categoryId,
        'product_id': this.productId,
        'raw_material_id': d.raw_material_id,
        'quantity': this.rawMaterialNameBackup[i],
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      console.log("prePlanData",prePlanData)
      this.PrePalnProductionService.createPrePlanProduction(prePlanData).subscribe((createPrePlanProduction) => {
        console.log(createPrePlanProduction)
      })
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.rawMaterialName) {
      return;
    }
    // get the search keyword
    let search = this.rawMaterialMultiFilterCtrl.value;
    if (!search) {
      this.filteredRawMaterialMulti.next(this.rawMaterialName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the raw material name
    this.filteredRawMaterialMulti.next(
      this.rawMaterialName.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredRawMaterialMulti.subscribe(d => {
    })
  }
}
