import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { InventoryService } from "app/services/dashboard/inventory/inventory.service";
import { ProductCategoryService } from "app/services/dashboard/master/product-category.service";
import { ProductService } from "app/services/dashboard/product/product.service";
import { ProductionService } from "app/services/dashboard/production/production.service";
import { RawMaterialService } from "app/services/dashboard/raw-material/raw-material.service";
import { PrePalnProductionService } from "app/services/dashboard/pre-plan-production/pre-paln-production.service";
import { GlobalService } from "app/services/global.service";
import { ToastrService } from "ngx-toastr";
import { skip } from "rxjs/operators";
import Swal from "sweetalert2";
@Component({
  selector: "app-production",
  templateUrl: "./production.component.html",
  styleUrls: ["./production.component.scss"],
})
export class ProductionComponent implements OnInit {


  constructor(
    private titelService: Title,
    private productionService: ProductionService,
    private productService: ProductService,
    private rawMaterialService: RawMaterialService,
    private inventoryService: InventoryService,
    private productCategoryService: ProductCategoryService,
    private prePalnProductionService: PrePalnProductionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Production | Modern Agrichem");
  }

  productionForm: FormGroup;
  inventoryForm: FormGroup;

  isSubmitted: boolean = false;
  is_disabled: boolean;
  isCategory: boolean;
  isProgressBar_table: boolean;
  isProgressBar: boolean;
  is_data: boolean;
  is_data_table: boolean;
  full_table: boolean;
  isProgressBar_past: boolean;
  is_data_past: boolean;
  is_show: boolean;
  is_show_past: boolean;
  is_ongoing_table: boolean;
  is_past_table: boolean;
  is_table: boolean;
  production_done: boolean;
  entered_raw_material_quantity: boolean;
  update_raw_material_done: boolean;
  is_valid: boolean;
  is_collapsed: boolean;
  isCollapsed: boolean;

  stop_production_data = [];
  stop_production_inventory_data = [];
  productionData = [];
  productionRawMaterial = [];
  productionRawMaterial_backup = [];
  productionData_backup = [];
  productData = [];
  productName = [];
  arr_raw_material = [];
  arr_raw_material_backup = [];
  arr_production = [];
  arr_product_inventory = [];
  arr_other_inventory = [];
  all_inventory = [];
  production_info = [];
  arr_raw_material_name = [];
  updated_ongoing_production_quantity = [];
  other_inventory_id = [];
  other_inventory_quantity = [];
  categoryName = [];
  prePlanProductionId = [];

  product_inventory_id: any;
  product_id: any;
  product_inventory_quantity: any;
  past_production_info: any;
  category: any;
  raw_material_quantity: any;
  ongoing_production_raw_material_quantity: any;
  raw_material_id_delete: any;
  raw_material_qty_delete: any;
  category_name: any;
  product_name: any;
  p: number = 1;
  past: number = 1;
  entries_per_page: any = "10";
  entries_per_page_past: any = "10";
  value = "Clear me";
  value1 = 'Clear me';
  old_card_index;

  obj_production = {
    product_id: "",
    raw_material_id: "",
    raw_material_quantity: "",
  };

  raw_material = {
    raw_material_id: "",
    raw_material_quantity: "",
  };

