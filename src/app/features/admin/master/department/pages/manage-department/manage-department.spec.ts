import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepartment } from './manage-department';

describe('ManageDepartment', () => {
  let component: ManageDepartment;
  let fixture: ComponentFixture<ManageDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDepartment],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageDepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
