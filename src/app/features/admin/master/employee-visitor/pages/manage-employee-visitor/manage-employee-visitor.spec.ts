import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeVisitor } from './manage-employee-visitor';

describe('ManageEmployeeVisitor', () => {
  let component: ManageEmployeeVisitor;
  let fixture: ComponentFixture<ManageEmployeeVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEmployeeVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageEmployeeVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
