import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementScrollAmountReportComponent } from './acknowledgement-scroll-amount-report.component';

describe('AcknowledgementScrollAmountReportComponent', () => {
  let component: AcknowledgementScrollAmountReportComponent;
  let fixture: ComponentFixture<AcknowledgementScrollAmountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementScrollAmountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgementScrollAmountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
