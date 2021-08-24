import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ShiftService } from 'app/services/dashboard/master/shift.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private shiftService: ShiftService,
    private global: GlobalService,
    private toastr: ToastrService,
    private titelService: Title,
  ) {
    titelService.setTitle("Master | Modern Agrichem")
  }

  shiftForm: FormGroup;
  updateShiftForm: FormGroup;

  shiftDetails = [];
  shiftDetailsBackup = [];

  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';
  shiftName: any;
  old_card_index: any;

  ngOnInit(): void {
    this.shiftForm = this.formBuilder.group({
      shiftName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })

    this.updateShiftForm = this.formBuilder.group({
      updateShiftName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })
    this.getShift();
  }

  getShift() {
    this.shiftService.getMasterShift().subscribe((masterShift: any) => {
      this.shiftDetails = this.global.tableIndex(masterShift.data);
      this.shiftDetailsBackup = this.shiftDetails;
      this.isProgressBar = false;
      if (this.shiftDetails.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.shiftDetails.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  search() {
    if (this.shiftName === '') {
      this.shiftDetails = this.shiftDetailsBackup
    } else {
      this.shiftDetails = this.shiftDetailsBackup.filter(res => {
        return res.shift_name.toLowerCase().match(this.shiftName.toLowerCase());
      })
    }
  }

  pagination(event) { }

  insertShift() {
    this.isTable = false;
    this.isProgressBar = true;
    if (this.shiftForm.valid) {
      let shiftInfo = {
        'shift_name': this.shiftForm.get('shiftName').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.shiftService.createMasterShift(shiftInfo).subscribe(shift => {
        this.shiftService.getMasterShift().subscribe((masterShift: any) => {
          this.shiftDetails = this.global.tableIndex(masterShift.data)
          this.isProgressBar = false;
          if (this.shiftDetails.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.shiftDetails.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success("Shift" + this.shiftForm.get('shiftName').value + " added successfully.");
      this.shiftForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
      this.toastr.error("Please input valid data.");
    }
  }

  editShift(shiftId, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("shiftInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }
    let editData = this.shiftDetails.find(d => d.shift_id === shiftId)
    this.updateShiftForm.patchValue({
      updateShiftName: editData.shift_name,
    })
  }

  updateShift(shiftId, shiftName) {
    let updateShift = {
      'shift_id': shiftId,
      'shift_name': this.updateShiftForm.get('updateShiftName').value,
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
      title: 'Are you sure want to update ' + this.updateShiftForm.get('updateShiftName').value + ' Shift Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateShiftForm.get('updateShiftName').value) {
          this.isTable = false;
          this.isProgressBar = true;
          this.shiftService.updateMasterShift(updateShift).subscribe((data) => {
            this.shiftService.getMasterShift().subscribe((masterShift: any) => {
              this.shiftDetails = this.global.tableIndex(masterShift.data)
              this.isProgressBar = false;
              if (this.shiftDetails.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.shiftDetails.length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
            this.toastr.success(this.updateShiftForm.get('updateShiftName').value + " Shift Name Successfully updated!")
            this.updateShiftForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Shift has beeen updated.',
              showConfirmButton: false,
              timer: 1500,
            })
          },
            (err) => {
              this.toastr.error("Something went wrong, Relaod the page and try again.")
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
          'Cancelled',
          'Shift is unchanged.',
          'error'
        )
      }
    })
  }

  deleteShift(id, name) {
    let deletData = {
      'shift_id': id,
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
      title: 'Are you sure want to delete Shift ' + name + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProgressBar = true;
        this.shiftService.deleteMasterShift(deletData).subscribe(data => {
          this.shiftService.getMasterShift().subscribe((masterShift: any) => {
            this.shiftDetails = this.global.tableIndex(masterShift.data)
            this.isProgressBar = false;
            if (this.shiftDetails.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.shiftDetails.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          });
        })
        Swal.fire({
          icon: 'success',
          title: 'Shift ' + name + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Shift  is safe :)',
          'error'
        )
      }
    })
  }
}