  ngOnInit(): void {
    this.isCollapsed = false;
    this.is_disabled = false;
    this.full_table = false;
    this.isProgressBar = true;
    this.is_data = false;
    this.is_show = false;
    this.is_ongoing_table = false;

    this.isProgressBar_past = true;
    this.is_data_past = false;
    this.is_show_past = false;
    this.is_past_table = false;

    this.production_done = null;

    this.productionForm = this.formBuilder.group({
      category_name: ["", [Validators.required]],
      product_name: ["", [Validators.required]],
    });

    this.inventoryForm = this.formBuilder.group({
      inventory_id: [""],
      inventory_name: ["", [Validators.required]],
      inventory_quantity: [""],
      inventory_unit: [""],
    });

    this.getProduction();
    this.getProductionRawMaterial();
    this.getProduct();
    this.getInventory();
    this.getPastProduction();
    this.getProductionInventoryT();
    this.getProductCategory();

    this.productionService.prePlanProductionData.subscribe(prePlanProductionData => {
      if (prePlanProductionData) {
        this.isCollapsed = true;
        let event = {
          value: prePlanProductionData.category_id
        }
        let raw_material_ids = {
          value: prePlanProductionData.product_id
        }
        this.productCategoryChange(event);
        this.productChange(raw_material_ids, true);
        this.productionForm.patchValue({
          category_name: prePlanProductionData.category_id,
          product_name: prePlanProductionData.product_id,
          raw_material_ids: prePlanProductionData.raw_material_id
        })
        this.arr_raw_material_backup = prePlanProductionData.quantity.split(',');
        this.arr_raw_material_backup.map((d, index) => {
          this.arr_raw_material_backup[index] = Number(this.arr_raw_material_backup[index])
        })
        this.prePlanProductionId = prePlanProductionData.pre_plan_production_id;
        this.is_disabled = true;
        this.full_table = true;
        this.is_table = true;
      }
    })
  }

  ongoingProduction() {
    this.isCollapsed = true;
  }

