import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { WorkAreaService } from 'app/services/dashboard/master/work-area.service';
// import { workAreaService } from 'app/services/dashboard/master/networkServiceProvider.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-work-area',
  templateUrl: './work-area.component.html',
  styleUrls: ['./work-area.component.scss']
})
export class WorkAreaComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private workAreaService: WorkAreaService,
    private global: GlobalService,
    private toastr: ToastrService,
    private titelService: Title,
  ) {
    titelService.setTitle("Network Service Provider | Modern Agrichem")
  }

  workAreaForm: FormGroup;
  updateWorkAreaForm: FormGroup;

  workArea = [];
  workAreaBackup = [];

  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';
  workAreName: any;
  old_card_index: any;

  ngOnInit(): void {
    this.workAreaForm = this.formBuilder.group({
      workAreaName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })

    this.updateWorkAreaForm = this.formBuilder.group({
      updateWorkAreaName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })
    this.getWorkArea();
  }

  getWorkArea() {
    this.workAreaService.getMasterWorkArea().subscribe((insetrWorkArea: any) => {
      this.workArea = this.global.tableIndex(insetrWorkArea.data);
      this.workAreaBackup = this.workArea;
      this.isProgressBar = false;
      if (this.workArea.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.workArea.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  search(){
    if(this.workAreName === ''){
      this.workArea = this.workAreaBackup
    }else{
      this.workArea = this.workAreaBackup.filter(res => {
        return res.work_area_name.toLowerCase().match(this.workAreName.toLowerCase());
      })
    }
  }

  pagination(event) { }

  insertWorkArea() {
    this.isTable = false;
    this.isProgressBar = true;
    if (this.workAreaForm.valid) {
      let workAreaInfo = {
        'work_area_name': this.workAreaForm.get('workAreaName').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.workAreaService.createMasterWorkArea(workAreaInfo).subscribe(workArea => {
        this.workAreaService.getMasterWorkArea().subscribe((matserWorkArea: any) => {
          this.workArea = this.global.tableIndex(matserWorkArea.data)
          this.isProgressBar = false;
          if (this.workArea.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.workArea.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success("Work Area" + this.workAreaForm.get('workAreaName').value + " added successfully.");
      this.workAreaForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
      this.toastr.error("Please input valid data.");
    }
  }

  editWorkArea(workAreaId, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("workAreaInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }
    let editData = this.workArea.find(d => d.work_area_id === workAreaId)
    this.updateWorkAreaForm.patchValue({
      updateWorkAreaName: editData.work_area_name,
    })
  }

  updateWorkArea(workAreaId) {
    let updateWorkArea = {
      'work_area_id': workAreaId,
      'work_area_name': this.updateWorkAreaForm.get('updateWorkAreaName').value,
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
      title: 'Are you sure want to update ' + this.updateWorkAreaForm.get('updateWorkAreaName').value + ' Work Area Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateWorkAreaForm.get('updateWorkAreaName').value) {
          this.isTable = false;
          this.isProgressBar = true;
          this.workAreaService.updateMasterWorkArea(updateWorkArea).subscribe((updateWork) => {
            this.workAreaService.getMasterWorkArea().subscribe((matserWorkArea: any) => {
              this.workArea = this.global.tableIndex(matserWorkArea.data)
              this.isProgressBar = false;
              if (this.workArea.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.workArea.length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
            this.toastr.success(this.updateWorkAreaForm.get('updateWorkAreaName').value + " Work Area Name Successfully updated!")
            this.updateWorkAreaForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Work Area has beeen updated.',
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
          'Work Area is unchanged.',
          'error'
        )
      }
    })
  }

  deleteWorkArea(workAreaId,workAreaName) {
    let deletData = {
      'work_area_id': workAreaId,
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
      title: 'Are you sure want to delete Work  ' + workAreaName + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isTable = false;
        this.isProgressBar = true;
        this.workAreaService.deleteMasterWorkArea(deletData).subscribe(data => {
          this.workAreaService.getMasterWorkArea().subscribe((matserWorkArea: any) => {
            this.workArea = this.global.tableIndex(matserWorkArea.data)
            this.isProgressBar = false;
            if (this.workArea.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.workArea.length === 0) {
              this.isTable = false; 
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Work Area ' + workAreaName + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Work Area  is safe :)',
          'error'
        )
      }
    })
  }
}
