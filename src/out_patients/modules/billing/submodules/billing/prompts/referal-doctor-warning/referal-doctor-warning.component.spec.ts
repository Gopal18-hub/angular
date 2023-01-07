import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalDoctorWarningComponent } from './referal-doctor-warning.component';

describe('ReferalDoctorWarningComponent', () => {
  let component: ReferalDoctorWarningComponent;
  let fixture: ComponentFixture<ReferalDoctorWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferalDoctorWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalDoctorWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
