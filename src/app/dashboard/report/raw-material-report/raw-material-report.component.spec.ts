import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialReportComponent } from './raw-material-report.component';

describe('RawMaterialReportComponent', () => {
  let component: RawMaterialReportComponent;
  let fixture: ComponentFixture<RawMaterialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
