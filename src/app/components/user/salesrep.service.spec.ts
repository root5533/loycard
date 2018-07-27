import { TestBed, inject } from '@angular/core/testing';

import { SalesrepService } from './salesrep.service';

describe('SalesrepService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesrepService]
    });
  });

  it('should be created', inject([SalesrepService], (service: SalesrepService) => {
    expect(service).toBeTruthy();
  }));
});
