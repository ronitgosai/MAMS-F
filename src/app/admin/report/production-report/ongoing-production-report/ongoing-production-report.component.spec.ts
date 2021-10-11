import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingProductionReportComponent } from './ongoing-production-report.component';

describe('OngoingProductionReportComponent', () => {
  let component: OngoingProductionReportComponent;
  let fixture: ComponentFixture<OngoingProductionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingProductionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingProductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
