import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  constructor() { }

  masterRawMaterialRole: boolean;
  masterInventoryRole: boolean;
  masterProductRole: boolean;
  masterProductCategoryRole: boolean;
  masterCurrencyRole: boolean;
  masterCustomerRole: boolean;
  mailServiceRole: boolean;
  masterNetworkServiceProviderRole: boolean;
  masterWorkAreaRole: boolean;
  masterShiftRole: boolean;
  manageRole: boolean;
  allRole: boolean;

  ngOnInit(): void {
    this.getMasterRawMaterialRole();
    this.getMasterInventoryRole();
    this.getMasterProductRole();
    this.getMasterProductCategoryRole();
    this.getMasterCurrencyRole();
    this.getMasterCustomerRole();
    this.getMailServiceRole();
    this.getMasterNetworkServiceProviderRole();
    this.getMatserWorkAreaRole();
    this.getMasterShiftRole();
    this.getManageRole();
  }

  getMasterRawMaterialRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterRawMaterialRole = role.some((r) => {
      return r === ('SMhEhECtrjztndfLHJpUycGoOInRJDAm' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterInventoryRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterInventoryRole = role.some((r) => {
      return r === ('jHHTadfMFjrbngUmVVbRDzDIQDHlXCts' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterProductRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterProductRole = role.some((r) => {
      return r === ('NwQzwHgNfVoXDTGVRyJrsXnvHvdRMTxY' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterProductCategoryRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterProductCategoryRole = role.some((r) => {
      return r === ('dDvTQtIhUbXPYuWiTsmxIIwpWbALzUTN' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterCurrencyRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterCurrencyRole = role.some((r) => {
      return r === ('EfrQIjVaeJtxDRpktaQUQMqSBikSPdPY' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterCustomerRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterCustomerRole = role.some((r) => {
      return r === ('LfyTorGhUjYlElCmCQcoYyybFUzwOtSx' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMailServiceRole() {
    let role = localStorage.getItem('role').split(',');
    this.mailServiceRole = role.some((r) => {
      return r === ('UGXQwGdXNyFxNWxOmiFOfCYpqGuPPZdG' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterNetworkServiceProviderRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterNetworkServiceProviderRole = role.some((r) => {
      return r === ('buQiBEQOYeNMRXfWLjUVddEUlYtyHSQQ' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMatserWorkAreaRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterWorkAreaRole = role.some((r) => {
      return r === ('edGKrdTgQvVWMQRBGZtXIspGtRkeeHfM' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getMasterShiftRole() {
    let role = localStorage.getItem('role').split(',');
    this.masterShiftRole = role.some((r) => {
      return r === ('nRFrSAovSQnmhqGDXUAUMSfrMrIgTfFr' || 'hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };

  getManageRole() {
    let role = localStorage.getItem('role').split(',');
    this.manageRole = role.some((r) => {
      return r === ('hyiplPDFbNmTAipsGakHYnVTZtZvgPsD');
    })
  };
}