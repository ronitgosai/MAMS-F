import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMaterialReportComponent } from './import-material-report.component';

describe('ImportMaterialReportComponent', () => {
  let component: ImportMaterialReportComponent;
  let fixture: ComponentFixture<ImportMaterialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMaterialReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMaterialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
