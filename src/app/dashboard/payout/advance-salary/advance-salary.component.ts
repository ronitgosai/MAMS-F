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
import { AdvanceSalaryService } from 'app/services/dashboard/payout/advance-salary/advance-salary.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-advance-salary',
  templateUrl: './advance-salary.component.html',
  styleUrls: ['./advance-salary.component.scss']
})
export class AdvanceSalaryComponent implements OnInit {

  constructor(
    private titelService: Title,
    private registrationService: RegistrationService,
    private advanceSalaryService: AdvanceSalaryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    titelService.setTitle("Payout-Advance Salary | Modern Agrichem")
  }

  isSubmitted: boolean = false;
  buttons: boolean = false;
  isProgressBar: boolean;
  isStaffTable: boolean;
  isData: boolean;
  isTable: boolean;

  input_number: any;

  advanceSalaryForm: FormGroup;
  updateAdvanceSalaryForm: FormGroup;

  staffDetails = [];
  selectedDetails = [];
  advanceSalary = [];
  upSalary = [];
  salary: any;
  updateSalary: any;

  p: any = '1';
  entriesPerPage: any = '10';
  value = 'Clear me';
  old_card_index: any;

  protected _onDestroy = new Subject<void>();
  public staffFilterCtrl: FormControl = new FormControl();
  public filteredStaff: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    console.log("LOAD COMPONET")
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

    this.advanceSalaryForm = this.formBuilder.group({
      staffId: ['', [Validators.required]],
      advanceSalary: ['', [Validators.required]],
      shiftName: [''],
      staffSalary: [''],
      workAreaName: [''],
      masterNetworkServiceProviderName: [''],
      number: ['']
    })

    this.updateAdvanceSalaryForm = this.formBuilder.group({
      updateStaffId: ['', [Validators.required]],
      updateAdvanceSalary: ['', [Validators.required]],
    })

    this.getStaff();
    this.getAdvanceSalary();
  }

  getAdvanceSalary() {
    this.advanceSalaryService.getAdvanceSalary().subscribe((advance: any) => {
      this.advanceSalary = this.global.tableIndex(advance.data);
      this.advanceSalary.map((d,index) => {
        d.staff_salary = this.global.tableComma(d.staff_salary);
        d.remaining = this.global.tableComma(d.remaining);
        d.advance = this.global.tableComma(d.advance);
        d.total_advance = d.total_advance.split(',');
        d.total_advance = d.total_advance.map((d) => {
          d = Number(d).toLocaleString('en-IN')
          return d;
        })
        d.total = d.total.split(',');
      })
      this.isProgressBar = false;
      if(this.advanceSalary.length > 0){
        this.isTable = true;
        this.isData = false;
      }else{
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  printNumber() {
    this.salary = Number(this.advanceSalaryForm.get('advanceSalary').value.split(',').join('')).toLocaleString('en-IN');
  }

  print() {
    this.updateSalary = Number(this.updateAdvanceSalaryForm.get('updateAdvanceSalary').value.split(',').join('')).toLocaleString('en-IN')
  }

  getStaff() {
    this.registrationService.getStaffDetails().subscribe((staff: any) => {
      this.staffDetails = this.global.tableIndex(staff.data)
      this.filteredStaff.next(staff.data.slice());
      this.staffFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterStaff();
      });
    })
  }

  details(event) {
    let id = {
      'staff_id': event.value
    }
    this.registrationService.getSelectedStaffDetails(id).subscribe((staffDetails: any) => {
      this.selectedDetails = this.global.tableIndex(staffDetails.data)
      this.selectedDetails[0].staff_salary = this.global.tableComma(this.selectedDetails[0].staff_salary)
      let editData = this.selectedDetails.find(d => d.staff_id === event.value)
      this.advanceSalaryForm.patchValue({
        shiftName: editData.shift_name,
        staffSalary: editData.staff_salary,
        workAreaName: editData.work_area_name,
        masterNetworkServiceProviderName: editData.master_network_service_provider_name,
        number: editData.mobile_number,
      })
      this.isStaffTable = true;
    })
  }

  search() {
  }

  pagination(event) {
  }

  cancel(){
    this.isStaffTable = false;
  }

  insertAdvanceSalary() {
    let patableSalary;
    let advanceSalaryDetails = {
      'staff_id': this.advanceSalaryForm.get('staffId').value,
      'staffSalary': Number(this.advanceSalaryForm.get('staffSalary').value.split(',').join('')),
      'advance_salary': Number(this.advanceSalaryForm.get('advanceSalary').value.split(',').join('')),
      'session_id': localStorage.getItem('session_id'),
      'created_date': this.global.getDateZone(),
      'created_time': this.global.getTimeZone()
    }
    if (this.advanceSalaryForm.valid) {
      this.advanceSalaryService.createAdvanceSalary(advanceSalaryDetails).subscribe((advanceSalary) => {
        this.advanceSalaryService.getAdvanceSalary().subscribe((advance: any) => {
          this.advanceSalary = this.global.tableIndex(advance.data)
          this.advanceSalary.map((d,index) => {
            d.staff_salary = this.global.tableComma(d.staff_salary);
            d.remaining = this.global.tableComma(d.remaining);
            d.advance = this.global.tableComma(d.advance);
            d.total_advance = d.total_advance.split(',');
            d.total_advance = d.total_advance.map((d) => {
              d = Number(d).toLocaleString('en-IN')
              return d;
            })
            d.total = d.total.split(',');
          })
          this.isProgressBar = false;
          if(this.advanceSalary.length > 0){
            this.isTable = true;
            this.isData = false;
          }else{
            this.isTable = false;
            this.isData = true;
          }
        })
        this.registrationService.updateStaffSalary(advanceSalaryDetails).subscribe((res: any) => {
          this.upSalary = this.global.tableIndex(res.data)
        })
      })
      this.advanceSalaryForm.reset();
      this.isStaffTable = false;
      document.getElementById("collapseButton").click();
    }
  }

  editAdvanceSalary(id, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("advanceSalaryInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }

    let editData = this.advanceSalary.find(d => d.advance_salary_id === id)
    this.updateAdvanceSalaryForm.patchValue({
      updateStaffId: editData.staff_name,
      updateAdvanceSalary: editData.advance_salary
    })
  }

  deleteAdvanceSalary(id) {
    let deletData = {
      'advance_salary_id': id,
      'session_id': localStorage.getItem('session_id'),
      'updated_date': this.global.getDateZone(),
      'updated_time': this.global.getTimeZone()
    }
    let date = {
      'created_date': this.global.getDateZone()
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to delete Advance Salary info ?',
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
        this.advanceSalaryService.deleteAdvanceSalary(deletData).subscribe(data => {
          this.advanceSalaryService.getAdvanceSalary().subscribe((advance: any) => {
            this.advanceSalary = this.global.tableIndex(advance.data)
            this.advanceSalary.map((d,index) => {
              d.staff_salary = this.global.tableComma(d.staff_salary);
              d.remaining = this.global.tableComma(d.remaining);
              d.advance = this.global.tableComma(d.advance);
              d.total_advance = d.total_advance.split(',');
              d.total_advance = d.total_advance.map((d) => {
                d = Number(d).toLocaleString('en-IN')
                return d;
              })
              d.total = d.total.split(',');
            })
            this.isProgressBar = false;
            if(this.advanceSalary.length > 0){
              this.isTable = true;
              this.isData = false;
            }else{
              this.isTable = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Advance Salary Info has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Advance Salary Info  is safe :)',
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
