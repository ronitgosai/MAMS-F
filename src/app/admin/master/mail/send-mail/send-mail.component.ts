import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetEmailService } from 'app/services/dashboard/master/set-email.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private setMailService: SetEmailService,
    private toastr: ToastrService
  ) { }

  setMailForm: FormGroup;
  updateSetMailForm: FormGroup;
  setEmailData = [];
  setEmailDataBackup = [];

  isPagination: boolean;
  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;
  email: any;
  oldCardIndex;
  p: number = 1;
  value = 'Clear me';
  entriesPerPage: any = '10';

  ngOnInit(): void {
    this.isProgressBar = true;
    this.isData = false;
    this.isPagination = false;
    this.isTable = false;
    this.setMailForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.updateSetMailForm = this.formBuilder.group({
      updateFirstName: ['', [Validators.required]],
      updateLastName: ['', [Validators.required]],
      updateEmail: ['', [Validators.required, Validators.email]],
    })

    this.getMail();
  }

  getMail() {
    this.setMailService.getEmail().subscribe((retrieveEmail: object) => {
      this.setEmailData = this.global.tableIndex(retrieveEmail['data']);
      this.setEmailDataBackup = this.setEmailData;
      this.isProgressBar = false;
      if (retrieveEmail['data'].length > 0) {
        this.isTable = true;
        this.isPagination = true;
        this.isData = false;
      } else if (retrieveEmail['data'].length === 0) {
        this.isTable = false;
        this.isPagination = 
        this.isData = true;
      }
    })
  }

  setMail() {
    this.isProgressBar = true;
    this.isTable = false;
    this.isPagination = false;
    if (this.setMailForm.valid) {
      let emailInfo = {
        'first_name': this.setMailForm.get('firstName').value,
        'last_name': this.setMailForm.get('lastName').value,
        'email': this.setMailForm.get('email').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.setMailService.setEmail(emailInfo).subscribe(email => {
        this.setMailService.getEmail().subscribe((retrieveEmail: object) => {
          this.setEmailData = this.global.tableIndex(retrieveEmail['data']);
          this.isProgressBar = false;
          if (retrieveEmail['data'].length > 0) {
            this.isTable = true;
            this.isPagination = true;
            this.isData = false;
          } else if (retrieveEmail['data'].length === 0) {
            this.isTable = false;
            this.isPagination = 
            this.isData = true;
          }
        })
      })
      this.toastr.success('Mail Info insert Successfully');
      document.getElementById('collapseButton').click();
      this.setMailForm.reset();
    }
  }

  search() {
    if (this.email === '') {
      this.setEmailData = this.setEmailDataBackup
    } else {
      this.setEmailData = this.setEmailDataBackup.filter(res => {
        return res.first_name.toLowerCase().match(this.email.toLowerCase());
      })
    }
  }

  pagination(event) { }

  editMail(setMailId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex;
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById("setMailInfo" + this.oldCardIndex).classList.remove('show');
        this.oldCardIndex = cardIndex;
      }
    }
    let editData = this.setEmailData.find(d => d.set_email_id === setMailId);
    this.updateSetMailForm.patchValue({
      updateFirstName: editData.fisrt_name,
      updateLastName: editData.last_name,
      updateEmail: editData.email,
    })
  }

  updateMail(setMailId) {
    let updateMailSettingInfo = {
      'set_email_id': setMailId,
      'fisrt_name': this.updateSetMailForm.get('updateFirstName').value,
      'last_name': this.updateSetMailForm.get('updateLastName').value,
      'email': this.updateSetMailForm.get('updateEmail').value,
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
      title: 'Are you sure want to update ' + this.updateSetMailForm.get('updateFirstName').value + this.updateSetMailForm.get('updateLastName').value + ' Mail Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateSetMailForm.valid) {
          this.isTable = false;
          this.isPagination = false;
          this.isProgressBar = true;
          this.setMailService.updateEmail(updateMailSettingInfo).subscribe((data) => {
            this.setMailService.getEmail().subscribe((retrieveEmail: object) => {
              this.setEmailData = this.global.tableIndex(retrieveEmail['data']);
              this.isProgressBar = false;
              if (retrieveEmail['data'].length > 0) {
                this.isTable = true;
                this.isPagination = true;
                this.isData = false;
              } else if (retrieveEmail['data'].length === 0) {
                this.isTable = false;
                this.isPagination = false;
                this.isData = true;
              }
            });
            this.toastr.success(this.updateSetMailForm.get('updateFirstName').value + this.updateSetMailForm.get('updateLastName').value + " Mail Info Successfully updated!")
            this.updateSetMailForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Mail Info has beeen updated.',
              showConfirmButton: false,
              timer: 1500,
            })
          },
            (err) => {
              this.toastr.success("Something went wrong, Relaod the page and try again.")
            })
        }
        else {
          this.toastr.error("Please enter Updated Name and Unit.")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Mail info is unchanged.',
          'error'
        )
      }
    })
  }

  deleteMail(setMailId, firstName: string, lastName: string) {
    let deletData = {
      'set_email_id': setMailId,
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
      title: 'Are you sure want to delete email ' + firstName + lastName + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isTable = false;
        this.isPagination = false;
        this.isProgressBar = true;
        this.setMailService.deleteEmail(deletData).subscribe(data => {
          this.setMailService.getEmail().subscribe((retrieveEmail: object) => {
            this.setEmailData = this.global.tableIndex(retrieveEmail['data'])
            this.isProgressBar = false;
            if (retrieveEmail['data'].length > 0) {
              this.isTable = true;
              this.isPagination = true;
              this.isData = false;
            } else if (retrieveEmail['data'].length === 0) {
              this.isTable = false;
              this.isPagination = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Email of ' + firstName + lastName + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Email is safe :)',
          'error'
        )
      }
    })
  }
}