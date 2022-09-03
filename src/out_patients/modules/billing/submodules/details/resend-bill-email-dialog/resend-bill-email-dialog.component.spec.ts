import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendBillEmailDialogComponent } from './resend-bill-email-dialog.component';

describe('ResendBillEmailDialogComponent', () => {
  let component: ResendBillEmailDialogComponent;
  let fixture: ComponentFixture<ResendBillEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendBillEmailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendBillEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
