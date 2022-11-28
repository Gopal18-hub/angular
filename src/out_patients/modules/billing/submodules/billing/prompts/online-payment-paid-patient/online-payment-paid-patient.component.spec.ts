import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePaymentPaidPatientComponent } from './online-payment-paid-patient.component';

describe('OnlinePaymentPaidPatientComponent', () => {
  let component: OnlinePaymentPaidPatientComponent;
  let fixture: ComponentFixture<OnlinePaymentPaidPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlinePaymentPaidPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinePaymentPaidPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
