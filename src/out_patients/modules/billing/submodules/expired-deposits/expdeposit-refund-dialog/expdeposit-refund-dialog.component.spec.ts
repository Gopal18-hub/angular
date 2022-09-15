import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpdepositRefundDialogComponent } from './expdeposit-refund-dialog.component';

describe('ExpdepositRefundDialogComponent', () => {
  let component: ExpdepositRefundDialogComponent;
  let fixture: ComponentFixture<ExpdepositRefundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpdepositRefundDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpdepositRefundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
