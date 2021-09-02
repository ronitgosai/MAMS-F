import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NetWorkServiceProviderService } from 'app/services/dashboard/master/NetWorkServiceProvider.service';
import { ShiftService } from 'app/services/dashboard/master/shift.service';
import { WorkAreaService } from 'app/services/dashboard/master/work-area.service';
import { RegistrationService } from 'app/services/dashboard/registration/registration.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private titelService: Title,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService,
    private registrationService: RegistrationService,
    private workAreaService: WorkAreaService,
    private shiftService: ShiftService,
    private networkServiceProviderService: NetWorkServiceProviderService,
  ) {
    titelService.setTitle("User | Modern Agrichem")
  }

  userForm: FormGroup;
  updatedUserForm: FormGroup;

  fileDetails: { file: any; name: any; size: string; };

  staffDetails = [];
  staffDetailsBackup = [];
  workArea = [];
  shiftDetails = [];
  netWorkServiceProvider = [];

  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  staffName: any;
  card_name = null;
  oldCardIndex: any;
  salary: any;

  isProgressBar: boolean;
  isData: boolean;

  ngOnInit(): void {
    this.isProgressBar = true;
    this.isData = false;
    this.userForm = this.formBuilder.group({
      staffName: ['', [Validators.required]],
      staffWorkAreaId: ['', [Validators.required]],
      staffSalary: [''],
      staffShiftId: ['', [Validators.required]],
      staffMobileServiceProviderId: ['', [Validators.required]],
      staffMobileNumber: [''],
      staffIdProof: ['']
    })

    this.updatedUserForm = this.formBuilder.group({
      updateStaffName: ['', [Validators.required]],
      updateStaffWorkAreaId: ['', [Validators.required]],
      updateStaffSalary: ['', [Validators.required]],
      updateStaffShiftId: ['', [Validators.required]],
      updateStaffMobileServiceProviderId: ['', [Validators.required]],
      updateStaffMobileNumber: [''],
      updateStaffIdProof: ['']
    });


    this.getStaffDetails();
    this.getWorkArea();
    this.getShift();
    this.getMobileNetwork();
  }

  getStaffDetails() {
    this.isProgressBar = true;
    this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
      this.staffDetails = this.global.tableIndex(staffDetails.data);
      this.staffDetailsBackup = this.staffDetails;
      for (let i = 0; i < this.staffDetails.length; i++) {
        this.staffDetails[i].staff_salary = this.global.tableComma(this.staffDetails[i].staff_salary)
      }
      this.isProgressBar = false;
      if (this.staffDetails.length > 0) {
        this.isData = false;
      } else {
        this.isData = true;
      }
    })
  }

  getWorkArea() {
    this.workAreaService.getMasterWorkArea().subscribe((workArea: any) => {
      this.workArea = this.global.tableIndex(workArea.data)
    })
  }

  getShift() {
    this.shiftService.getMasterShift().subscribe((shift: any) => {
      this.shiftDetails = this.global.tableIndex(shift.data)
    })
  }

  getMobileNetwork() {
    this.networkServiceProviderService.getMasterNetworkServiceProvider().subscribe((mobileServiceProvider: any) => {
      this.netWorkServiceProvider = this.global.tableIndex(mobileServiceProvider.data)
    })
  }

  search() {
    if (this.staffName === '') {
      this.staffDetails = this.staffDetailsBackup
    } else {
      this.staffDetails = this.staffDetailsBackup.filter(res => {
        return res.staff_name.toLowerCase().match(this.staffName.toLowerCase());
      })
    }
  }

  pagination(event) { }

  printNumber() {
    this.userForm.patchValue({
      staffSalary: this.userForm.get('staffSalary').value === '' ? 0 : parseInt(this.userForm.get('staffSalary').value.split(',').join('')).toLocaleString('en-IN')
    })
  }

  onFilePicked(event): void {
    let file = null;
    if (event.target) {
      file = (event.target as HTMLInputElement).files[0];
      this.setFileDetails(file);
    } else {
      fetch(event.imageAsDataUrl).then(res => res.blob()).then(blob => {
        file = new File([blob], 'document.png', blob);
        this.setFileDetails(file);
        this.toggleWebCam();
      });
    }
  }

  setFileDetails(file): void {
    this.fileDetails = {
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2)
    };
    this.userForm.get('staffIdProof').updateValueAndValidity();
    this.updatedUserForm.get('updateStaffIdProof').updateValueAndValidity();
    this.userForm.get('staffIdProof').setValue(file);
    this.updatedUserForm.get('updateStaffIdProof').setValue(file);
  }

  toggleWebCam() {
    throw new Error('Method not implemented.');
  }

  insertStaff() {
    this.isProgressBar = true;
    const salary = parseInt(this.userForm.get('staffSalary').value.split(',').join(''));
    const userFileUpload = new FormData();
    if (userFileUpload) {
      userFileUpload.append('staffName', this.userForm.value.staffName),
        userFileUpload.append('staffWorkAreaId', this.userForm.value.staffWorkAreaId),
        userFileUpload.append('staffSalary', salary.toString()),
        userFileUpload.append('staffShiftId', this.userForm.value.staffShiftId),
        userFileUpload.append('mobileServiceProviderId', this.userForm.value.staffMobileServiceProviderId),
        userFileUpload.append('staffMobileNumber', this.userForm.value.staffMobileNumber),
        userFileUpload.append('staffIdProof', this.userForm.value.staffIdProof),
        userFileUpload.append('created_date', this.global.getDateZone()),
        userFileUpload.append('created_time', this.global.getTimeZone())
      this.registrationService.createStaff(userFileUpload).subscribe((createStaff) => {
        this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
          this.staffDetails = this.global.tableIndex(staffDetails.data);
          for (let i = 0; i < this.staffDetails.length; i++) {
            this.staffDetails[i].staff_salary = this.global.tableComma(this.staffDetails[i].staff_salary)
          }
          this.isProgressBar = false;
          if (this.staffDetails.length > 0) {
            this.isData = false;
          } else {
            this.isData = true;
          }
        })
      })
      this.userForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.toastr.error("Please fill and valid all fields!")
    }
  }

  editStaffInfo(staffId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById('staffInfo' + this.oldCardIndex).classList.remove('show')
        this.oldCardIndex = cardIndex
      }
    }
    let editData = this.staffDetails.find(d => d.staff_id === staffId);

    const userUpdateFile = new FormData();
    this.updatedUserForm.patchValue({
      updateStaffName: editData.staff_name,
      updateStaffWorkAreaId: editData.work_area_id,
      updateStaffSalary: editData.staff_salary,
      updateStaffShiftId: editData.shift_id,
      updateStaffMobileServiceProviderId: editData.mobile_service_provider_id,
      updateStaffIdProof: editData.staff_id_proof,
      updateStaffMobileNumber: editData.mobile_number,
    })
  }

  updateStaffInfo(staffId) {
    const updateSalary = parseInt(this.updatedUserForm.get('updateStaffSalary').value.split(',').join(''));
    const userUpdateFile = new FormData();
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to update ' + this.updatedUserForm.get('updateStaffName').value + ' Staff Info Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (userUpdateFile.get('staffIdProof') === null) {
          userUpdateFile.append('staffId', staffId),
          userUpdateFile.append('staffName', this.updatedUserForm.value.updateStaffName),
          userUpdateFile.append('staffWorkAreaId', this.updatedUserForm.value.updateStaffWorkAreaId),
          userUpdateFile.append('staffSalary', updateSalary.toString()),
          userUpdateFile.append('staffShiftId', this.updatedUserForm.value.updateStaffShiftId),
          userUpdateFile.append('mobileServiceProviderId', this.updatedUserForm.value.updateStaffMobileServiceProviderId),
          userUpdateFile.append('staffMobileNumber', this.updatedUserForm.value.updateStaffMobileNumber),
          userUpdateFile.append('updated_date', this.global.getDateZone()),
          userUpdateFile.append('updated_time', this.global.getTimeZone())
          this.registrationService.updateStaffInfo(userUpdateFile).subscribe((updateInfo: any) => {
            this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
              this.staffDetails = this.global.tableIndex(staffDetails.data);
              for (let i = 0; i < this.staffDetails.length; i++) {
                this.staffDetails[i].staff_salary = this.global.tableComma(this.staffDetails[i].staff_salary)
              }
              this.isProgressBar = false;
              if (this.staffDetails.length > 0) {
                this.isData = false;
              } else {
                this.isData = true;
              }
            })
          })
        } else if (userUpdateFile) {
          userUpdateFile.append('staffId', staffId),
          userUpdateFile.append('staffName', this.updatedUserForm.value.updateStaffName),
          userUpdateFile.append('staffWorkAreaId', this.updatedUserForm.value.updateStaffWorkAreaId),
          userUpdateFile.append('staffSalary', updateSalary.toString()),
          userUpdateFile.append('staffShiftId', this.updatedUserForm.value.updateStaffShiftId),
          userUpdateFile.append('mobileServiceProviderId', this.updatedUserForm.value.updateStaffMobileServiceProviderId),
          userUpdateFile.append('staffMobileNumber', this.updatedUserForm.value.updateStaffMobileNumber),
          userUpdateFile.append('staffIdProof', this.updatedUserForm.value.updateStaffIdProof),
          userUpdateFile.append('updated_date', this.global.getDateZone()),
          userUpdateFile.append('updated_time', this.global.getTimeZone())
          this.registrationService.updateStaffIdProof(userUpdateFile).subscribe((updateInfo: any) => {
            this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
              this.staffDetails = this.global.tableIndex(staffDetails.data);
              for (let i = 0; i < this.staffDetails.length; i++) {
                this.staffDetails[i].staff_salary = this.global.tableComma(this.staffDetails[i].staff_salary)
              }
              this.isProgressBar = false;
              if (this.staffDetails.length > 0) {
                this.isData = false;
              } else {
                this.isData = true;
              }
            })
          })
        } else {
          this.toastr.error("Please enter Updated Name and Unit.")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Staff Info is unchanged.',
          'error'
        )
      }
    })
  }

  deleteStaffDetails(staffId, staffName) {
    let deletStaffInfo = {
      'staff_id': staffId,
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
      title: 'Are you sure want to delete Staff ' + staffName + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProgressBar = true;
        this.registrationService.deleteStaff(deletStaffInfo).subscribe(data => {
          this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
            this.staffDetails = this.global.tableIndex(staffDetails.data)
            for (let i = 0; i < this.staffDetails.length; i++) {
              this.staffDetails[i].staff_salary = this.global.tableComma(this.staffDetails[i].staff_salary)
            }
            this.isProgressBar = false;
            if (this.staffDetails.length > 0) {
              this.isData = false;
            } else {
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Staff ' + staffName + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Staff Information is safe :)',
          'error'
        )
      }
    })
  }
}