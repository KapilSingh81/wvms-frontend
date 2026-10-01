import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVisitorList } from './employee-visitor-list';

describe('EmployeeVisitorList', () => {
  let component: EmployeeVisitorList;
  let fixture: ComponentFixture<EmployeeVisitorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeVisitorList],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeVisitorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
