import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDoctorComponent } from './external-doctor.component';

describe('ExternalDoctorComponent', () => {
  let component: ExternalDoctorComponent;
  let fixture: ComponentFixture<ExternalDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
