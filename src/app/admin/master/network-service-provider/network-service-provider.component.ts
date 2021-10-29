import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NetWorkServiceProviderService } from 'app/services/dashboard/master/NetWorkServiceProvider.service';
import { GlobalService } from 'app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-network-service-provider',
  templateUrl: './network-service-provider.component.html',
  styleUrls: ['./network-service-provider.component.scss']
})
export class NetworkServiceProviderComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private networkServiceProviderService: NetWorkServiceProviderService,
    private global: GlobalService,
    private toastr: ToastrService,
    private titelService: Title,
  ) {
    titelService.setTitle("Master | Modern Agrichem")
  }

  networkServiceProviderForm: FormGroup;
  updateNetworkServiceProviderForm: FormGroup;

  mobileNetwork = [];
  mobileNetworkBackup = [];

  isProgressBar: boolean;
  isData: boolean;
  isTable: boolean;

  p: any = '1';
  entriesPerPage: any = '10';
  mobileNetworkName: any;
  old_card_index: any;

  ngOnInit(): void {
    this.networkServiceProviderForm = this.formBuilder.group({
      networkServiceProviderName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })

    this.updateNetworkServiceProviderForm = this.formBuilder.group({
      updateNetworkServiceProviderName: ['', [Validators.required, this.global.noWhitespaceValidator]]
    })
    this.getMobileNetwork();
  }

  getMobileNetwork() {
    this.networkServiceProviderService.getMasterNetworkServiceProvider().subscribe((MasterNetworkServiceProvider: any) => {
      this.mobileNetwork = this.global.tableIndex(MasterNetworkServiceProvider.data);
      this.mobileNetworkBackup = this.mobileNetwork;
      this.isProgressBar = false;
      if (this.mobileNetwork.length > 0) {
        this.isData = false;
        this.isTable = true;
      } else if (this.mobileNetwork.length === 0) {
        this.isTable = false;
        this.isData = true;
      }
    })
  }

  search() {
    if (this.mobileNetworkName === '') {
      this.mobileNetwork = this.mobileNetworkBackup
    } else {
      this.mobileNetwork = this.mobileNetworkBackup.filter(res => {
        return res.master_network_service_provider_name.toLowerCase().match(this.mobileNetworkName.toLowerCase());
      })
    }
  }

  pagination(event) { }

  insertMobileNetwork() {
    this.networkServiceProviderForm.markAllAsTouched();
    this.isTable = false;
    this.isProgressBar = true;
    if (this.networkServiceProviderForm.valid) {
      let mobileNetworkInfo = {
        'master_network_service_provider_name': this.networkServiceProviderForm.get('networkServiceProviderName').value,
        'session_id': localStorage.getItem('session_id'),
        'created_date': this.global.getDateZone(),
        'created_time': this.global.getTimeZone()
      }
      this.networkServiceProviderService.createMasterNetworkServiceProvider(mobileNetworkInfo).subscribe(generateNetwork => {
        this.networkServiceProviderService.getMasterNetworkServiceProvider().subscribe((MasterNetworkServiceProvider: any) => {
          this.mobileNetwork = this.global.tableIndex(MasterNetworkServiceProvider.data)
          this.isProgressBar = false;
          if (this.mobileNetwork.length > 0) {
            this.isData = false;
            this.isTable = true;
          } else if (this.mobileNetwork.length === 0) {
            this.isTable = false;
            this.isData = true;
          }
        })
      })
      this.toastr.success("Mobile Network" + this.networkServiceProviderForm.get('networkServiceProviderName').value + " added successfully.");
      this.networkServiceProviderForm.reset();
      document.getElementById('collapseButton').click();
    } else {
      this.isProgressBar = false;
      this.isTable = true;
      this.toastr.error("Please enter valid data.");
    }
  }

  editMobileNetwork(mobileNetworkId, card_index) {
    if (this.old_card_index === undefined) {
      this.old_card_index = card_index
    } else {
      if (this.old_card_index !== card_index) {
        let id = document.getElementById("mobileNetworkInfo" + this.old_card_index).classList.remove('show')
        this.old_card_index = card_index
      }
    }
    let editData = this.mobileNetwork.find(d => d.master_network_service_provider_id === mobileNetworkId)
    this.updateNetworkServiceProviderForm.patchValue({
      updateNetworkServiceProviderName: editData.master_network_service_provider_name,
    })
  }

  updateMobileNetwork(mobileNetworkId, mobileNetworkName) {
    let updateNetworkServiceProvider = {
      'master_network_service_provider_id': mobileNetworkId,
      'master_network_service_provider_name': this.updateNetworkServiceProviderForm.get('updateNetworkServiceProviderName').value,
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
      title: 'Are you sure want to update ' + this.updateNetworkServiceProviderForm.get('updateNetworkServiceProviderName').value + ' Mobile Network Information?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateNetworkServiceProviderForm.get('updateNetworkServiceProviderName').value) {
          this.isTable = false;
          this.isProgressBar = true;
          this.networkServiceProviderService.updateMasterNetworkServiceProvider(updateNetworkServiceProvider).subscribe((data) => {
            this.networkServiceProviderService.getMasterNetworkServiceProvider().subscribe((masterMobileNetwork: any) => {
              this.mobileNetwork = this.global.tableIndex(masterMobileNetwork.data)
              this.isProgressBar = false;
              if (this.mobileNetwork.length > 0) {
                this.isData = false;
                this.isTable = true;
              } else if (this.mobileNetwork.length === 0) {
                this.isTable = false;
                this.isData = true;
              }
            });
            this.toastr.success(this.updateNetworkServiceProviderForm.get('updateNetworkServiceProviderName').value + " Mobile Network Name Successfully updated!")
            this.updateNetworkServiceProviderForm.reset();
            Swal.fire({
              icon: 'success',
              title: ' Mobile Network has beeen updated.',
              showConfirmButton: false,
              timer: 1500,
            })
          },
            (err) => {
              this.toastr.error("Something went wrong, Relaod the page and try again.")
            })
        }
        else {
          this.toastr.error("Please enter valid data.")
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Mobile Network is unchanged.',
          'error'
        )
      }
    })
  }

  deleteMobileNetwork(id, name) {
    let deletData = {
      'master_network_service_provider_id': id,
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
      title: 'Are you sure want to delete Network Service Provider ' + name + '?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProgressBar = true;
        this.networkServiceProviderService.deleteMasterNetworkServiceProvider(deletData).subscribe(data => {
          this.networkServiceProviderService.getMasterNetworkServiceProvider().subscribe((masterMobileNetwork: any) => {
            this.mobileNetwork = this.global.tableIndex(masterMobileNetwork.data)
            this.isProgressBar = false;
            if (this.mobileNetwork.length > 0) {
              this.isData = false;
              this.isTable = true;
            } else if (this.mobileNetwork.length === 0) {
              this.isTable = false;
              this.isData = true;
            }
          })
        })
        Swal.fire({
          icon: 'success',
          title: 'Network Service Provider ' + name + ' has beeen deleted.',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Network Service Provider  is safe :)',
          'error'
        )
      }
    })
  }
}
