import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AttendanceService } from 'app/services/dashboard/master/attendance.service';
import { NetWorkServiceProviderService } from 'app/services/dashboard/master/NetWorkServiceProvider.service';
import { ShiftService } from 'app/services/dashboard/master/shift.service';
import { WorkAreaService } from 'app/services/dashboard/master/work-area.service';
import { RegistrationService } from 'app/services/dashboard/registration/registration.service';
import { StaffService } from 'app/services/dashboard/staff/staff.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  constructor(
    private titelService: Title,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService,
    private registrationService: RegistrationService,
    private shiftService: ShiftService,
    private attendanceService: AttendanceService,
    private staffService: StaffService
  ) {
    titelService.setTitle("User | Modern Agrichem")
  }
  attendanceForm: FormGroup;
  staffForm: FormGroup;
  updatedUserForm: FormGroup;

  staffDetails;
  staffDetailsBackup = [];
  staffInfo = [];
  shiftDetails = [];
  attendanceDetails = [];
  count = [];

  value: 'Clear me';
  staffName;
  p: any = '1';
  entriesPerPage: any = '10';
  oldCardIndex: any;
  salary: any;

  date: any;
  time: any;

  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;
  isStaffTable: boolean;

  currentMonthDays: any;
  selectedTime: any;

  protected _onDestroy = new Subject<void>();
  public staffFilterCtrl: FormControl = new FormControl();
  public filteredStaff: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  i: any;

  ngOnInit(): void {
    const now = new Date();
    let date = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    this.currentMonthDays = date

    this.isProgressBar = true;

    this.attendanceForm = this.formBuilder.group({
      staffId: ['', [Validators.required]],
      staffWorkingShift: ['', [Validators.required]],
      date: [this.global.getDateZone(), [Validators.required]],
      // time: [this.time, [Validators.required]],
    })

    this.staffForm = this.formBuilder.group({
      staffId: ['', [Validators.required]],
      advanceSalary: ['', [Validators.required]],
      shiftName: [''],
      staffSalary: [''],
      workAreaName: [''],
      masterNetworkServiceProviderName: [''],
      number: ['']
    })

    this.getAttendance();
    this.getStaff();
    this.getShift();
    setInterval(this.getTime, 1000);
    this.getTime();
    this.getDay();
  }

  getTime() {
    const span = document.getElementById('span');
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    span.textContent = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
    this.time = span.textContent
  }

  getAttendance() {
    let staffDetailsInfo = {
      'date': this.global.getDateZone(),
    }
    this.attendanceService.getAttendance(staffDetailsInfo).subscribe((attendance: any) => {
      this.attendanceDetails = this.global.tableIndex(attendance.data);
      this.isProgressBar = false;
      // if (this.attendanceDetails.length > 0) {
      //   this.isData = false;
      //   this.isTable = true;
      // } else if (this.attendanceDetails.length === 0) {
      //   this.isTable = false;
      //   this.isData = true;
      // }
      this.getDay();
    })
  }

  getStaff() {
    this.registrationService.getStaffDetails().subscribe((staff: any) => {
      this.staffDetails = this.global.tableIndex(staff.data)
      this.staffDetailsBackup = this.staffDetails
      this.filteredStaff.next(staff.data.slice());
      this.staffFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterStaff();
      });
    })
  }

  getShift() {
    this.shiftService.getMasterShift().subscribe((shift: any) => {
      this.shiftDetails = this.global.tableIndex(shift.data)
    })
  }

  staffNameChange(event) {
    let id = {
      'staff_id': event.value
    }
    this.registrationService.getSelectedStaffDetails(id).subscribe((staffDetails: any) => {
      this.staffInfo = this.global.tableIndex(staffDetails.data)
      this.staffInfo[0].staff_salary = this.global.tableComma(this.staffInfo[0].staff_salary)
      let editData = this.staffInfo.find(d => d.staff_id === event.value)
      this.staffForm.patchValue({
        shiftName: editData.shift_name,
        staffSalary: editData.staff_salary,
        workAreaName: editData.work_area_name,
        masterNetworkServiceProviderName: editData.master_network_service_provider_name,
        number: editData.mobile_number,
      })
      this.isStaffTable = true;
    })
  }

  getDay() {
    const now = new Date();
    let date = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let d = '01'
    let currentTime = new Date();
    let currentOffset = currentTime.getTimezoneOffset();
    let ISTOffset = 330;   // IST offset UTC +5:30 
    let ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);

    let startDate = ISTTime.getFullYear() + "-" + ((ISTTime.getMonth() + 1) > 9 ? (ISTTime.getMonth() + 1) : "0" + (ISTTime.getMonth() + 1)) + "-" + d
    let endDate = ISTTime.getFullYear() + "-" + ((ISTTime.getMonth() + 1) > 9 ? (ISTTime.getMonth() + 1) : "0" + (ISTTime.getMonth() + 1)) + "-" + date

    let dayCount = {
      'startDate': startDate,
      'endDate': endDate
    }
    this.attendanceService.getAttendanceCount(dayCount).subscribe((date: any) => {
      this.count = this.global.tableIndex(date.data)
      this.isTable = true;
    })
  }

  search() {
    if(this.staffName === ''){
      this.staffDetails = this.staffDetailsBackup
    }else{
      this.staffDetails = this.staffDetailsBackup.filter(res => {
        return res.staff_name.toLowerCase().match(this.staffName.toLowerCase());
      })
    }
  }

  insertStaff() {
    this.isProgressBar = true;
    if (this.attendanceForm.valid) {
      let staffDetails = {
        'staff_id': this.attendanceForm.get('staffId').value,
        'staff_working_shift': this.attendanceForm.get('staffWorkingShift').value,
        'date': this.attendanceForm.get('date').value,
        'time': this.time,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      let date = {
        'date': this.global.getDateZone(),
      }
      this.attendanceService.createAttendance(staffDetails).subscribe((createStaff) => {
        this.attendanceService.getAttendance(date).subscribe((attendance: any) => {
          this.attendanceDetails = this.global.tableIndex(attendance.data);
          this.isProgressBar = false;
        })
      })
      document.getElementById('collapseButton').click();
      this.toastr.success("Attendance fill successfully!")
    }
  }

  deleteStaffDetails(staffId, staffName) {
    let deletStaffInfo = {
      'staff_id': staffId,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    let staffDetails = {
      'date': this.global.getDateZone(),
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
        this.isTable = false;
        this.isProgressBar = true;
        this.attendanceService.deleteAttendace(deletStaffInfo).subscribe(data => {
          this.attendanceService.getAttendance(staffDetails).subscribe((staffDetails: any) => {
            this.attendanceDetails = this.global.tableIndex(staffDetails.data)
            this.isProgressBar = false;
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterStaff() {
    if (!this.staffDetails) {
      return;
    }
    // get the search keyword
    let search = this.staffFilterCtrl.value;
    if (!search) {
      this.filteredStaff.next(this.staffDetails.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStaff.next(
      this.staffDetails.filter(data => {
        return data.staff_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredStaff.subscribe(d => {
    })
  }
}
