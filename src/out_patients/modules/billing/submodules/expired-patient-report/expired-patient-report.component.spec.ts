import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredPatientReportComponent } from './expired-patient-report.component';

describe('ExpiredPatientReportComponent', () => {
  let component: ExpiredPatientReportComponent;
  let fixture: ComponentFixture<ExpiredPatientReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredPatientReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredPatientReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
