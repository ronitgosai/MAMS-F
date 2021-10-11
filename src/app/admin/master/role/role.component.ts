import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RoleService } from 'app/services/dashboard/master/role.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private toastr: ToastrService,
    private roleService: RoleService,
    private titelService: Title,
  ) {
    titelService.setTitle("Master | Modern Agrichem")
  }

  roleForm: FormGroup;
  updateRoleForm: FormGroup;

  roleData = [];
  updateRoleData = [];

  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';
  roleName: any;
  old_card_index: any;

  ngOnInit(): void {
    this.isTable = false;
    this.isProgressBar = true;
    this.isData = false;

    this.roleForm = this.formBuilder.group({
      roleName: ['', Validators.required]
    });

    this.updateRoleForm = this.formBuilder.group({
      updateRoleName: ['', Validators.required]
    })

    this.getRole();
  }

  getRole() {
    this.roleService.getMasterRole().subscribe((role: any) => {
      this.roleData = this.global.tableIndex(role.data);
      this.isProgressBar = false;
      if (this.roleData.length > 0) {
        this.isTable = true;
        this.isData = false;
      } else if (this.roleData.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  search() {

  }

  pagination(event) {
  }

  addRole() {
    this.isTable = false;
    this.isProgressBar = true;
    if (this.roleForm.valid) {
      let roleDetails = {
        'role_name': this.roleForm.get('roleName').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone(),
      }
      this.roleService.createMasterRole(roleDetails).subscribe(role => {
        this.roleService.getMasterRole().subscribe((getRole: any) => {
          this.roleData = this.global.tableIndex(getRole.data);
          this.isProgressBar = false;
          if (this.roleData.length > 0) {
            this.isTable = true;
            this.isData = false;
          } else if (this.roleData.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success("Role " + this.roleForm.get('roleName').value + " added successfully.");
      document.getElementById('collapseButton').click();
      this.roleForm.reset();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
      this.toastr.error("Please input valid data.");
    }
  }

  editṚole(roleId, cardIndex) {
  }

  updateRole(roleId) {
  }

  deleteRole(roleId, roleName) {
  }
}
