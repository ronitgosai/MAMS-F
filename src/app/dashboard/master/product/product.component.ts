import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from "sweetalert2";
import { RawMaterialService } from 'app/services/dashboard/raw-material/raw-material.service';
import { GlobalService } from 'app/services/global.service';
import { ProductCategoryService } from 'app/services/dashboard/master/product-category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private titelService: Title,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private rawMaterialService: RawMaterialService,
    private productCategoryService: ProductCategoryService,
    private toastr: ToastrService,
    private global: GlobalService,
    private router: Router
  ) {
    titelService.setTitle("Product | Modern Agrichem")
  }

  isSubmitted: boolean = false;
  isProgressBar: boolean;
  is_table: boolean;
  is_data: boolean;
  productForm: FormGroup;
  productDocumentForm: FormGroup;
  rawMaterialForm: FormGroup;
  importRawMaterialForm: FormGroup;

  arr_product_data = [];
  arr_product_data_backup = [];
  arr_raw_data = [];
  productData = [];
  category = [];

  raw_materials: any;
  product_name: any;
  p: number = 1;
  entries_per_page: any = '10';
  raw_material = [];
  value = 'Clear me';

  fileDetails: { file: any; name: any; size: string; };

  protected _onDestroy = new Subject<void>();
  public raw_material_multi_FilterCtrl: FormControl = new FormControl();
  public product_raw_name: FormControl = new FormControl();
  public filtered_raw_material_name_multi: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.is_table = false;
    this.isProgressBar = true;
    this.is_data = false;

    this.productForm = this.formBuilder.group({
      category_id: ['', [Validators.required]],
      product_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      product_technical_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      raw_material_id: ['', [Validators.required]],
      product_form: ['', [Validators.required]],
      product_description: ['', [Validators.required]],
    });

    this.productDocumentForm = this.formBuilder.group({
      product_document: [''],
      product_image: ['']
    })

    this.rawMaterialForm = this.formBuilder.group({
      raw_material_name: ['', [Validators.required]],
      raw_material_type: ['', [Validators.required]],
    })

    this.importRawMaterialForm = this.formBuilder.group({
      raw_material_id_import: [''],
      import_raw_material_name: ['', [Validators.required]],
      raw_material_quantity: ['', [Validators.required]],
      import_raw_material_type: [''],
      import_raw_material_date: ['', [Validators.required]]
    })

    this.rawMaterialService.getRawMaterial().subscribe((response: any) => {
      this.arr_raw_data = response.data

      this.filtered_raw_material_name_multi.next(response.data.slice());
      this.raw_material_multi_FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanks();
      });
    })

    this.getProductTable();
    this.getProductCategory();
  }

  getProductTable() {
    this.isProgressBar = true;
    this.productService.getProduct().subscribe((getProduct: any) => {
      this.arr_product_data = this.global.tableIndex(getProduct.data);
      this.arr_product_data_backup = this.arr_product_data;
      this.isProgressBar = false;
      if (this.arr_product_data.length > 0) {
        this.is_data = false;
        this.is_table = true;
      } else if (this.arr_product_data.length === 0) {
        this.is_table = false;
        this.is_data = true;
      }
    })
  }

  getProductCategory() {
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.category = this.global.tableIndex(categoryName.data);
    })
  }

  search() {
    if (this.product_name === '') {
      this.arr_product_data = this.arr_product_data_backup
    } else {
      this.arr_product_data = this.arr_product_data_backup.filter(d => {
        return (
          d.product_name.toLowerCase().match(this.product_name.toLowerCase()) ||
          d.product_technical_name.toLowerCase().match(this.product_name.toLowerCase()) ||
          (d.category_id === 0 && ('FUNGICIDES').toLowerCase().match(this.product_name.toLowerCase())) ||
          (d.category_id === 1 && ('HERBICIDES').toLowerCase().match(this.product_name.toLowerCase())) ||
          (d.category_id === 2 && ('INSECTICIDES').toLowerCase().match(this.product_name.toLowerCase()))
        )
      })
    }
  }

  pagination(event) {
  }

  toggleWebCam() {
    // throw new Error('Method not implemented.');
  }

  onImagePicked(event): void {
    let file = null;
    if (event.target) {
      file = (event.target as HTMLInputElement).files[0];
      this.setImageDetails(file);
    } else {
      fetch(event.imageAsDataUrl).then(res => res.blob()).then(blob => {
        file = new File([blob], 'image.png', blob);
        this.setImageDetails(file);
        this.toggleWebCam();
      });
    }
  }

  onFilePicked(event): void {
    let file = null;
    if (event.target) {
      file = (event.target as HTMLInputElement).files[0];
      this.setDocumentDetails(file);
    } else {
      fetch(event.pdfAsDataUrl).then(res => res.blob()).then(blob => {
        file = new File([blob], 'document.pdf', blob);
        this.setDocumentDetails(file);
        this.toggleWebCam();
      });
    }
  }

  setImageDetails(file): void {
    this.fileDetails = {
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2)
    };
    this.productDocumentForm.get('product_image').updateValueAndValidity();
    this.productDocumentForm.get('product_image').setValue(file);
  }

  setDocumentDetails(file): void {
    this.fileDetails = {
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2)
    };
    this.productDocumentForm.get('product_document').updateValueAndValidity();
    this.productDocumentForm.get('product_document').setValue(file);
  }

  insertProduct() {
    this.is_table = false;
    this.isProgressBar = true;
    let raw_material_id = this.productForm.get('raw_material_id').value
    let category_id = this.productForm.get('category_id').value
    if (this.productForm.valid) {
      const productDataForm = new FormData();
      if (productDataForm) {
        productDataForm.append('product_name', this.productForm.value.product_name),
          productDataForm.append('product_technical_name', this.productForm.value.product_technical_name),
          productDataForm.append('product_form', this.productForm.value.product_form),
          productDataForm.append('product_description', this.productForm.value.product_description),
          productDataForm.append('product_image', this.productDocumentForm.value.product_image),
          productDataForm.append('session_id', localStorage.getItem('session_id')),
          productDataForm.append('created_date', this.global.getDateZone()),
          productDataForm.append('created_time', this.global.getTimeZone())
      }
      this.productService.createProduct(productDataForm).subscribe((createProduct: any) => {
        const productDocument = new FormData();
        if (productDocument) {
          productDocument.append('product_id', createProduct.data.product_id),
            productDocument.append('product_document', this.productDocumentForm.value.product_document),
            productDocument.append('session_id', localStorage.getItem('session_id')),
            productDocument.append('created_date', this.global.getDateZone()),
            productDocument.append('created_time', this.global.getTimeZone())
        }
        this.productService.createProductDocument(productDocument).subscribe(document => {
          this.productService.getProduct().subscribe((getProduct: any) => {
            this.arr_product_data = this.global.tableIndex(getProduct.data);
            this.isProgressBar = false;
            if (this.arr_product_data.length > 0) {
              this.is_data = false;
              this.is_table = true;
            } else if (this.arr_product_data.length === 0) {
              this.is_table = false;
              this.is_data = true;
            }
          })
        })
        let category = {
          'product_id': createProduct.data.product_id,
          'category_id': category_id,
          'session_id': localStorage.getItem('session_id'),
          'created_date': this.global.getDateZone(),
          'created_time': this.global.getTimeZone()
        }
        this.productService.createProductCategory(category).subscribe((createCategory) => {
          this.productService.getProduct().subscribe((getProduct: any) => {
            this.arr_product_data = this.global.tableIndex(getProduct.data);
            this.isProgressBar = false;
            if (this.arr_product_data.length > 0) {
              this.is_data = false;
              this.is_table = true;
            } else if (this.arr_product_data.length === 0) {
              this.is_table = false;
              this.is_data = true;
            }
          })
        })
        raw_material_id.map((d, index) => {
          let raw_material = {
            'product_id': createProduct.data.product_id,
            'raw_material_id': raw_material_id[index],
            'session_id': localStorage.getItem('session_id'),
            'created_date': this.global.getDateZone(),
            'created_time': this.global.getTimeZone()
          }
          this.productService.createProductRawMaterial(raw_material).subscribe((createRawMaterial) => {
            this.productService.getProduct().subscribe((getProduct: any) => {
              this.arr_product_data = this.global.tableIndex(getProduct.data);
              this.isProgressBar = false;
              if (this.arr_product_data.length > 0) {
                this.is_data = false;
                this.is_table = true;
              } else if (this.arr_product_data.length === 0) {
                this.is_table = false;
                this.is_data = true;
              }
            })
          })
        })
      })
      this.productService.getProduct().subscribe((getProduct: any) => {
        this.arr_product_data = this.global.tableIndex(getProduct.data);
      })
      this.toastr.success("Product " + this.productForm.get('product_name').value + " add successfully");
      this.productForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.is_table = true;
      this.toastr.error("Please input all the field");
    }
  }

  viewProductDetails(productId) {
    const url = 'http://localhost:4200/dashboard/product-details/' + productId;
    window.open(url, '_blank').focus();
  }

  deleteProduct(delete_product, product_name) {
    let obj_delete_data = {
      'product_id': delete_product,
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
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure want to " + product_name + " Delete Product?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.is_table = false;
          this.isProgressBar = true;
          this.productService.deleteProduct(obj_delete_data).subscribe((data) => {
            this.productService.getProduct().subscribe((getProduct: any) => {
              this.arr_product_data = this.global.tableIndex(getProduct.data);
              this.isProgressBar = false;
              if (this.arr_product_data.length > 0) {
                this.is_data = false;
                this.is_table = true;
              } else if (this.arr_product_data.length === 0) {
                this.is_table = false;
                this.is_data = true;
              }
            });
          });
          Swal.fire({
            icon: 'success',
            title: 'Product has beeen deleted.',
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Product is safe.",
            "error"
          );
        }
      }
      );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.arr_raw_data) {
      return;
    }
    // get the search keyword
    let search = this.raw_material_multi_FilterCtrl.value;
    if (!search) {
      this.filtered_raw_material_name_multi.next(this.arr_raw_data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the raw material name
    this.filtered_raw_material_name_multi.next(
      this.arr_raw_data.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filtered_raw_material_name_multi.subscribe(d => {
    })
  }
}