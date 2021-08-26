import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReportService } from 'app/services/dashboard/report/report.service';
import { StaffService } from 'app/services/dashboard/staff/staff.service';
import { GlobalService } from 'app/services/global.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private reportService: ReportService,
    private staffService: StaffService
  ) { }

  userForm: FormGroup;

  user = [];
  selectUser = [];
  userTable: boolean;
  selectUserTable: boolean;

  userId: any;

  protected _onDestroy = new Subject<void>();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUser: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  ngOnInit(): void {
    this.userTable = false;
    this.selectUserTable = false;

    this.userForm = this.formBuilder.group({
      user_id: ['']
    })
    this.getUser();
  }

  getUser() {
    this.staffService.getStaff().subscribe((getUser: any) => {
      this.user = this.global.tableIndex(getUser.data);
      this.filteredUser.next(getUser.data.slice());
      this.userFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterUser();
      });
    })
  }

  userChange(event) {
    this.userId = event.value;
  }

  getUserList() {
    if (this.userId === undefined || this.userId.length === 0) {
      this.staffService.getStaff().subscribe((getUser: any) => {
        this.user = this.global.tableIndex(getUser.data);
        this.userTable = true;
      })
    } else {
      let userId = {
        'user_id': this.userId
      }
      this.reportService.getUser(userId).subscribe((selectUser: any) => {
        this.selectUser = this.global.tableIndex(selectUser.data);
        this.selectUserTable = true;
      })
      this.selectUserTable = false;
    }

  }

  cancel() {

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterUser() {
    if (!this.user) {
      return;
    }
    // get the search keyword
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUser.next(this.user.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredUser.next(
      this.user.filter(data => {
        return data.raw_material_name.toLowerCase().indexOf(search) > -1
      })
    );
    this.filteredUser.subscribe(d => {
    })
  }
}
