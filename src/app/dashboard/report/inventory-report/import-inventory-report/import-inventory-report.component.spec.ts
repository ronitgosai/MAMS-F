import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportInventoryReportComponent } from './import-inventory-report.component';

describe('ImportInventoryReportComponent', () => {
  let component: ImportInventoryReportComponent;
  let fixture: ComponentFixture<ImportInventoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportInventoryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
