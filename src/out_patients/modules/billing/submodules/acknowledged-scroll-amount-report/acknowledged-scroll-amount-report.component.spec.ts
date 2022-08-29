import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgedScrollAmountReportComponent } from './acknowledged-scroll-amount-report.component';

describe('AcknowledgedScrollAmountReportComponent', () => {
  let component: AcknowledgedScrollAmountReportComponent;
  let fixture: ComponentFixture<AcknowledgedScrollAmountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgedScrollAmountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgedScrollAmountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
