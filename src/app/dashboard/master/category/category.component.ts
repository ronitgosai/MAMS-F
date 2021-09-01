import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ProductCategoryService } from 'app/services/dashboard/master/product-category.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private productCategoryService: ProductCategoryService,
    private titelService: Title,
    private toastr: ToastrService,
  ) {
    titelService.setTitle("Category | Modern Agrichem")
  }

  categoryForm: FormGroup;
  updateCategoryForm: FormGroup;

  category = [];
  categoryBackup = [];


  isProgressBar: boolean;

  oldCardIndex: any;
  categoryName: any;
  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  pickerColor;

  ngOnInit(): void {
    this.isProgressBar = true;
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required]],
      categoryColor: ['', [Validators.required]]
    })

    this.updateCategoryForm = this.formBuilder.group({
      updateCategoryName: ['', [Validators.required]],
      updateCategoryColor: ['', [Validators.required]]
    })

    this.getProductCategory();
  }

  getProductCategory() {
    this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
      this.category = this.global.tableIndex(categoryName.data);
      this.categoryBackup = this.category;
      this.isProgressBar = false;
    })
  }

  search() {
    if(this.categoryName === ''){
      this.category = this.categoryBackup
    }else{
      this.category = this.categoryBackup.filter(res => {
        return res.category_name.toLowerCase().match(this.categoryName.toLowerCase());
      })
    }
  }

  // colorChange()

  pagination(event) {
  }

  insertCategory() {
    this.pickerColor = this.categoryForm.get('categoryColor').value.hex;
    let category = {
      'category_name': this.categoryForm.get('categoryName').value,
      'category_color': '#' + this.categoryForm.get('categoryColor').value.hex,
      'session_id': localStorage.getItem('session_id'),
      'created_date': this.global.getDateZone(),
      'created_time': this.global.getTimeZone()
    }
    if (this.categoryForm.valid) {
      this.productCategoryService.createMasterProductCategory(category).subscribe(cateCategory => {
        this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
          this.category = this.global.tableIndex(categoryName.data)
        })
      })
      this.toastr.success("Product Category " + this.categoryForm.get('categoryName').value + " added successfully.");
      this.categoryForm.reset();
      document.getElementById('collapseButton').click();
    }else{
      this.toastr.error("Please enter valid data")
    }
  }

  editCategory(categoryId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById("categoryInfo" + this.oldCardIndex).classList.remove('show')
        this.oldCardIndex = cardIndex
      }
    }
    let editData = this.category.find(d => d.category_id === categoryId)
    this.updateCategoryForm.patchValue({
      updateCategoryName: editData.category_name,
      updateCategoryColor: editData.category_color,
    })
  }

  updateCategory(id) {
    let updateCategoryInfo = {
      'category_id': id,
      'category_name': this.updateCategoryForm.get('updateCategoryName').value,
      'category_color': '#' + this.updateCategoryForm.get('updateCategoryColor').value.hex,
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
        title: "Are you sure want to update " + this.updateCategoryForm.get('updateCategoryName').value + ' Product Category Information ?',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (this.updateCategoryForm.valid) {
            this.productCategoryService.updateMasterProductCategory(updateCategoryInfo).subscribe((data) => {
              this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
                this.category = this.global.tableIndex(categoryName.data)
              });
              this.toastr.success(this.updateCategoryForm.get('updateCategoryName').value + " Category Successfully updated!")
              this.updateCategoryForm.reset();
              Swal.fire({
                icon: 'success',
                title: ' Category has beeen updated.',
                showConfirmButton: false,
                timer: 1500,
              })
            },
              (err) => {
                this.toastr.success("Something went wrong, Relaod the page and try again.")
              })
          }
          else {
            this.toastr.error("Please enter Updated Name.")
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Product Category are unchanged ",
            "error"
          );
        }
      }
      );
  }

  deleteCategory(id, name) {
    let deletData = {
      'category_id': id,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to delete Category ' + name + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productCategoryService.deleteMasterProductCategory(deletData).subscribe(data => {
          this.productCategoryService.getMasterProductCategory().subscribe((categoryName: any) => {
            this.category = this.global.tableIndex(categoryName.data)
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Category ' + name + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Category is safe :)',
          'error'
        )
      }
    })
  }
}
