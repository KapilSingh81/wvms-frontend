import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirnmation } from './delete-confirnmation';

describe('DeleteConfirnmation', () => {
  let component: DeleteConfirnmation;
  let fixture: ComponentFixture<DeleteConfirnmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirnmation],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirnmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
