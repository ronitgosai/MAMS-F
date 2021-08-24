import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastProductionReportComponent } from './past-production-report.component';

describe('PastProductionReportComponent', () => {
  let component: PastProductionReportComponent;
  let fixture: ComponentFixture<PastProductionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastProductionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastProductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
