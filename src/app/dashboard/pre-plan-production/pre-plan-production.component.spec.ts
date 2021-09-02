import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePlanProductionComponent } from './pre-plan-production.component';

describe('PrePlanProductionComponent', () => {
  let component: PrePlanProductionComponent;
  let fixture: ComponentFixture<PrePlanProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrePlanProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePlanProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
