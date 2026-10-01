import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesignation } from './create-designation';

describe('CreateDesignation', () => {
  let component: CreateDesignation;
  let fixture: ComponentFixture<CreateDesignation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDesignation],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDesignation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
