import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDoctorComponent } from './internal-doctor.component';

describe('InternalDoctorComponent', () => {
  let component: InternalDoctorComponent;
  let fixture: ComponentFixture<InternalDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
