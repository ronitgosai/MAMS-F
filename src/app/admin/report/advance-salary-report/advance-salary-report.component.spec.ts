import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSalaryReportComponent } from './advance-salary-report.component';

describe('AdvanceSalaryReportComponent', () => {
  let component: AdvanceSalaryReportComponent;
  let fixture: ComponentFixture<AdvanceSalaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSalaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSalaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
