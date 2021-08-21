import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { StaffService } from 'app/services/dashboard/staff/staff.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  constructor(
    private titelService: Title,
    private staffService: StaffService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Staff | Modern Agrichem")
  }

  staffForm: FormGroup;
  updateStaffForm: FormGroup;
  updateStaffPassword: FormGroup;

  is_submitted: boolean;
  isProgressBar: boolean;
  is_table: boolean;
  is_data: boolean;

  obj_staff_data = [];
  obj_staff_data_backup = [];
  old_card_index;
  old_card_index_password;
  hide = true;
  hidden = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  full_name: any;
  p: number = 1;
  entries_per_page: any = '10';
  value = 'Clear me';

  ngOnInit(): void {
    this.is_table = false;
    this.isProgressBar = true;
    this.is_data = false;

    this.staffService.getStaff().subscribe((getStaff: any) => {
      this.obj_staff_data = this.global.tableIndex(getStaff.data)
      this.obj_staff_data_backup = this.obj_staff_data
      this.isProgressBar = false;
      if (this.obj_staff_data.length > 0) {
        this.is_data = false;
        this.is_table = true;
      } else if (this.obj_staff_data.length === 0) {
        this.is_table = false;
        this.is_data = true;
      }
    })

    this.staffForm = this.formBuilder.group({
      full_name: ['', [Validators.required, this.global.noWhitespaceValidator]],
      user_email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, this.global.noWhitespaceValidator]],
      password: ['', [Validators.required, this.global.noWhitespaceValidator]],
      confirm_password: ['', [Validators.required, this.matchValues('password'), this.global.noWhitespaceValidator]],
      user_contact: ['', [Validators.required]],
      user_role: ['', [Validators.required]],
    });

    this.updateStaffForm = this.formBuilder.group({
      update_full_name: ['', [Validators.required]],
      update_user_email: ['', [Validators.required]],
      update_user_contact: ['', [Validators.required]],
    })

    this.updateStaffPassword = this.formBuilder.group({
      new_password: ['', [Validators.required, this.global.noWhitespaceValidator]],
      new_confirm_password: ['', [Validators.required, this.matchValuesNewPassword('new_password'), this.global.noWhitespaceValidator]],
    })
  }

  matchValues(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

  matchValuesNewPassword(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatchingNewPassword: false };
    };
  }

  // noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }

  search() {
    if (this.full_name === '') {
      this.obj_staff_data = this.obj_staff_data_backup
    } else {
      this.obj_staff_data = this.obj_staff_data_backup.filter(d => {
        return d.full_name.toLowerCase().match(this.full_name.toLowerCase());
      })
    }
  }

  pagination(event) {
  }

  insertUser() {
    this.is_submitted = true;
    this.is_table = false;
    this.isProgressBar = true;
    if (this.staffForm.valid) {
      let staffInfo = {
        'user_role': this.staffForm.get('user_role').value,
        'full_name': this.staffForm.get('full_name').value,
        'user_email': this.staffForm.get('user_email').value,
        'user_contact': this.staffForm.get('user_contact').value,
        'username': this.staffForm.get('username').value,
        'password': this.staffForm.get('password').value,
        'confirm_password': this.staffForm.get('confirm_password').value,
        'created_date': this.global.getDateZone()
      }
      this.staffService.createStaff(staffInfo).subscribe(data => {
        this.staffService.getStaff().subscribe((getStaff: any) => {
          this.obj_staff_data = this.global.tableIndex(getStaff.data)
          this.isProgressBar = false;
          if (this.obj_staff_data.length > 0) {
            this.is_data = false;
            this.is_table = true;
          } else if (this.obj_staff_data.length === 0) {
            this.is_table = false;
            this.is_data = true;
          }
        })
      })
      this.toastr.success('Successfully added staff');
      this.staffForm.reset();
      // this.is_submitted = fla;
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.is_table = true;
      this.toastr.error("Please fill the form!")
    }
  }

  editStaff(user_id, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("staffInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }
    let editData = this.obj_staff_data.find(d => d.user_id === user_id)
    this.updateStaffForm.patchValue({
      update_full_name: editData.full_name,
      update_user_email: editData.user_email,
      update_user_contact: editData.user_contact
    })
  }

  editStaffPassword(user_id, card_index) {
    if (this.old_card_index_password === undefined) {
      this.old_card_index_password = card_index
    } else {
      if (this.old_card_index_password !== card_index) {
        let id = document.getElementById("staffPassword" + this.old_card_index_password).classList.remove('show')
        this.old_card_index_password = card_index
      }
    }
  }

  updateUserInfo(user_id) {
    let update_user_info = {
      "user_id": user_id,
      "full_name": this.updateStaffForm.get('update_full_name').value,
      "user_email": this.updateStaffForm.get('update_user_email').value,
      "user_contact": this.updateStaffForm.get('update_user_contact').value,
      'updated_date': this.global.getDateZone()
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to Update Staff Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateStaffForm.get('update_full_name').value || this.updateStaffForm.get('update_user_email').value || this.updateStaffForm.get('update_user_contact').value) {
          this.is_table = false;
          this.isProgressBar = true;
          this.staffService.updateStaff(update_user_info).subscribe((data) => {
            this.staffService.getStaff().subscribe((getStaff: any) => {
              this.obj_staff_data = this.global.tableIndex(getStaff.data)
              this.isProgressBar = false;
              if (this.obj_staff_data.length > 0) {
                this.is_data = false;
                this.is_table = true;
              } else if (this.obj_staff_data.length === 0) {
                this.is_table = false;
                this.is_data = true;
              }
            });
            this.toastr.success("Staff Info Successfully updated!");
            this.updateStaffForm.reset();
            Swal.fire({
              icon: 'success',
              title: "Your Staff Details has been Updated",
              showConfirmButton: false,
              timer: 1500
            })
          },
            (err) => {
              this.toastr.success("Something goes wrong!")
            }
          )
        }
        else {
          this.toastr.error("please enter either of one value")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Staff Details are unchanged :)',
          'error'
        )
      }
    })
  }

  updateUserPassword(user_id) {
    let update_new_password = {
      "user_id": user_id,
      "password": this.updateStaffPassword.get('new_password').value,
      'updated_date': this.global.getDateZone()
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to Update Staff Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateStaffPassword.get('new_password').value && this.updateStaffPassword.get('new_confirm_password').value) {
          if (this.updateStaffPassword.get('new_password').value === this.updateStaffPassword.get('new_confirm_password').value) {
            this.is_table = false;
            this.isProgressBar = true;
            this.staffService.updateStaffPassword(update_new_password).subscribe((data) => {
              this.staffService.getStaff().subscribe((getStaff: any) => {
                this.obj_staff_data = this.global.tableIndex(getStaff.data)
                this.isProgressBar = false;
                if (this.obj_staff_data.length > 0) {
                  this.is_data = false;
                  this.is_table = true;
                } else if (this.obj_staff_data.length === 0) {
                  this.is_table = false;
                  this.is_data = true;
                }
              });
              this.toastr.success("Staff Password Successfully updated!");
              this.updateStaffPassword.reset();
              Swal.fire({
                icon: 'success',
                title: "Your Staff Password has been Updated",
                showConfirmButton: false,
                timer: 1500
              })
            },
              (err) => {
                this.toastr.success("Something goes wrong!")
              }
            )
          } else {
            this.toastr.error("New Password and Confirm New Password doesn't match!")
          }
        } else {
          this.toastr.error("Please enter both value")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Staff Password are unchanged :)',
          'error'
        )
      }
    })
  }

  deleteStaff(staff_id) {
    let delete_staff = {
      "user_id": staff_id,
      'updated_date': this.global.getDateZone()
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to delete Staff?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.is_table = false;
        this.isProgressBar = true;
        this.staffService.deleteStaff(delete_staff).subscribe(data => {
          this.staffService.getStaff().subscribe((getStaff: any) => {
            this.obj_staff_data = this.global.tableIndex(getStaff.data)
            this.isProgressBar = false;
            if (this.obj_staff_data.length > 0) {
              this.is_data = false;
              this.is_table = true;
            } else if (this.obj_staff_data.length === 0) {
              this.is_table = false;
              this.is_data = true;
            }
          })
        })
        Swal.fire({
          icon: 'warning',
          title: "Your Staff Details has been Deleted",
          showConfirmButton: false,
          timer: 1500
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Staff Details are safe :)',
          'error'
        )
      }
    })
  }
}