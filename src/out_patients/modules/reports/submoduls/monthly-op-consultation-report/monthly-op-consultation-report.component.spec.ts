import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyOpConsultationReportComponent } from './monthly-op-consultation-report.component';

describe('MonthlyOpConsultationReportComponent', () => {
  let component: MonthlyOpConsultationReportComponent;
  let fixture: ComponentFixture<MonthlyOpConsultationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyOpConsultationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyOpConsultationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
