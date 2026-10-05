import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVisitor } from './manage-visitor';

describe('ManageVisitor', () => {
  let component: ManageVisitor;
  let fixture: ComponentFixture<ManageVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
