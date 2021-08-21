import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GlobalService } from 'app/services/global.service';
import { RegistrationService } from 'app/services/dashboard/registration/registration.service';
import { SalaryService } from 'app/services/dashboard/payout/salary.service';
import { AdvanceSalaryService } from 'app/services/dashboard/payout/advance-salary/advance-salary.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  constructor(
    private titelService: Title,
    private registrationService: RegistrationService,
    private advanceSalaryService: AdvanceSalaryService,
    private salaryService: SalaryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Payout-Advance Salary | Modern Agrichem")
  }

  isSubmitted: boolean = false;
  buttons: boolean = false;
  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;
  table = [];

  input_number: any;
  details = [];
  isCollapsed: boolean;

  salaryForm: FormGroup;
  advanceSalaryForm: FormGroup;
  updateAdvanceSalaryForm: FormGroup;

  staffDetails = [];
  salaryDetail = [];
  advanceSalary = [];
  advanceSalarySum = [];
  salarySum = [];
  advanceSalaryId: any;
  startDate: any;
  endDate: any;
  salary: any;
  actualSalary: any;
  updateSalary: any;

  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  old_card_index: any;

  isAdvanceSalaryTable: boolean;

  protected _onDestroy = new Subject<void>();
  public staffFilterCtrl: FormControl = new FormControl();
  public filteredStaff = [];

  ngOnInit(): void {
    this.isProgressBar = true;
    this.salaryForm = this.formBuilder.group({
      staffId: ['', [Validators.required]],
      actualSalary: [''],
      salary: ['', [Validators.required]],
    })

    this.getSalaryList();
    this.getSalary();
    this.getDay();
  }
  getDay() {
    const now = new Date();
    let date = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let d = '01'
    let currentTime = new Date();
    let currentOffset = currentTime.getTimezoneOffset();
    let ISTOffset = 330;   // IST offset UTC +5:30 
    let ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);

    this.startDate = ISTTime.getFullYear() + "-" + ((ISTTime.getMonth() + 1) > 9 ? (ISTTime.getMonth() + 1) : "0" + (ISTTime.getMonth() + 1)) + "-" + d
    this.endDate = ISTTime.getFullYear() + "-" + ((ISTTime.getMonth() + 1) > 9 ? (ISTTime.getMonth() + 1) : "0" + (ISTTime.getMonth() + 1)) + "-" + date
  }

  getSalaryList() {
    this.salaryService.getSalaryList().subscribe((salaryDetails: any) => {
      this.salaryDetail = this.global.tableIndex(salaryDetails.data)
      for (let i = 0; i < this.salaryDetail.length; i++) {
        this.salaryDetail[i].salary = this.global.tableComma(this.salaryDetail[i].salary)
      }
      this.isProgressBar = false;
      if (this.salaryDetail.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.salaryDetail.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  getSalary() {
    this.registrationService.getStaffDetails().subscribe((staff: any) => {
      this.staffDetails = this.global.tableIndex(staff.data);
      this.staffDetails.map((d, index) => {
        if (this.filteredStaff.indexOf(d) === -1) {
          this.filteredStaff.push(d)
        }
      })
      this.staffFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterStaff();
      });
    })
    this.advanceSalaryService.getAdvanceSalary().subscribe((advance: any) => {
      this.advanceSalary = this.global.tableIndex(advance.data)
      for (let i = 0; i < this.advanceSalary.length; i++) {
        this.advanceSalary[i].advance_salary = this.global.tableComma(this.advanceSalary[i].advance_salary)
      }
    })

  }

  printNumber() {
    this.salary = Number(this.salaryForm.get('salary').value.split(',').join('')).toLocaleString('en-IN')
  }

  print() {
    this.actualSalary = Number(this.salaryForm.get('actualSalary').value.split(',').join('')).toLocaleString('en-IN')
  }

  staffSalary(event) {
    let staffId = {
      'staff_id': event.value
    }
    this.salaryService.getSalaryDetails(staffId).subscribe((salary: any) => {
      this.details = this.global.tableIndex(salary.data);
      this.advanceSalaryId = this.details.find(d => d.staff_id === event.value).advance_salary_id
      if (this.details.length > 0) {
        this.salarySum = [];
        this.salaryService.getSalary(staffId).subscribe((salarySum: any) => {
          this.advanceSalarySum = this.global.tableIndex(salarySum.data)
          this.advanceSalarySum[0].remaining = this.global.tableComma(this.advanceSalarySum[0].remaining)
          this.advanceSalarySum[0].staff_salary = this.global.tableComma(this.advanceSalarySum[0].staff_salary)
          this.salaryForm.patchValue({
            actualSalary: this.advanceSalarySum[0].staff_salary,
            salary: this.advanceSalarySum[0].remaining
          })
          this.isAdvanceSalaryTable = true;
        })
      } else {
        this.advanceSalarySum = [];
        this.salaryService.getSalarySum(staffId).subscribe((salarySum: any) => {
          this.salarySum = this.global.tableIndex(salarySum.data)
          this.salarySum[0].staff_salary = this.global.tableComma(this.salarySum[0].staff_salary)
          this.salaryForm.patchValue({
            actualSalary: this.salarySum[0].staff_salary,
            salary: this.salarySum[0].staff_salary
          })
          this.isAdvanceSalaryTable = true;
        })
        this.toastr.error("This staff member not take advance salary")
      }
    })
  }

  search() {
  }

  pagination(event) {
  }

  cancel() {
    this.isAdvanceSalaryTable = false;
  }

  insertSalary() {
    let salaryInfo = {
      'staff_id': this.salaryForm.get('staffId').value,
      'actualSalary': Number(this.salaryForm.get('actualSalary').value.split(',').join('')),
      'salary': Number(this.salaryForm.get('salary').value.split(',').join('')),
      'session_id': localStorage.getItem('session_id'),
      'created_date': this.global.getDateZone(),
      'created_time': this.global.getTimeZone()
    }
    if (this.salaryForm.valid) {
      this.salaryService.createSalary(salaryInfo).subscribe((insertSalary: any) => {
        this.salaryService.getSalaryList().subscribe((salaryDetails: any) => {
          this.salaryDetail = this.global.tableIndex(salaryDetails.data)
          for (let i = 0; i < this.salaryDetail.length; i++) {
            this.salaryDetail[i].salary = this.global.tableComma(this.salaryDetail[i].salary)
          }
          this.isProgressBar = false;
          if (this.salaryDetail.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.salaryDetail.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
        let updateAdvanceSalaryInfo = {
          'staff_id': this.salaryForm.get('staffId').value,
          'session_id': localStorage.getItem('session_id'),
          'updated_date': this.global.getDateZone(),
          'updated_time': this.global.getTimeZone()
        }
        this.advanceSalaryService.updateAdvanceSalary(updateAdvanceSalaryInfo).subscribe(updateAdvanceSalary => {
        })
        this.salaryDetail.map((d, index) => {
          let salaryAdvanceSalaryInfo = {
            'salary_id': insertSalary.data.salary_id,
            'advance_salary_id': this.advanceSalaryId[index],
            'session_id': localStorage.getItem('session_id'),
            'created_date': this.global.getDateZone(),
            'created_time': this.global.getTimeZone()
          }
          this.salaryService.createSalaryAdvanceSalary(salaryAdvanceSalaryInfo).subscribe(tbl => {
          })
        })
      })
      document.getElementById('collapseButton').click();
      this.isAdvanceSalaryTable = false;
      this.salaryForm.reset();
    }
  }

  deleteSalaryInfo(id, name) {
    let deletData = {
      'salary_id': id,
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
      title: 'Are you sure want to delete Salary info of ' + name + '?',
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
        this.salaryService.deleteSalary(deletData).subscribe(data => {
          this.salaryService.getSalaryList().subscribe((salaryDetails: any) => {
            this.salaryDetail = this.global.tableIndex(salaryDetails.data)
            for (let i = 0; i < this.salaryDetail.length; i++) {
              this.salaryDetail[i].salary = this.global.tableComma(this.salaryDetail[i].salary)
            }
            this.isProgressBar = false;
            if (this.salaryDetail.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.salaryDetail.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Salary Info ' + name + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Salary Info  is safe :)',
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
    if (!this.advanceSalary) {
      return;
    }
    // get the search keyword
    let search = this.staffFilterCtrl.value;
    if (!search) {
      this.filteredStaff
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStaff = this.advanceSalary.filter(data => {
      return data.staff_name.toLowerCase().indexOf(search) > -1
    })
  }
}
