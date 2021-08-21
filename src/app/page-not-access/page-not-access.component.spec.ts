import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotAccessComponent } from './page-not-access.component';

describe('PageNotAccessComponent', () => {
  let component: PageNotAccessComponent;
  let fixture: ComponentFixture<PageNotAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageNotAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
