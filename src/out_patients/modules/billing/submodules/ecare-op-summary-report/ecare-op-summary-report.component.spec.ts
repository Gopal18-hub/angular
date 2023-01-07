import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcareOpSummaryReportComponent } from './ecare-op-summary-report.component';

describe('EcareOpSummaryReportComponent', () => {
  let component: EcareOpSummaryReportComponent;
  let fixture: ComponentFixture<EcareOpSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcareOpSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcareOpSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
