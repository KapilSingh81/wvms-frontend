import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDesignation } from './manage-designation';

describe('ManageDesignation', () => {
  let component: ManageDesignation;
  let fixture: ComponentFixture<ManageDesignation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDesignation],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageDesignation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
