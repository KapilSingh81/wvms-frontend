import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRole } from './manage-role';

describe('ManageRole', () => {
  let component: ManageRole;
  let fixture: ComponentFixture<ManageRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRole],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
