import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeReport } from './manage-employee-report';

describe('ManageEmployeeReport', () => {
  let component: ManageEmployeeReport;
  let fixture: ComponentFixture<ManageEmployeeReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEmployeeReport],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageEmployeeReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
