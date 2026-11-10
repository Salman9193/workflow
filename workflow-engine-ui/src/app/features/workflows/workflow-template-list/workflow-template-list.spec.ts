import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTemplateList } from './workflow-template-list';

describe('WorkflowTemplateList', () => {
  let component: WorkflowTemplateList;
  let fixture: ComponentFixture<WorkflowTemplateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowTemplateList],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowTemplateList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
