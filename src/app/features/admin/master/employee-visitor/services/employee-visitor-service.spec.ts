import { TestBed } from '@angular/core/testing';

import { EmployeeVisitorService } from './employee-visitor-service';

describe('EmployeeVisitorService', () => {
  let service: EmployeeVisitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeVisitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
