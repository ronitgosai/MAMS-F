import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkServiceProviderComponent } from './network-service-provider.component';

describe('NetworkServiceProviderComponent', () => {
  let component: NetworkServiceProviderComponent;
  let fixture: ComponentFixture<NetworkServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkServiceProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
