import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientIdentityInfoComponent } from './patient-identity-info.component';

describe('PatientIdentityInfoComponent', () => {
  let component: PatientIdentityInfoComponent;
  let fixture: ComponentFixture<PatientIdentityInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientIdentityInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientIdentityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
