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
import Swal from "sweetalert2";
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pre-plan-production',
  templateUrl: './pre-plan-production.component.html',
  styleUrls: ['./pre-plan-production.component.scss']
})
export class PrePlanProductionComponent implements OnInit {

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private global: GlobalService,
    private productionService: ProductionService,
    private rawMaterialService: RawMaterialService,
    private prePalnProductionService: PrePalnProductionService,
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
  selectedPrePlanProductionData: any;
  rawMaterialName = [];
  rawMaterialNameBackup = [];
  updatePrePlanProduction = [];
  categoryName = [];
  productName = [];

  productionName: string;
  categoryId: string;
  productId: string;

  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  oldCardIndex: any;

  protected onDestroy = new Subject<void>();
  public rawMaterialMultiFilterCtrl: FormControl = new FormControl();
  public filteredRawMaterialMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.isProgressBar = true;
    this.isData = false;
    this.isTable = false;

    this.isProduct = false;
    this.isRawMaterial = false;
    this.rawMaterialNameBackup = [];

    this.prePlanProductionForm = this.formBuilder.group({
      categoryId: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      rawMaterialId: ['', [Validators.required]],
    })

    this.getPrePlanProductionList();
    this.getRawMaterialName();
    this.getCategoryName();
    // this.getProductName(); 
  }


  getPrePlanProductionList() {
    this.prePalnProductionService.getPrPlanProductionList().subscribe((prePlanProduction: any) => {
      this.prePlanProductionData = this.global.tableIndex(prePlanProduction.data);
      this.isProgressBar = false;
      if (this.prePlanProductionData.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.prePlanProductionData.length === 0) {
        this.isData = true;
        this.isTable = false;
      }
    })
  }

  getRawMaterialName() {
    this.rawMaterialService.getRawMaterial().subscribe((getRawMaterialName: any) => {
      this.rawMaterialName = this.global.tableIndex(getRawMaterialName.data);
      this.filteredRawMaterialMulti.next(getRawMaterialName.data.slice());
      this.rawMaterialMultiFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })
  }

  getCategoryName() {
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.categoryName = this.global.tableIndex(categoryName.data);
    })
  }

  categoryChange(event) {
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

  productChange(event) {
    this.productId = event.value
    this.isProgressBarTable = true;
    this.isRawMaterialTable = false;
    let rawMaterialID = {
      'product_id': event.value
    }
    this.productionService.getProductWiseRawMaterial(rawMaterialID).subscribe((getProductWiseRawMaterial: any) => {
      this.rawMaterialName = getProductWiseRawMaterial.data;
      for (let i = 0; i < this.rawMaterialName.length; i++) {
        this.rawMaterialName[i].raw_material_quantity = new Intl.NumberFormat('en-IN').format(this.rawMaterialName[i].raw_material_quantity)
      }
      this.rawMaterialName.map((d) => {
        this.rawMaterialNameBackup.push(null);
        this.isProgressBarTable = false;
      });
      this.isRawMaterial = true;
    });
  }

  search() {

  }

  insertPrePlanProduction() {
    this.prePlanProductionForm.markAllAsTouched();
    let isRawMaterialBackup: boolean = true;
    let done: boolean = false;
    this.rawMaterialNameBackup.map((d, i) => {
      if (d === null) {
        isRawMaterialBackup = false;
      }
    });
    if(this.categoryId != undefined){
      done = true;
    }
    if (done) {
      let prePlanProductionId = uuidv4();
      this.rawMaterialName.map((d, i) => {
        let prePlanData = {
          'pre_plan_production_id': prePlanProductionId,
          'category_id': this.categoryId,
          'product_id': this.productId,
          'raw_material_id': d.raw_material_id,
          'quantity': this.rawMaterialNameBackup[i],
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone()
        }
        this.prePalnProductionService.createPrePlanProduction(prePlanData).subscribe((createPrePlanProduction) => {
          this.prePalnProductionService.getPrPlanProductionList().subscribe((prePlanProduction: any) => {
            this.prePlanProductionData = this.global.tableIndex(prePlanProduction.data);
            this.isProgressBar = false;
            if (this.prePlanProductionData.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.prePlanProductionData.length === 0) {
              this.isData = true;
              this.isTable = false;
            }
          })
        })
      })
      this.toastr.success("Successfully Start Production");
      this.prePlanProductionForm.reset();
      this.rawMaterialNameBackup = null;
      this.isProduct = false;
      this.isRawMaterial = false;
      document.getElementById("collapseButton").click();
    } else {
      this.isProduct = false;
      this.isRawMaterial = false;
    }
  }

  startProduction(prePlanProductionId) {
    this.prePlanProductionData.map((d, index) => {
      if (d.pre_plan_production_id === prePlanProductionId) {
        this.selectedPrePlanProductionData = d;
      }
    })
    this.productionService.prePlanProductionData.next(this.selectedPrePlanProductionData);
    this.router.navigateByUrl('/dashboard/production');
  }

  editPrePlanProduction(prePlanProductionId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex;
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById("editPrePlanProduction" + this.oldCardIndex).classList.remove('show')
        this.oldCardIndex = cardIndex;
      }
    }
  }

  updatdePrePlanProduction(cardIndex) {
    let rawMaterialId = [];
    rawMaterialId = this.prePlanProductionData[cardIndex].raw_material_id.split(',');
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to update Pre Plan Production Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        rawMaterialId.map((d, i) => {
          if (this.updatePrePlanProduction[i] === null) {
            this.isProduct = true;
            this.isRawMaterial = true;
            this.toastr.error("Please Enter Raw Material Quantity");
          } else {
            let updatePrePlanProductionInfo = {
              'pre_plan_production_id': this.prePlanProductionData[cardIndex].pre_plan_production_id,
              'raw_material_id': rawMaterialId[i],
              'quantity': this.updatePrePlanProduction[i],
              'session_id': localStorage.getItem('session_id'),
              'updated_date': this.global.getDateZone(),
              'updated_time': this.global.getTimeZone()
            }
            this.prePalnProductionService.updatePrePlanProduction(updatePrePlanProductionInfo).subscribe((updateProduction) => {
              this.prePalnProductionService.getPrPlanProductionList().subscribe((prPlanProductionList: any) => {
                this.prePlanProductionData = this.global.tableIndex(prPlanProductionList.data);
                this.isProgressBar = false;
                if (this.prePlanProductionData.length > 0) {
                  this.isData = false;
                  this.isTable = true;
                } else if (this.prePlanProductionData.length === 0) {
                  this.isData = true;
                  this.isTable = false;
                }
              })
            })
          }
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Pre Plan Production Information is unchanged.',
          'error'
        )
      }
    })
  }

  deletePrePlanProduction(prePlanProductionId) {
    let deletePrePlanProduction = {
      'pre_plan_production_id': prePlanProductionId,
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
    swalWithBootstrapButtons.fire({
      title: "Are you sure want to Delete Pre Plan Production?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.prePalnProductionService.deletePrePlanProduction(deletePrePlanProduction).subscribe((deleteProduciton) => {
            this.prePalnProductionService.getPrPlanProductionList().subscribe((getPrePlanProduction: any) => {
              this.prePlanProductionData = this.global.tableIndex(getPrePlanProduction.data);
              this.isProgressBar = false;
              if (this.prePlanProductionData.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.prePlanProductionData.length === 0) {
                this.isData = true;
                this.isTable = false;
              }
            });
            this.toastr.success("Pre Plan Production deleted successfully");
          });
          Swal.fire({
            icon: "success",
            title: "Your Pre Plan Production has beeen deleted.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your Pre Plan Production is safe :)",
            "error"
          );
        }
      }
      );
  }

  cancel() {
    this.rawMaterialNameBackup = null;
    this.prePlanProductionForm.reset();
    this.isProduct = false;
    this.isRawMaterial = false;
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
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
