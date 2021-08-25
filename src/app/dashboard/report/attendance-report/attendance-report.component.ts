import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RegistrationService } from 'app/services/dashboard/registration/registration.service';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { GlobalService } from 'app/services/global.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private registrationService: RegistrationService,
    private reportService: ReportService
  ) { }

  attendanceForm: FormGroup;
  staff = [];
  selectedStaffName = [];
  staffName = [];
  selectedStaffNameTable: boolean;
  staffNameTable: boolean;
  staffId: any;

  protected _onDestroy = new Subject<void>();
  public staffFilterCtrl: FormControl = new FormControl();
  public filteredStaff: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.attendanceForm = this.formBuilder.group({
      staff_id: ['']
    })
    this.getStaff();
  }

  getStaff() {
    this.staffNameTable = false;
    this.selectedStaffNameTable = true;
    this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
      this.staff = this.global.tableIndex(staffDetails.data);
      this.filteredStaff.next(staffDetails.data.slice());
      this.staffFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterStaff();
      });
    })
  }

  staffChange(event) {
    this.staffId = event.value
  }

  getStaffList() {
    if (this.staffId === undefined || this.staffId === '') {
      this.registrationService.getStaffDetails().subscribe((staffDetails: any) => {
        this.staffName = this.global.tableIndex(staffDetails.data)
        this.staffNameTable = true;
      })
      this.cancel();
    } else {
      let id = {
        staff_id: this.staffId
      }
      this.reportService.getStaff(id).subscribe((selectStaffDetails: any) => {
        this.selectedStaffName = this.global.tableIndex(selectStaffDetails.data);
        this.selectedStaffNameTable = true;
      })
      this.attendanceForm.reset();
      this.cancel();
    }
  }

  cancel() { 
    this.staffId = '';
    this.staffNameTable = false;
    this.selectedStaffNameTable = false;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterStaff() {
    if (!this.staff) {
      return;
    }
    // get the search keyword
    let search = this.staffFilterCtrl.value;
    if (!search) {
      this.filteredStaff.next(this.staff.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStaff.next(
      this.staff.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredStaff.subscribe(d => {
    })
  }

}
