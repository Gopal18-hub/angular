import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDepositReportComponent } from './online-deposit-report.component';

describe('OnlineDepositReportComponent', () => {
  let component: OnlineDepositReportComponent;
  let fixture: ComponentFixture<OnlineDepositReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineDepositReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDepositReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