  getProduction() {
    this.isProgressBar = true;
    this.productionService.getProduction().subscribe((getProduction: any) => {
      this.productionData = this.global.tableIndex(getProduction.data);
      for (let i = 0; i < this.productionData.length; i++) {
        this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
        for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
          this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
        }
      }
      this.productionData_backup = this.productionData;
      this.isProgressBar = false;
      if (this.productionData.length > 0) {
        this.is_data = false;
        this.is_show = true;
        this.is_ongoing_table = true;
      } else if (this.productionData.length === 0) {
        this.is_ongoing_table = false;
        this.is_data = true;
        this.is_show = false;
      }
    });
  }

  getProductionRawMaterial() {
    this.productionService.getProductionRawMaterial().subscribe((getProductionRawMaterial: any) => {
      this.productionRawMaterial = getProductionRawMaterial.data;
      this.productionRawMaterial_backup = getProductionRawMaterial.data;
    });
  }

  getPastProduction() {
    this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
      this.stop_production_data = this.global.tableIndex(getProductionTable.data);
      for (let i = 0; i < this.stop_production_data.length; i++) {
        this.stop_production_data[i].raw_material_quantity = this.stop_production_data[i].raw_material_quantity.split(',')
        this.stop_production_data[i].inventory_qty = this.stop_production_data[i].inventory_qty.split(',')
        for (let j = 0; j < this.stop_production_data[i].raw_material_quantity.length; j++) {
          this.stop_production_data[i].raw_material_quantity[j] = parseInt(this.stop_production_data[i].raw_material_quantity[j]).toLocaleString('en-IN')
          this.stop_production_data[i].inventory_qty[j] = parseInt(this.stop_production_data[i].inventory_qty[j]).toLocaleString('en-IN')
        }
      }
      this.isProgressBar_past = false;
      if (this.stop_production_data.length > 0) {
        this.is_data_past = false;
        this.is_show_past = true;
        this.is_past_table = true;
      } else if (this.stop_production_data.length === 0) {
        this.is_past_table = false;
        this.is_data_past = true;
        this.is_show_past = false;
      }
    });
  }

  getProductionInventoryT() {
    this.productionService.getProductionInventoryTable().subscribe((getProductionInventoryTable: any) => {
      this.stop_production_inventory_data = getProductionInventoryTable.data;
    });

    for (let i = 0; i < this.stop_production_data.length; i++) {
      for (let j = 0; j < this.stop_production_inventory_data.length; j++) {
        if (this.stop_production_data[i].production_id === this.stop_production_inventory_data[j]) {
          this.stop_production_data[i].inventory_id = this.stop_production_inventory_data[j].inventory_id
          break;
        }
      }
    }
  }

  getProductCategory() {
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.categoryName = this.global.tableIndex(categoryName.data);
    })
  }

  getProduct() {
    this.productService.getProduct().subscribe((getProduct: any) => {
      this.productData = this.global.tableIndex(getProduct.data);
    });
  }

  getInventory() {
    this.inventoryService.getInventory().subscribe((getInventory: any) => {
      this.all_inventory = getInventory.data;
      this.arr_other_inventory = this.all_inventory.filter((d) => d.product_form === 0);
      this.arr_other_inventory.map((d) => {
        this.other_inventory_quantity.push(null);
      });
    });
  }

  search() {
    if (this.category_name === "") {
      this.productionData = this.productionData_backup;
    } else {
      this.productionData = this.productionData_backup.filter((d) => {
        return d.category_name.toLowerCase().match(this.category_name.toLowerCase());
      });
    }
  }

  searchPastProduction() {
    if (this.product_name === "") {
      this.productionData = this.productionData_backup;
    } else {
      this.productionData = this.productionData_backup.filter((d) => {
        return d.product_name.toLowerCase().match(this.product_name.toLowerCase());
      });
    }
  }

  pagination(event) { }

  paginationPast(event) { }

  productCategoryChange(event) {
    this.full_table = false;
    this.is_table = false;
    this.is_disabled = false;
    // this.isProgressBar_table = true;
    let category_id = {
      'category_id': event.value,
    };
    this.category = event.value;
    this.productionService.getCategoryWiceProduct(category_id).subscribe((getCategoryWiceProduct: any) => {
      this.productName = getCategoryWiceProduct.data;
      this.isProgressBar_table = false;
      this.is_disabled = true;
    });
  }

  productChange(event, isPreProduction = false) {
    this.full_table = true;
    this.isProgressBar_table = true;
    this.is_table = false;
    this.product_id = event.value
    let raw_material_ids = {
      'product_id': event.value
    }
    this.productionService.getProductWiseRawMaterial(raw_material_ids).subscribe((getProductWiseRawMaterial: any) => {
      this.arr_raw_material = getProductWiseRawMaterial.data;
      for (let i = 0; i < this.arr_raw_material.length; i++) {
        this.arr_raw_material[i].raw_material_quantity = new Intl.NumberFormat('en-IN').format(this.arr_raw_material[i].raw_material_quantity)
      }
      if (!isPreProduction) {
        getProductWiseRawMaterial.data.map((d) => {
          this.arr_raw_material_backup.push(null);
          this.isProgressBar_table = false;
        });
      }
      if (this.arr_raw_material.length > 0) {
        this.is_data = false;
        this.is_table = true;
      } else if (this.arr_raw_material.length === 0) {
        this.is_data = true;
        this.is_table = false;
      }
    });
    this.arr_raw_material_backup.length = 0;
  }

  startProduction() {
    this.productionForm.markAllAsTouched();
    this.is_ongoing_table = false;
    this.isProgressBar = true;
    this.isSubmitted = true;
    this.production_done = true;

    let deletePrePlanProduction = {
      'pre_plan_production_id': this.prePlanProductionId,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    };

    // check user insert quantity not null OR 0 OR not greater than database quantity
    this.arr_raw_material.map((d, index) => {

      if (this.arr_raw_material_backup[index] === null || this.arr_raw_material_backup[index] > this.arr_raw_material[index].raw_material_quantity) {
        this.toastr.error("Please Enter valid quantity.")
        this.production_done = false;
      }
      else if (this.arr_raw_material_backup[index] <= 0) {
        this.toastr.error("Please enter quantity greater than 0.");
        this.production_done = false;
      }
    })
    if (this.arr_raw_material_backup.length === 0) {
      this.production_done = false;
    }
    // if production_done is true
    if (this.production_done) {
      // start production
      let production_start = {
        'start_date': this.global.getDateZone(),
        'start_time': this.global.getTimeZone(),
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.productionService.startProduction(production_start).subscribe((createProduction: any) => {
        this.productionService.getProduction().subscribe((getProduction: any) => {
          this.productionData = this.global.tableIndex(getProduction.data);
          for (let i = 0; i < this.productionData.length; i++) {
            this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
            for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
              this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
            }
          }
          this.isProgressBar = false;
          if (this.productionData.length > 0) {
            this.is_data = false;
            this.is_show = true;
            this.is_ongoing_table = true;
          } else if (this.productionData.length === 0) {
            this.is_ongoing_table = false;
            this.is_data = true;
            this.is_show = false;
          }
        });
        // insert product_id in tbl_production_product
        let product = {
          'production_id': createProduction.data.production_id,
          'product_id': this.product_id,
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone()
        }
        this.productionService.insertProductProduction(product).subscribe((insertProduct: any) => {
          this.productionService.getProduction().subscribe((getProduction: any) => {
            this.productionData = this.global.tableIndex(getProduction.data);
            for (let i = 0; i < this.productionData.length; i++) {
              this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
              for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
                this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
              }
            }
            this.isProgressBar = false;
            if (this.productionData.length > 0) {
              this.is_data = false;
              this.is_show = true;
              this.is_ongoing_table = true;
            } else if (this.productionData.length === 0) {
              this.is_ongoing_table = false;
              this.is_data = true;
              this.is_show = false;
            }
          });
        })
        // insert raw_material info in tbl_production_raw_material table
        this.arr_raw_material.map((d, index) => {
          let raw_material = {
            'd.raw_production_id': createProduction.data.production_id,
            'raw_material_id': d.raw_material_id,
            'raw_material_quantity': this.arr_raw_material_backup[index],
            'session_id': localStorage.getItem('session_id'),
            'created_date': this.global.getDateZone(),
            'created_time': this.global.getTimeZone()
          }
          this.productionService.insertRawMaterialProduction(raw_material).subscribe((insertRawMaterial: any) => {
            this.productionService.getProduction().subscribe((getProduction: any) => {
              this.productionData = this.global.tableIndex(getProduction.data);
              for (let i = 0; i < this.productionData.length; i++) {
                this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
                for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
                  this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
                }
              }
              this.isProgressBar = false;
              if (this.productionData.length > 0) {
                this.is_data = false;
                this.is_show = true;
                this.is_ongoing_table = true;
              } else if (this.productionData.length === 0) {
                this.is_ongoing_table = false;
                this.is_data = true;
                this.is_show = false;
              }
            });
          })
          // raw_material_quantity minus from tbl_raw_material
          let raw_material_quantity = {
            'raw_material_id': d.raw_material_id,
            'raw_material_quantity': this.arr_raw_material_backup[index],
            'session_id': localStorage.getItem('session_id'),
            'updated_date': this.global.getDateZone(),
            'updated_time': this.global.getTimeZone(),
          }
          this.rawMaterialService.updateRawMaterialQuantitySubstract(raw_material_quantity).subscribe((raw_material_quantity) => { });
          this.prePalnProductionService.deletePrePlanProduction(deletePrePlanProduction).subscribe((deleteProduciton) => {});
        })
      })
      this.toastr.success("Successfully Start Production");
      this.productionForm.reset();
      this.is_disabled = false;
      this.is_table = false;
      document.getElementById("collapseButton").click();
      this.full_table = false;
    } else {
      this.toastr.error("Please select one");
      this.is_ongoing_table = true;
      this.isProgressBar = false;
    }
  }

  startProductionReset() {
    this.productionForm.reset();
  }

  cancel() {
    this.is_disabled = false;
    this.is_table = false;
    this.full_table = false;
  }

  editOngoingProduction(card_index, quantity) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index;
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("ongoing_production" + this.old_card_index).classList.remove("show");
        this.old_card_index = card_index;
      }
    }
  }

  updatedOngoingProduction(card_index) {
    this.is_ongoing_table = false;
    this.isProgressBar = true;
    this.update_raw_material_done = true;
    // create tmp variable
    let raw_material_id = [];
    let old_ongoing_production_quantity = [];
    let final_updated_ongoing_production_quantity: any;
    let stock_raw_material_quantity = [];
    raw_material_id = this.productionData[card_index].raw_material_id.split(',');
    stock_raw_material_quantity = this.productionData[card_index].old_raw_material_quantity.split(",");
    old_ongoing_production_quantity = this.productionData[card_index].raw_material_quantity;

    for (let i = 0; i < old_ongoing_production_quantity.length; i++) {
      old_ongoing_production_quantity[i] = parseInt(old_ongoing_production_quantity[i].split(',').join(''))
      stock_raw_material_quantity[i] = parseInt(stock_raw_material_quantity[i])
    }
    // for loop for 
    for (let i = 0; i < old_ongoing_production_quantity.length; i++) {
      // insert quantity is null/empty/undefined/0
      if (this.updated_ongoing_production_quantity[i] === null || this.updated_ongoing_production_quantity[i] === '' || this.updated_ongoing_production_quantity[i] === 0 || this.updated_ongoing_production_quantity[i] === undefined) {
        this.updated_ongoing_production_quantity[i] = old_ongoing_production_quantity[i]
      }
      if (stock_raw_material_quantity[i] === 0) {
        // something
        if (old_ongoing_production_quantity[i] <= this.updated_ongoing_production_quantity[i]) {
          this.toastr.error("Please enter valid quantity")
          this.update_raw_material_done = false;
          break;
        }
      }
      else if (Math.abs(old_ongoing_production_quantity[i] - this.updated_ongoing_production_quantity[i]) > stock_raw_material_quantity[i]) {
        this.toastr.error("Please enter valid quantity " + this.productionData[card_index].raw_material_names)
        this.update_raw_material_done = false;
        break;
      }
    }
    // if update_raw_material_done is true
    if (this.update_raw_material_done) {
      this.is_ongoing_table = false;
      this.isProgressBar = true;
      for (let i = 0; i < this.updated_ongoing_production_quantity.length; i++) {
        // create object for raw_material_quantity insert in tbl_production table
        let updated_ongoing_production = {
          'production_id': this.productionData[card_index].production_id,
          'raw_material_id': raw_material_id[i],
          'raw_material_quantity': parseInt(this.updated_ongoing_production_quantity[i]),
          'session_id': localStorage.getItem('session_id'),
          'updated_date': this.global.getDateZone(),
          'updated_time': this.global.getTimeZone()
        };
        // update raw_material_quantity in tbl_production_raw_material_quantity
        this.productionService.updateProductionRawMaterialsQuantity(updated_ongoing_production).subscribe((update_raw_material: any) => {
          this.productionService.getProduction().subscribe((getProduction: any) => {
            this.productionData = this.global.tableIndex(getProduction.data);
            for (let i = 0; i < this.productionData.length; i++) {
              this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
              for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
                this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
              }
            }
            this.isProgressBar = false;
            if (this.productionData.length > 0) {
              this.is_data = false;
              this.is_show = true;
              this.is_ongoing_table = true;
            } else if (this.productionData.length === 0) {
              this.is_ongoing_table = false;
              this.is_data = true;
              this.is_show = false;
            }
          })
        })
      }
      // if (getProduction.success === true) {
      for (let i = 0; i < raw_material_id.length; i++) {
        // substract old quantity from update new quantity
        final_updated_ongoing_production_quantity = (Number(old_ongoing_production_quantity[i]) - this.updated_ongoing_production_quantity[i])
        // create payload in for raw Material 
        let updated_raw_material_info = {
          'raw_material_id': raw_material_id[i],
          'raw_material_quantity': final_updated_ongoing_production_quantity,
          'session_id': localStorage.getItem('session_id'),
          'updated_date': this.global.getDateZone(),
          'updated_time': this.global.getTimeZone()
        };
        this.rawMaterialService.updateRawMaterialQuantityAdd(updated_raw_material_info).subscribe((updateRawMaterialQuantity: any) => {
          if (updateRawMaterialQuantity.success === true) {
            this.productionService.getProduction().subscribe((getProduction: any) => {
              this.productionData = this.global.tableIndex(getProduction.data);
              for (let i = 0; i < this.productionData.length; i++) {
                this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
                for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
                  this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
                }
              }
              this.isProgressBar = false;
              if (this.productionData.length > 0) {
                this.is_data = false;
                this.is_show = true;
                this.is_ongoing_table = true;
              } else if (this.productionData.length === 0) {
                this.is_ongoing_table = false;
                this.is_data = true;
                this.is_show = false;
              }
            })
            this.toastr.success("Raw Material Information Successfully Updated");
            this.onClickreset();
          }
        });
      }
    } else {
      this.isProgressBar = false;
    }
  }

  onClickreset() {
    this.updated_ongoing_production_quantity = [null];
  }

  inventory(event) {
    this.inventoryForm.patchValue({
      inventory_id: this.arr_product_inventory.find((d) => d.inventory_name === event.value).inventory_id,
      inventory_unit: this.arr_product_inventory.find((d) => d.inventory_name === event.value).inventory_unit,
    });
  }

  tblStopProduction(card_index) {
    // card collapse one by one
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index;
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("stop_production" + this.old_card_index).classList.remove("show");
        this.old_card_index = card_index;
      }
    }

    this.arr_product_inventory = [];
    this.arr_product_inventory = this.all_inventory.filter(
      (d) => d.product_form === parseInt(this.productionData[card_index].product_form)
    );
  }

  stopOngoingProduction(production_id, card_index) {
    this.is_past_table = false;
    this.isProgressBar_past = true;
    let product_id_stop = {
      'production_id': production_id,
      'end_date': this.global.getDateZone(),
      'end_time': this.global.getTimeZone(),
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    this.is_valid = true;
    // find other inventory details
    this.arr_other_inventory.map((d, index) => {
      this.other_inventory_id[index] = this.arr_other_inventory[index].inventory_id;
    });
    // store inventory quantity from database
    let stock_other_product_inventory_quantity = [];
    this.arr_other_inventory.map((d, index) => {
      stock_other_product_inventory_quantity[index] = this.arr_other_inventory[index].inventory_quantity;
    });
    // store user select inventory and user insert inventory quantity
    this.product_inventory_id = this.inventoryForm.get("inventory_id").value;
    this.product_inventory_quantity = this.inventoryForm.get("inventory_quantity").value;
    // find stock inventory quantity
    let stock_product_inventory_quantity = this.arr_product_inventory.find((d) => d.inventory_id === this.product_inventory_id)?.inventory_quantity;
    // find stock inventory name
    let stock_product_inventory_name = this.arr_product_inventory.find((d) => d.inventory_id === this.product_inventory_id)?.inventory_name;
    // if form valid
    if (this.inventoryForm.valid) {
      // select inventory
      if (this.inventoryForm.get("inventory_name").value === "") {
        this.toastr.error("Please Select Any One Inventory");
        this.is_valid = false;
      }
      // inventory not empty
      else if (this.product_inventory_quantity === "" || this.product_inventory_quantity === null) {
        this.toastr.error("Inventory Quantity is empty");
        this.is_valid = false;
      }
      // invenotry quantity is less than or equal to stock inventory quantity
      else if (this.product_inventory_quantity > stock_product_inventory_quantity) {
        this.toastr.error("Please valid quantity for " + stock_product_inventory_name + ". quantity must be less than or equal to " + stock_product_inventory_quantity);
        this.is_valid = false;
        skip;
      }
      // inventory quantity is not less than 0
      else if (Math.sign(this.product_inventory_quantity) === 0) {
        this.toastr.error("Quantity is equal to 0");
        this.is_valid = false;
      }
      //  for other inventory
      else {
        for (let i = 0; i < this.arr_other_inventory.length; i++) {
          // for other inventory null
          if (this.other_inventory_quantity[i] === null || this.other_inventory_quantity[i] === "") {
            this.other_inventory_quantity[i] = 0;
            this.is_valid = true;
          }
          // for other inventory is not less than 0
          else if (this.other_inventory_quantity[i] < 0) {
            this.is_valid = false;
            break;
          }
          // for other inventory is equal to or  less than stock other inventory
          else if (this.other_inventory_quantity[i] > stock_other_product_inventory_quantity[i]) {
            this.other_inventory_quantity[i] = 0;
            this.toastr.error("Please enter quantity less than " + stock_other_product_inventory_quantity[i] + ".");
            this.is_valid = false;
          }
          // all field or conditions all fully satisfied
          else {
            this.is_valid = true;
          }
        }
      }
    }
    // fill all field
    else {
      this.is_valid = false;
      this.toastr.error("Please enter all the field");
    }
    //  if all field fill
    if (this.is_valid) {
      // insert inventory id and quantity in tbl_production
      let arr_inventory_id = [];
      let arr_inventory_qty = [];

      arr_inventory_id[0] = this.product_inventory_id;
      arr_inventory_qty[0] = this.product_inventory_quantity;

      for (let i = 1; i <= this.arr_other_inventory.length; i++) {
        arr_inventory_id[i] = this.arr_other_inventory[i - 1].inventory_id;

      }
      for (let i = 1; i <= this.arr_other_inventory.length; i++) {
        arr_inventory_qty[i] = this.other_inventory_quantity[i - 1];
      }

      for (let i = 0; i < arr_inventory_id.length; i++) {
        let production_info = {
          'production_id': this.productionData[card_index].production_id,
          'inventory_id': arr_inventory_id[i],
          'inventory_quantity': arr_inventory_qty[i],
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone(),
          'updated_date': this.global.getDateZone(),
          'updated_time': this.global.getTimeZone()
        };
        this.inventoryService.updateInventoryQuantitySub(production_info).subscribe((inventorySubstract) => {
          this.productionService.stopProduction(production_info).subscribe((stopProduction) => {
            this.productionService.deleteStopProduction(product_id_stop).subscribe((deleteStopProduction) => {
              this.productionService.getProduction().subscribe((getProduction: any) => {
                this.productionData = this.global.tableIndex(getProduction.data);
                for (let i = 0; i < this.productionData.length; i++) {
                  this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
                  for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
                    this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
                  }
                }
                this.isProgressBar = false;
                if (this.productionData.length > 0) {
                  this.is_data = false;
                  this.is_show = true;
                  this.is_ongoing_table = true;
                } else if (this.productionData.length === 0) {
                  this.is_ongoing_table = false;
                  this.is_data = true;
                  this.is_show = false;
                }
              });
              this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
                this.stop_production_data = this.global.tableIndex(getProductionTable.data);
                for (let i = 0; i < this.stop_production_data.length; i++) {
                  this.stop_production_data[i].raw_material_quantity = this.stop_production_data[i].raw_material_quantity.split(',')
                  this.stop_production_data[i].inventory_qty = this.stop_production_data[i].inventory_qty.split(',')
                  for (let j = 0; j < this.stop_production_data[i].raw_material_quantity.length; j++) {
                    this.stop_production_data[i].raw_material_quantity[j] = parseInt(this.stop_production_data[i].raw_material_quantity[j]).toLocaleString('en-IN')
                    this.stop_production_data[i].inventory_qty[j] = parseInt(this.stop_production_data[i].inventory_qty[j]).toLocaleString('en-IN')
                  }
                }
                this.isProgressBar_past = false;
                if (this.stop_production_data.length > 0) {
                  this.is_data_past = false;
                  this.is_show_past = true;
                  this.is_past_table = true;
                } else if (this.stop_production_data.length === 0) {
                  this.is_past_table = false;
                  this.is_data_past = true;
                  this.is_show_past = false;
                }
              });
            })
          });
        })
      }
      this.toastr.success("Successfully Start Production ");
      this.productionService.getProduction().subscribe((getProduction: any) => {
        this.productionData = getProduction.data;
      });
      this.clickReset();
      // insert the product info in tbl_product_stock
      let product_stock = {
        'category_id': this.productionData[card_index].category_id,
        'product_id': this.productionData[card_index].product_id,
        'inventory_id': this.product_inventory_id,
        'quantity': this.product_inventory_quantity,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone(),
        'updated_date': this.global.getDateZone(),
        'updated_time': this.global.getTimeZone()
      };
      // get inventory
      this.productionService.getStockIdWise(product_stock).subscribe((insertInventory: any) => {
        if (insertInventory.data.length > 0) {
          this.productionService.addProductStock(product_stock).subscribe((getProductionT: any) => {
          });
        } else {
          this.productionService.createProductStock(product_stock).subscribe((createProductStock: any) => {
          });
        }
      });
    } else {
      this.isProgressBar_past = false;
    }
  }

  clickReset() {
    this.inventoryForm.reset();
    this.other_inventory_quantity = [null];
  }

  deleteOngoingProduction(production_id, card_index) {
    let delete_ongoing_production = {
      'production_id': production_id,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone()
    };

    let tmp_raw_material_ids = this.productionData[card_index].raw_material_id.split(",");
    let tmp_raw_material_qtys = this.productionData[card_index].raw_material_quantity;
    for (let i = 0; i < tmp_raw_material_ids.length; i++) {
      let raw_material = {
        'raw_material_id': tmp_raw_material_ids[i],
        'raw_material_quantity': parseInt(tmp_raw_material_qtys[i].split(",").join('')),
        'session_id': localStorage.getItem('session_id'),
        'updated_date': this.global.getDateZone()
      };
      this.rawMaterialService.updateRawMaterialQuantityAdd(raw_material).subscribe((rawMaterialQuantityAdd) => { });
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure want to Delete Ongoing Production?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.is_ongoing_table = false;
          this.isProgressBar = true;
          this.productionService.deleteProduciton(delete_ongoing_production).subscribe((deleteProduciton) => {
            this.productionService.deleteProductionRawMaterial(delete_ongoing_production).subscribe((deleteRawMaterial) => {
              this.productionService.getProduction().subscribe((getProduction: any) => {
                this.productionData = this.global.tableIndex(getProduction.data);
                for (let i = 0; i < this.productionData.length; i++) {
                  this.productionData[i].raw_material_quantity = this.productionData[i].raw_material_quantity.split(',')
                  for (let j = 0; j < this.productionData[i].raw_material_quantity.length; j++) {
                    this.productionData[i].raw_material_quantity[j] = parseInt(this.productionData[i].raw_material_quantity[j]).toLocaleString('en-IN')
                  }
                }
                this.isProgressBar = false;
                if (this.productionData.length > 0) {
                  this.is_data = false;
                  this.is_show = true;
                  this.is_ongoing_table = true;
                } else if (this.productionData.length === 0) {
                  this.is_ongoing_table = false;
                  this.is_data = true;
                  this.is_show = false;
                }
              });
              this.toastr.success("Raw Material Quantity Successfully Added");
            })
          });
          Swal.fire({
            icon: "success",
            title: "Your Ongoing Production has beeen deleted.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your Ongoing Production is safe :)",
            "error"
          );
        }
      });
  }

  deletePastProduction(production_id, card_index) {
    let delete_past_production = {
      'production_id': production_id,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone()
    };
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure want to Delete Ongoing Production?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.is_past_table = false;
          this.isProgressBar_past = true;
          this.productionService.deletePastProduciton(delete_past_production).subscribe((deleteProduciton) => {
            this.productionService.getProductionTable().subscribe((getProductionTable: any) => {
              this.stop_production_data = this.global.tableIndex(getProductionTable.data);
              for (let i = 0; i < this.stop_production_data.length; i++) {
                this.stop_production_data[i].raw_material_quantity = this.stop_production_data[i].raw_material_quantity.split(',')
                this.stop_production_data[i].inventory_qty = this.stop_production_data[i].inventory_qty.split(',')
                for (let j = 0; j < this.stop_production_data[i].raw_material_quantity.length; j++) {
                  this.stop_production_data[i].raw_material_quantity[j] = parseInt(this.stop_production_data[i].raw_material_quantity[j]).toLocaleString('en-IN')
                  this.stop_production_data[i].inventory_qty[j] = parseInt(this.stop_production_data[i].inventory_qty[j]).toLocaleString('en-IN')
                }
              }
              this.isProgressBar_past = false;
              if (this.stop_production_data.length > 0) {
                this.is_data_past = false;
                this.is_show_past = true;
                this.is_past_table = true;
              } else if (this.stop_production_data.length === 0) {
                this.is_past_table = false;
                this.is_data_past = true;
                this.is_show_past = false;
              }
            });
            this.toastr.success("Past Production deleted successfully");
          });
          Swal.fire({
            icon: "success",
            title: "Your Ongoing Production has beeen deleted.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your Past Production is safe :)",
            "error"
          );
        }
      });
  }
}