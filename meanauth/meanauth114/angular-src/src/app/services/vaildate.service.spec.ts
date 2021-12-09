import { TestBed } from '@angular/core/testing';

import { VaildateService } from './vaildate.service';

describe('VaildateService', () => {
  let service: VaildateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaildateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
