import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'app/services/global.service';
import { SendMailService } from 'app/services/dashboard/master/send-mail.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mail-service',
  templateUrl: './mail-service.component.html',
  styleUrls: ['./mail-service.component.scss']
})
export class MailServiceComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private global: GlobalService,
    private mailService: SendMailService,
    private toastr: ToastrService
  ) { }

  mailForm: FormGroup;
  updatedMailForm: FormGroup;
  hide = true;
  isSubmitted: boolean;
  mail = [];
  mailBackup = [];

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
    this.isTable = false;
    this.mailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      imps: ['', [Validators.required]],
      smtp: ['', [Validators.required]],
      port: ['', [Validators.required]],
      security: ['', [Validators.required]]
    })

    this.updatedMailForm = this.formBuilder.group({
      updateEmail: ['', [Validators.required, Validators.email]],
      updatePassword: ['', [Validators.required]],
      updateImps: ['', [Validators.required]],
      updateSmtp: ['', [Validators.required]],
      updatePort: ['', [Validators.required]],
      updateSecurity: ['', [Validators.required]]
    })
    this.getMail();
  }

  getMail() {
    this.mailService.getMail().subscribe((retrieveMail: object) => {
      this.mail = this.global.tableIndex(retrieveMail['data']);
      this.mailBackup = this.mail;
      this.isProgressBar = false;
      if (retrieveMail['data'].length > 0) {
        this.isTable = true;
        this.isData = false;
      } else if (retrieveMail['data'].length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  search() {
    if (this.email === '') {
      this.mail = this.mailBackup
    } else {
      this.mail = this.mailBackup.filter(res => {
        return res.email.toLowerCase().match(this.email.toLowerCase());
      })
    }
  }

  mailSetting() {
    this.isSubmitted = true;
    this.isProgressBar = true;
    this.isTable = false;
    if (this.mailForm.valid) {
      let mailInfo = {
        'email': this.mailForm.get('email').value,
        'password': this.mailForm.get('password').value,
        'imps': this.mailForm.get('imps').value,
        'smtp': this.mailForm.get('smtp').value,
        'port': this.mailForm.get('port').value,
        'security': this.mailForm.get('security').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.mailService.sendMail(mailInfo).subscribe(mail => {
        this.mailService.getMail().subscribe((retrieveMail: object) => {
          this.mail = this.global.tableIndex(retrieveMail['data']);
          this.isProgressBar = false;
          if (retrieveMail['data'].length > 0) {
            this.isTable = true;
            this.isData = false;
          } else if (retrieveMail['data'].length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success('Mail insert Successfully');
      this.mailForm.reset();
      document.getElementById('collapseButton').click();
    }
    else {
      this.toastr.error('Please fill all fields!')
    }
  }

  editMailSetting(mailSettingId, cardIndex) {
    if (this.oldCardIndex === undefined) {
      this.oldCardIndex = cardIndex;
    } else {
      if (this.oldCardIndex !== cardIndex) {
        let id = document.getElementById("mailSettingInfo" + this.oldCardIndex).classList.remove('show');
        this.oldCardIndex = cardIndex;
      }
    }
    let editData = this.mail.find(d => d.mail_setting_id === mailSettingId);
    this.updatedMailForm.patchValue({
      updateEmail: editData.email,
      updatePassword: editData.password,
      updateImps: editData.imps,
      updateSmtp: editData.smtp,
      updatePort: editData.port,
      updateSecurity: editData.security
    })
  }

  updateMailSetting(mailSettingId, email) {
    let updateMailSettingInfo = {
      'mail_setting_id': mailSettingId,
      'email': this.updatedMailForm.get('updateEmail').value,
      'password': this.updatedMailForm.get('updatePassword').value,
      'imps': this.updatedMailForm.get('updateImps').value,
      'smtp': this.updatedMailForm.get('updateSmtp').value,
      'port': this.updatedMailForm.get('updatePort').value,
      'security': this.updatedMailForm.get('updateSecurity').value,
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
      title: 'Are you sure want to update ' + this.updatedMailForm.get('updateEmail').value + ' Mail Setting Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updatedMailForm.valid) {
          this.isTable = false;
          this.isProgressBar = true;
          this.mailService.updateMail(updateMailSettingInfo).subscribe((data) => {
            this.mailService.getMail().subscribe((retrieveMail: object) => {
              this.mail = this.global.tableIndex(retrieveMail['data']);
              this.isProgressBar = false;
              if (retrieveMail['data'].length > 0) {
                this.isTable = true;
                this.isData = false;
              } else if (retrieveMail['data'].length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
            this.toastr.success(this.updatedMailForm.get('updateEmail').value + " Raw Material Successfully updated!")
            this.updatedMailForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Mail Setting has beeen updated.',
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
          'Mail Setting is unchanged.',
          'error'
        )
      }
    })
  }

  deleteMail(id, email: string) {
    let deletData = {
      'mail_setting_id': id,
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
      title: 'Are you sure want to delete email setting ' + email + '?',
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
        this.mailService.deleteMail(deletData).subscribe(data => {
          this.mailService.getMail().subscribe((retrieveMail: object) => {
            this.mail = this.global.tableIndex(retrieveMail['data'])
            this.isProgressBar = false;
            if (retrieveMail['data'].length > 0) {
              this.isTable = true;
              this.isData = false;
            } else if (retrieveMail['data'].length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Email setting' + email + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Email  is safe :)',
          'error'
        )
      }
    })
  }
}