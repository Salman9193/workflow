import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderPage } from './form-builder-page';

describe('FormBuilderPage', () => {
  let component: FormBuilderPage;
  let fixture: ComponentFixture<FormBuilderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilderPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBuilderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
