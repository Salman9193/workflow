import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalStep } from './approval-step';

describe('ApprovalStep', () => {
  let component: ApprovalStep;
  let fixture: ComponentFixture<ApprovalStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalStep],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
