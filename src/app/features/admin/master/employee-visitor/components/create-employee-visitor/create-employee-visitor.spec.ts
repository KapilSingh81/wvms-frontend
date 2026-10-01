import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeVisitor } from './create-employee-visitor';

describe('CreateEmployeeVisitor', () => {
  let component: CreateEmployeeVisitor;
  let fixture: ComponentFixture<CreateEmployeeVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEmployeeVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
