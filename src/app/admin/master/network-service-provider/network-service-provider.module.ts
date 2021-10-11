import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkServiceProviderComponent } from './network-service-provider.component';
import { SharedModule } from 'app/shared.module';

@NgModule({
  declarations: [
    NetworkServiceProviderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    NetworkServiceProviderComponent
  ]
})

export class NetworkServiceProviderModule { }