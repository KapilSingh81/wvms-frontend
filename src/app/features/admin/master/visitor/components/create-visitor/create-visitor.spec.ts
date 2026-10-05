import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisitor } from './create-visitor';

describe('CreateVisitor', () => {
  let component: CreateVisitor;
  let fixture: ComponentFixture<CreateVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
