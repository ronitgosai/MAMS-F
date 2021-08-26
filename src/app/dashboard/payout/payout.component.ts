import { Component, OnInit, ViewChild } from '@angular/core';
import { AdvanceSalaryComponent } from './advance-salary/advance-salary.component';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {

  @ViewChild(AdvanceSalaryComponent) advanceSalaryComponent: AdvanceSalaryComponent; 

  constructor() { }

  ngOnInit(): void {
  }

  tabChange(event){
    if(event.index === 1 ){
      this.advanceSalaryComponent.ngOnInit()
    }
  }
}
