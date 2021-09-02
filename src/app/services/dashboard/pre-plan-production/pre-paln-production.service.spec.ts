import { TestBed } from '@angular/core/testing';

import { PrePalnProductionService } from './pre-paln-production.service';

describe('PrePalnProductionService', () => {
  let service: PrePalnProductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrePalnProductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
