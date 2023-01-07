import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRefundReceiptDialogComponent } from './print-refund-receipt-dialog.component';

describe('PrintRefundReceiptDialogComponent', () => {
  let component: PrintRefundReceiptDialogComponent;
  let fixture: ComponentFixture<PrintRefundReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintRefundReceiptDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRefundReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
