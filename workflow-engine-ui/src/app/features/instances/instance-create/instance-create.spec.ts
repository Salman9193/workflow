import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceCreate } from './instance-create';

describe('InstanceCreate', () => {
  let component: InstanceCreate;
  let fixture: ComponentFixture<InstanceCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstanceCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(InstanceCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
