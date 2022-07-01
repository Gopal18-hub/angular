import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredPatientCheckComponent } from './expired-patient-check.component';

describe('ExpiredPatientCheckComponent', () => {
  let component: ExpiredPatientCheckComponent;
  let fixture: ComponentFixture<ExpiredPatientCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredPatientCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredPatientCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
